resource "aws_s3_bucket" "album_processor" {
  bucket = "album-processor-matches"
}

resource "aws_s3_bucket_ownership_controls" "album_processor" {
  bucket = aws_s3_bucket.album_processor.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "album_processor" {
  depends_on = [aws_s3_bucket_ownership_controls.album_processor]
  bucket     = aws_s3_bucket.album_processor.id
  acl        = "private"
}

