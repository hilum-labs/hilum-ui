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

variable "create_codecommit_repository" {
  description = "Whether Terraform should create the primary CodeCommit repository."
  type        = bool
  default     = true
}

variable "codecommit_repository_name" {
  description = "CodeCommit repository name for Hilum UI."
  type        = string
  default     = "hilum-ui"
}

variable "enable_codecommit_release_pipeline" {
  description = "Whether to run AWS-native releases from CodeCommit main updates."
  type        = bool
  default     = true
}

variable "release_branch" {
  description = "CodeCommit branch that triggers automatic patch releases."
  type        = string
  default     = "main"
}

variable "create_npm_token_secret" {
  description = "Whether Terraform should create the Secrets Manager secret that stores the npm automation token."
  type        = bool
  default     = true
}

variable "npm_token_secret_name" {
  description = "Secrets Manager secret name that stores the npm automation token as a plain secret string."
  type        = string
  default     = "hilum-ui/prod/npm-token"
}

variable "codebuild_image" {
  description = "CodeBuild image used for AWS-native releases."
  type        = string
  default     = "aws/codebuild/standard:7.0"
}

variable "codebuild_compute_type" {
  description = "CodeBuild compute size used for AWS-native releases."
  type        = string
  default     = "BUILD_GENERAL1_MEDIUM"
}

variable "codebuild_timeout_minutes" {
  description = "Maximum duration for AWS-native release builds."
  type        = number
  default     = 30
}

variable "tags" {
  description = "Additional tags to apply to all AWS resources."
  type        = map(string)
  default     = {}
}
