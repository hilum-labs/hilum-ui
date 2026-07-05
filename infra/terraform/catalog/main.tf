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

  codecommit_release_enabled = var.enable_codecommit_release_pipeline && var.create_cloudfront_distribution
  codecommit_repository_arn = var.create_codecommit_repository ? aws_codecommit_repository.hilum_ui[0].arn : (
    "arn:aws:codecommit:${var.aws_region}:${data.aws_caller_identity.current.account_id}:${var.codecommit_repository_name}"
  )
  codecommit_repository_clone_url = var.create_codecommit_repository ? aws_codecommit_repository.hilum_ui[0].clone_url_http : (
    "https://git-codecommit.${var.aws_region}.amazonaws.com/v1/repos/${var.codecommit_repository_name}"
  )
  npm_token_secret_arn = local.codecommit_release_enabled ? (
    var.create_npm_token_secret ? aws_secretsmanager_secret.npm_token[0].arn : data.aws_secretsmanager_secret.npm_token[0].arn
  ) : null

  route53_zone_id = var.create_route53_zone ? aws_route53_zone.catalog[0].zone_id : (
    var.create_route53_records ? data.aws_route53_zone.catalog[0].zone_id : null
  )
}

data "aws_caller_identity" "current" {}

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

# ── CodeCommit source of truth and AWS-native release/deploy ─────────────────

resource "aws_codecommit_repository" "hilum_ui" {
  count = var.create_codecommit_repository ? 1 : 0

  repository_name = var.codecommit_repository_name
  description     = "Hilum UI source of truth. Pushes to ${var.release_branch} publish npm packages and deploy the catalog."

  tags = local.common_tags
}

resource "aws_secretsmanager_secret" "npm_token" {
  count = local.codecommit_release_enabled && var.create_npm_token_secret ? 1 : 0

  name        = var.npm_token_secret_name
  description = "npm automation token used by the Hilum UI CodeBuild release pipeline."

  tags = local.common_tags
}

data "aws_secretsmanager_secret" "npm_token" {
  count = local.codecommit_release_enabled && !var.create_npm_token_secret ? 1 : 0

  name = var.npm_token_secret_name
}

resource "aws_cloudwatch_log_group" "codebuild_release" {
  count = local.codecommit_release_enabled ? 1 : 0

  name              = "/aws/codebuild/${var.project_name}-${var.environment}-release"
  retention_in_days = 30

  tags = local.common_tags
}

data "aws_iam_policy_document" "codebuild_release_assume_role" {
  count = local.codecommit_release_enabled ? 1 : 0

  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["codebuild.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "codebuild_release" {
  count = local.codecommit_release_enabled ? 1 : 0

  name               = "${var.project_name}-${var.environment}-release-build"
  assume_role_policy = data.aws_iam_policy_document.codebuild_release_assume_role[0].json

  tags = local.common_tags
}

data "aws_iam_policy_document" "codebuild_release" {
  count = local.codecommit_release_enabled ? 1 : 0

  statement {
    sid    = "Logs"
    effect = "Allow"
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = ["${aws_cloudwatch_log_group.codebuild_release[0].arn}:*"]
  }

  statement {
    sid    = "CodeCommitReadWrite"
    effect = "Allow"
    actions = [
      "codecommit:BatchGetRepositories",
      "codecommit:GetBranch",
      "codecommit:GetCommit",
      "codecommit:GetRepository",
      "codecommit:GitPull",
      "codecommit:GitPush",
    ]
    resources = [local.codecommit_repository_arn]
  }

  statement {
    sid    = "NpmToken"
    effect = "Allow"
    actions = [
      "secretsmanager:GetSecretValue",
    ]
    resources = [local.npm_token_secret_arn]
  }

  statement {
    sid    = "S3CatalogDeploy"
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

resource "aws_iam_role_policy" "codebuild_release" {
  count = local.codecommit_release_enabled ? 1 : 0

  name   = "release-and-deploy"
  role   = aws_iam_role.codebuild_release[0].id
  policy = data.aws_iam_policy_document.codebuild_release[0].json
}

resource "aws_codebuild_project" "release" {
  count = local.codecommit_release_enabled ? 1 : 0

  name          = "${var.project_name}-${var.environment}-release"
  description   = "Publishes Hilum UI npm packages and deploys the catalog from CodeCommit."
  service_role  = aws_iam_role.codebuild_release[0].arn
  build_timeout = var.codebuild_timeout_minutes

  artifacts {
    type = "NO_ARTIFACTS"
  }

  environment {
    compute_type                = var.codebuild_compute_type
    image                       = var.codebuild_image
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"

    environment_variable {
      name  = "CODECOMMIT_REPO_NAME"
      value = var.codecommit_repository_name
    }

    environment_variable {
      name  = "RELEASE_BRANCH"
      value = var.release_branch
    }

    environment_variable {
      name  = "CATALOG_BUCKET_NAME"
      value = aws_s3_bucket.catalog.id
    }

    environment_variable {
      name  = "CATALOG_CLOUDFRONT_DISTRIBUTION_ID"
      value = aws_cloudfront_distribution.catalog[0].id
    }

    environment_variable {
      name  = "NPM_TOKEN"
      value = local.npm_token_secret_arn
      type  = "SECRETS_MANAGER"
    }
  }

  logs_config {
    cloudwatch_logs {
      group_name  = aws_cloudwatch_log_group.codebuild_release[0].name
      stream_name = "release"
    }
  }

  source {
    type            = "CODECOMMIT"
    location        = local.codecommit_repository_clone_url
    git_clone_depth = 0
    buildspec       = "buildspec.aws-release.yml"
  }

  source_version = "refs/heads/${var.release_branch}"

  tags = local.common_tags
}

resource "aws_cloudwatch_event_rule" "codecommit_main_updated" {
  count = local.codecommit_release_enabled ? 1 : 0

  name        = "${var.project_name}-${var.environment}-codecommit-main-updated"
  description = "Start Hilum UI release when ${var.codecommit_repository_name}/${var.release_branch} is updated."

  event_pattern = jsonencode({
    source      = ["aws.codecommit"]
    detail-type = ["CodeCommit Repository State Change"]
    resources   = [local.codecommit_repository_arn]
    detail = {
      event         = ["referenceUpdated", "referenceCreated"]
      referenceType = ["branch"]
      referenceName = [var.release_branch]
    }
  })

  tags = local.common_tags
}

data "aws_iam_policy_document" "eventbridge_start_codebuild_assume_role" {
  count = local.codecommit_release_enabled ? 1 : 0

  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["events.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "eventbridge_start_codebuild" {
  count = local.codecommit_release_enabled ? 1 : 0

  name               = "${var.project_name}-${var.environment}-start-release-build"
  assume_role_policy = data.aws_iam_policy_document.eventbridge_start_codebuild_assume_role[0].json

  tags = local.common_tags
}

data "aws_iam_policy_document" "eventbridge_start_codebuild" {
  count = local.codecommit_release_enabled ? 1 : 0

  statement {
    effect = "Allow"
    actions = [
      "codebuild:StartBuild",
    ]
    resources = [aws_codebuild_project.release[0].arn]
  }
}

resource "aws_iam_role_policy" "eventbridge_start_codebuild" {
  count = local.codecommit_release_enabled ? 1 : 0

  name   = "start-codebuild-release"
  role   = aws_iam_role.eventbridge_start_codebuild[0].id
  policy = data.aws_iam_policy_document.eventbridge_start_codebuild[0].json
}

resource "aws_cloudwatch_event_target" "codebuild_release" {
  count = local.codecommit_release_enabled ? 1 : 0

  rule      = aws_cloudwatch_event_rule.codecommit_main_updated[0].name
  target_id = "codebuild-release"
  arn       = aws_codebuild_project.release[0].arn
  role_arn  = aws_iam_role.eventbridge_start_codebuild[0].arn
}
