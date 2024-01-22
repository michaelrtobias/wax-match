resource "aws_sqs_queue" "album_processor" {
  name                       = "album-processor"
  visibility_timeout_seconds = 30
  message_retention_seconds  = 86400
  receive_wait_time_seconds  = 10
  # redrive_policy = jsonencode({
  #   deadLetterTargetArn = aws_sqs_queue.terraform_queue_deadletter.arn
  #   maxReceiveCount     = 4
  # })
}

resource "aws_lambda_event_source_mapping" "album_processor" {
  event_source_arn = aws_sqs_queue.album_processor.arn
  function_name    = local.discogs_lambdas["album-processor"].arn
  batch_size       = 1
}

resource "aws_sqs_queue" "album_writer" {
  name                       = "album-writer"
  visibility_timeout_seconds = 30
  message_retention_seconds  = 86400
  receive_wait_time_seconds  = 10
  # redrive_policy = jsonencode({
  #   deadLetterTargetArn = aws_sqs_queue.terraform_queue_deadletter.arn
  #   maxReceiveCount     = 4
  # })
}

resource "aws_lambda_event_source_mapping" "album_writer" {
  event_source_arn = aws_sqs_queue.album_writer.arn
  function_name    = local.discogs_lambdas["album-writer"].arn
  batch_size       = 1
}
