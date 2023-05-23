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

  runtime = "nodejs18.x"
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

resource "aws_iam_policy" "common_lambda_policy" {
  name        = "discogs-common-lambda-policy"
  path        = "/"
  description = "IAM policy for logging from a lambda"
  policy      = data.aws_iam_policy_document.common_discogs_lambda_policy.json
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  for_each   = var.discogs_lambdas
  role       = aws_iam_role.discogs_lambdas[each.key].name
  policy_arn = aws_iam_policy.common_lambda_policy.arn
}
