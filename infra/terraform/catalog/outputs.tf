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

output "github_actions_deploy_role_arn" {
  description = "IAM role ARN for GitHub Actions catalog deploys — set as CATALOG_DEPLOY_ROLE_ARN secret."
  value       = local.github_actions_enabled ? aws_iam_role.github_actions_catalog_deployer[0].arn : null
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
