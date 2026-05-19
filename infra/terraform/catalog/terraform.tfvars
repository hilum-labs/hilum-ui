project_name   = "hilum-ui"
environment    = "prod"
domain_name    = "ui.hilum.dev"

# hilum.dev is managed in Namecheap — DNS records are added manually
create_route53_records = false
create_route53_zone    = false

create_cloudfront_distribution = true

github_repository = "hilum-labs/hilum-ui"
github_branch     = "main"
