variable "discogs_lambdas" {
  type = map(string)
  default = {
    discogs-request-token = "discogs-request-token"
    discogs-access-token  = "discogs-access-token"
  }
}
