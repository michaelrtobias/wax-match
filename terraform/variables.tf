variable "discogs_lambdas" {
  type = map(any)
  default = {
    discogs-request-token = "discogs-request-token"
    discogs-access-token  = "discogs-access-token"
    discogs-identity      = "discogs-identity"
  }
}


variable "waxmatch_cognito_pool_name" {
  type    = string
  default = "waxmatcher-login"
}
