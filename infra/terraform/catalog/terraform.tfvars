project_name = "hilum-ui"
environment  = "prod"
domain_name  = "ui.hilum.dev"

# hilum.dev is managed in Namecheap — DNS records are added manually
create_route53_records = false
create_route53_zone    = false

create_cloudfront_distribution = true

create_codecommit_repository       = true
codecommit_repository_name         = "hilum-ui"
enable_codecommit_release_pipeline = true
release_branch                     = "main"
create_npm_token_secret            = true
npm_token_secret_name              = "hilum-ui/prod/npm-token"
