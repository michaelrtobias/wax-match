variable "discogs_lambdas" {
  type = map(any)
  default = {
    discogs-request-token           = "discogs-request-token"
    discogs-access-token            = "discogs-access-token"
    discogs-identity                = "discogs-identity"
    discogs-get-collection-releases = "discogs-get-collection-releases"
    discogs-sync                    = "discogs-sync"
    album-processor                 = "album-processor"
    album-writer                    = "album-writer"
  }
}

variable "waxmatch_cognito_pool_name" {
  type    = string
  default = "waxmatcher-login"
}
