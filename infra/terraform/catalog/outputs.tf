output "catalog_bucket_name" {
  description = "S3 bucket that stores the built catalog assets."
  value       = aws_s3_bucket.catalog.id
}

output "catalog_bucket_arn" {
  description = "ARN of the catalog S3 bucket."
  value       = aws_s3_bucket.catalog.arn
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID — needed for cache invalidation in CI."
  value       = var.create_cloudfront_distribution ? aws_cloudfront_distribution.catalog[0].id : null
}

output "cloudfront_distribution_arn" {
  description = "CloudFront distribution ARN."
  value       = var.create_cloudfront_distribution ? aws_cloudfront_distribution.catalog[0].arn : null
}

output "cloudfront_distribution_domain_name" {
  description = "AWS-assigned CloudFront hostname."
  value       = var.create_cloudfront_distribution ? aws_cloudfront_distribution.catalog[0].domain_name : null
}

output "catalog_url" {
  description = "Public catalog URL."
  value       = "https://${var.domain_name}"
}

output "codecommit_repository_name" {
  description = "Primary Hilum UI CodeCommit repository name."
  value       = var.codecommit_repository_name
}

output "codecommit_clone_url_http" {
  description = "HTTPS clone URL for the primary Hilum UI CodeCommit repository."
  value       = local.codecommit_repository_clone_url
}

output "codebuild_release_project_name" {
  description = "CodeBuild project that auto-bumps patch releases, publishes npm packages, and deploys the catalog."
  value       = local.codecommit_release_enabled ? aws_codebuild_project.release[0].name : null
}

output "npm_token_secret_name" {
  description = "Secrets Manager secret name that must contain the npm automation token."
  value       = var.npm_token_secret_name
}

output "npm_token_secret_arn" {
  description = "Secrets Manager secret ARN that must contain the npm automation token."
  value       = local.codecommit_release_enabled ? local.npm_token_secret_arn : null
}

output "route53_zone_id" {
  description = "Route53 hosted zone ID when Terraform creates or manages DNS records."
  value       = local.route53_zone_id
}

output "route53_name_servers" {
  description = "Nameservers to set at the registrar when Terraform creates the Route53 hosted zone."
  value       = var.create_route53_zone ? aws_route53_zone.catalog[0].name_servers : []
}

output "manual_dns_acm_validation_records" {
  description = "DNS records to create manually when create_route53_records is false."
  value = [
    for option in aws_acm_certificate.catalog.domain_validation_options : {
      type  = option.resource_record_type
      name  = option.resource_record_name
      value = option.resource_record_value
    }
  ]
}

output "manual_dns_catalog_record" {
  description = "CNAME record to create manually when create_route53_records is false."
  value = {
    type  = "CNAME"
    name  = var.domain_name
    value = var.create_cloudfront_distribution ? aws_cloudfront_distribution.catalog[0].domain_name : null
  }
}
