resource "aws_sqs_queue" "song_processor" {
  name                      = "song-processor"
  delay_seconds             = 30
  max_message_size          = 2048
  message_retention_seconds = 86400
  receive_wait_time_seconds = 10
  # redrive_policy = jsonencode({
  #   deadLetterTargetArn = aws_sqs_queue.terraform_queue_deadletter.arn
  #   maxReceiveCount     = 4
  # })
}

resource "aws_lambda_event_source_mapping" "song_processor" {
  event_source_arn = aws_sqs_queue.song_processor.arn
  function_name    = local.discogs_lambdas["song-processor"].arn
  batch_size       = 1
}
