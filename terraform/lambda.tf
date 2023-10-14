locals {
  discogs_lambda_roles = aws_iam_role.discogs_lambdas
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "discogs_lambdas" {
  for_each           = var.discogs_lambdas
  name               = "${each.key}-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}


resource "aws_lambda_function" "discogs_lambdas" {
  for_each         = var.discogs_lambdas
  function_name    = each.key
  role             = aws_iam_role.discogs_lambdas[each.key].arn
  handler          = "index.handler"
  filename         = "./build-artifacts/${each.key}.zip"
  source_code_hash = filebase64sha256("./build-artifacts/${each.key}.zip")
  runtime          = "nodejs18.x"
  timeout          = 30
  environment {
    variables = {
      song_processor_queue_url = aws_sqs_queue.song_processor.url
      consumer_key             = local.discogs_consumer_key
      consumer_secret          = local.discogs_consumer_secret
      spotify_client_id        = local.spotify_token.spotify_client_id
      spotify_client_secret    = local.spotify_token.spotify_client_secret
    }
  }
}

resource "aws_cloudwatch_log_group" "discogs_lambdas" {
  for_each          = var.discogs_lambdas
  name              = "/aws/lambda/${each.key}"
  retention_in_days = 14
}

data "aws_iam_policy_document" "common_discogs_lambda_policy" {
  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    resources = ["arn:aws:logs:*:*:*"]
  }
}

resource "aws_iam_policy" "common_discogs_lambdas" {
  name        = "common_discogs_lambda_policy"
  path        = "/"
  description = "IAM policy for basic lambda stuff"
  policy      = data.aws_iam_policy_document.common_discogs_lambda_policy.json
}

resource "aws_iam_role_policy_attachment" "common_discog_lambdas" {
  for_each   = var.discogs_lambdas
  role       = local.discogs_lambda_roles[each.key].name
  policy_arn = aws_iam_policy.common_discogs_lambdas.arn
}

data "aws_iam_policy_document" "recieve_sqs_messages_lambda_policy" {
  statement {
    effect = "Allow"
    actions = [
      "sqs:ReceiveMessage",
      "sqs:DeleteMessage",
      "sqs:GetQueueAttributes"
    ]
    resources = [aws_sqs_queue.song_processor.arn]
  }
}

resource "aws_iam_policy" "recieve_sqs_messages_lambda_policy" {
  name        = "recieve-sqs-messages-lambda-policy"
  path        = "/"
  description = "IAM policy for recieving messsages from a queue"
  policy      = data.aws_iam_policy_document.recieve_sqs_messages_lambda_policy.json
}

resource "aws_iam_role_policy_attachment" "recieve_sqs_messages_lambda_policy" {
  role       = local.discogs_lambda_roles["song-processor"].name
  policy_arn = aws_iam_policy.recieve_sqs_messages_lambda_policy.arn
}

data "aws_iam_policy_document" "send_sqs_messages_lambda_policy" {
  statement {
    effect = "Allow"
    actions = [
      "sqs:SendMessage",
      "sqs:DeleteMessage",
      "sqs:GetQueueAttributes"
    ]
    resources = [aws_sqs_queue.song_processor.arn]
  }
}

resource "aws_iam_policy" "send_sqs_messages_lambda_policy" {
  name        = "send-sqs-messages-lambda-policy"
  path        = "/"
  description = "IAM policy for sending messages to a queue"
  policy      = data.aws_iam_policy_document.send_sqs_messages_lambda_policy.json
}

resource "aws_iam_role_policy_attachment" "send_sqs_messages_lambda_policy" {
  role       = local.discogs_lambda_roles["discogs-sync"].name
  policy_arn = aws_iam_policy.send_sqs_messages_lambda_policy.arn
}

