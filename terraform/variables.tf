variable "discogs_lambdas" {
  type = map(any)
  default = {
    discogs-request-token = "discogs-request-token"
    discogs-access-token  = "discogs-access-token"
  }
}

