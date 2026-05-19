variable "aws_region" {
  description = "Primary AWS region for S3 and Route53 resources."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Short project slug used in resource names and tags."
  type        = string
  default     = "hilum-ui"
}

variable "environment" {
  description = "Environment name, for example prod or staging."
  type        = string
  default     = "prod"
}

variable "domain_name" {
  description = "Catalog hostname served by CloudFront, for example ui.hilum.dev."
  type        = string
}

variable "certificate_subject_alternative_names" {
  description = "Additional hostnames on the ACM certificate."
  type        = list(string)
  default     = []
}

variable "hosted_zone_name" {
  description = "Existing Route53 public hosted zone name, for example hilum.dev."
  type        = string
  default     = ""
}

variable "create_route53_zone" {
  description = "Whether Terraform should create the Route53 public hosted zone."
  type        = bool
  default     = false
}

variable "create_route53_records" {
  description = "Whether Terraform should manage Route53 DNS records."
  type        = bool
  default     = true
}

variable "create_cloudfront_distribution" {
  description = "Whether to create the CloudFront distribution and deploy permissions."
  type        = bool
  default     = true
}

variable "bucket_name_override" {
  description = "Optional explicit S3 bucket name. Leave empty to derive one from the domain."
  type        = string
  default     = ""
}

variable "cloudfront_price_class" {
  description = "CloudFront price class."
  type        = string
  default     = "PriceClass_100"
}

variable "force_destroy_bucket" {
  description = "Whether Terraform may delete the bucket with objects still inside."
  type        = bool
  default     = false
}

variable "github_repository" {
  description = "GitHub repository in owner/name form for the deploy IAM role."
  type        = string
  default     = ""
}

variable "github_branch" {
  description = "Git branch allowed to assume the deploy role."
  type        = string
  default     = "main"
}

variable "github_environment" {
  description = "Optional GitHub environment name allowed to assume the deploy role."
  type        = string
  default     = ""
}

variable "github_oidc_thumbprints" {
  description = "Thumbprints for the GitHub Actions OIDC provider."
  type        = list(string)
  default     = ["6938fd4d98bab03faadb97b34396831e3780aea1"]
}

variable "tags" {
  description = "Additional tags to apply to all AWS resources."
  type        = map(string)
  default     = {}
}
