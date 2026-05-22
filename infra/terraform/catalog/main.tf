locals {
  sanitized_domain = replace(var.domain_name, ".", "-")
  bucket_name      = var.bucket_name_override != "" ? var.bucket_name_override : "${var.project_name}-${var.environment}-${local.sanitized_domain}"

  common_tags = merge(
    {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
      Stack       = "catalog"
    },
    var.tags
  )

  github_actions_enabled = var.github_repository != "" && var.create_cloudfront_distribution
  github_actions_subjects = concat(
    ["repo:${var.github_repository}:ref:refs/heads/${var.github_branch}"],
    var.github_environment != "" ? ["repo:${var.github_repository}:environment:${var.github_environment}"] : []
  )

  route53_zone_id = var.create_route53_zone ? aws_route53_zone.catalog[0].zone_id : (
    var.create_route53_records ? data.aws_route53_zone.catalog[0].zone_id : null
  )
}

# ── Route53 ──────────────────────────────────────────────────────────────────

data "aws_route53_zone" "catalog" {
  count = var.create_route53_records && !var.create_route53_zone ? 1 : 0

  name         = var.hosted_zone_name
  private_zone = false
}

resource "aws_route53_zone" "catalog" {
  count = var.create_route53_zone ? 1 : 0

  name = var.hosted_zone_name

  lifecycle {
    prevent_destroy = true
  }

  tags = local.common_tags
}

# ── S3 ───────────────────────────────────────────────────────────────────────

resource "aws_s3_bucket" "catalog" {
  bucket        = local.bucket_name
  force_destroy = var.force_destroy_bucket

  tags = local.common_tags
}

resource "aws_s3_bucket_public_access_block" "catalog" {
  bucket = aws_s3_bucket.catalog.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "catalog" {
  bucket = aws_s3_bucket.catalog.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "catalog" {
  bucket = aws_s3_bucket.catalog.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# ── CloudFront ───────────────────────────────────────────────────────────────

resource "aws_cloudfront_origin_access_control" "catalog" {
  count = var.create_cloudfront_distribution ? 1 : 0

  name                              = "${var.project_name}-${var.environment}-catalog"
  description                       = "Origin access control for ${var.domain_name}"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_function" "catalog_static_routes" {
  count = var.create_cloudfront_distribution ? 1 : 0

  name    = "${var.project_name}-${var.environment}-catalog-static-routes"
  runtime = "cloudfront-js-1.0"
  comment = "Rewrite route requests to prerendered index.html files"
  publish = true
  code    = <<-EOF
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri.endsWith("/")) {
    request.uri = uri + "index.html";
    return request;
  }

  if (!uri.includes(".")) {
    request.uri = uri + "/index.html";
  }

  return request;
}
EOF
}

resource "aws_cloudfront_distribution" "catalog" {
  count = var.create_cloudfront_distribution ? 1 : 0

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${var.project_name} ${var.environment} catalog"
  default_root_object = "index.html"
  aliases             = [var.domain_name]
  price_class         = var.cloudfront_price_class

  origin {
    domain_name              = aws_s3_bucket.catalog.bucket_regional_domain_name
    origin_id                = "s3-${aws_s3_bucket.catalog.id}"
    origin_access_control_id = aws_cloudfront_origin_access_control.catalog[0].id
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "s3-${aws_s3_bucket.catalog.id}"
    compress         = true

    viewer_protocol_policy = "redirect-to-https"
    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6" # Managed-CachingOptimized

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.catalog_static_routes[0].arn
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = var.create_route53_records ? aws_acm_certificate_validation.catalog[0].certificate_arn : aws_acm_certificate.catalog.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  tags = local.common_tags
}

data "aws_iam_policy_document" "catalog_bucket_policy" {
  count = var.create_cloudfront_distribution ? 1 : 0

  statement {
    sid    = "AllowCloudFrontRead"
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.catalog.arn}/*"]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.catalog[0].arn]
    }
  }
}

resource "aws_s3_bucket_policy" "catalog" {
  count = var.create_cloudfront_distribution ? 1 : 0

  bucket = aws_s3_bucket.catalog.id
  policy = data.aws_iam_policy_document.catalog_bucket_policy[0].json
}

# ── ACM certificate (must be us-east-1 for CloudFront) ───────────────────────

resource "aws_acm_certificate" "catalog" {
  provider                  = aws.us_east_1
  domain_name               = var.domain_name
  subject_alternative_names = var.certificate_subject_alternative_names
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = local.common_tags
}

resource "aws_route53_record" "catalog_certificate_validation" {
  for_each = var.create_route53_records ? {
    for option in aws_acm_certificate.catalog.domain_validation_options : option.domain_name => {
      name   = option.resource_record_name
      record = option.resource_record_value
      type   = option.resource_record_type
    }
  } : {}

  zone_id = local.route53_zone_id
  name    = each.value.name
  type    = each.value.type
  ttl     = 60
  records = [each.value.record]
}

resource "aws_acm_certificate_validation" "catalog" {
  count = var.create_route53_records ? 1 : 0

  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.catalog.arn
  validation_record_fqdns = [for record in aws_route53_record.catalog_certificate_validation : record.fqdn]
}

resource "aws_route53_record" "catalog_alias_a" {
  count = var.create_route53_records && var.create_cloudfront_distribution ? 1 : 0

  zone_id = local.route53_zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.catalog[0].domain_name
    zone_id                = aws_cloudfront_distribution.catalog[0].hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "catalog_alias_aaaa" {
  count = var.create_route53_records && var.create_cloudfront_distribution ? 1 : 0

  zone_id = local.route53_zone_id
  name    = var.domain_name
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.catalog[0].domain_name
    zone_id                = aws_cloudfront_distribution.catalog[0].hosted_zone_id
    evaluate_target_health = false
  }
}

# ── GitHub Actions OIDC deploy role ──────────────────────────────────────────

resource "aws_iam_openid_connect_provider" "github_actions" {
  count = local.github_actions_enabled ? 1 : 0

  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = var.github_oidc_thumbprints

  tags = local.common_tags
}

data "aws_iam_policy_document" "github_actions_assume_role" {
  count = local.github_actions_enabled ? 1 : 0

  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github_actions[0].arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values   = local.github_actions_subjects
    }
  }
}

resource "aws_iam_role" "github_actions_catalog_deployer" {
  count = local.github_actions_enabled ? 1 : 0

  name               = "${var.project_name}-${var.environment}-catalog-deployer"
  assume_role_policy = data.aws_iam_policy_document.github_actions_assume_role[0].json

  tags = local.common_tags
}

data "aws_iam_policy_document" "github_actions_catalog_deployer" {
  count = local.github_actions_enabled ? 1 : 0

  statement {
    sid    = "S3Deploy"
    effect = "Allow"
    actions = [
      "s3:DeleteObject",
      "s3:GetBucketLocation",
      "s3:GetObject",
      "s3:ListBucket",
      "s3:PutObject",
    ]
    resources = [
      aws_s3_bucket.catalog.arn,
      "${aws_s3_bucket.catalog.arn}/*",
    ]
  }

  statement {
    sid    = "CloudFrontInvalidate"
    effect = "Allow"
    actions = [
      "cloudfront:CreateInvalidation",
      "cloudfront:GetDistribution",
      "cloudfront:GetInvalidation",
    ]
    resources = [aws_cloudfront_distribution.catalog[0].arn]
  }
}

resource "aws_iam_role_policy" "github_actions_catalog_deployer" {
  count = local.github_actions_enabled ? 1 : 0

  name   = "catalog-deploy"
  role   = aws_iam_role.github_actions_catalog_deployer[0].id
  policy = data.aws_iam_policy_document.github_actions_catalog_deployer[0].json
}
