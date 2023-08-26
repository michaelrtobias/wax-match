locals {
  discogs_lambdas = aws_lambda_function.discogs_lambdas
}
resource "aws_api_gateway_rest_api" "waxmatch" {
  name = "WaxMatchAPI"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_deployment" "waxmatch" {
  rest_api_id = aws_api_gateway_rest_api.waxmatch.id
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "waxmatch" {
  deployment_id = aws_api_gateway_deployment.waxmatch.id
  rest_api_id   = aws_api_gateway_rest_api.waxmatch.id
  stage_name    = "dev"
}

resource "aws_api_gateway_rest_api_policy" "waxmatch" {
  rest_api_id = aws_api_gateway_rest_api.waxmatch.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "assumerole",
      "Effect": "Allow",
      "Principal": {
        "Service": "apigateway.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    },
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "execute-api:Invoke",
      "Resource": "execute-api:/*"
    }
  ]
}
EOF
}


resource "aws_api_gateway_resource" "discogs" {
  rest_api_id = aws_api_gateway_rest_api.waxmatch.id
  parent_id   = aws_api_gateway_rest_api.waxmatch.root_resource_id
  path_part   = "discogs"
}
resource "aws_api_gateway_resource" "discogs_auth" {
  rest_api_id = aws_api_gateway_rest_api.waxmatch.id
  parent_id   = aws_api_gateway_resource.discogs.id
  path_part   = "auth"

}
resource "aws_api_gateway_resource" "discogs_auth_request_token" {
  rest_api_id = aws_api_gateway_rest_api.waxmatch.id
  parent_id   = aws_api_gateway_resource.discogs_auth.id
  path_part   = "request-token"
}

resource "aws_api_gateway_method" "discogs_auth_request_token" {
  rest_api_id   = aws_api_gateway_rest_api.waxmatch.id
  resource_id   = aws_api_gateway_resource.discogs_auth_request_token.id
  http_method   = "GET"
  authorization = "NONE"
  # authorization = "COGNITO_USER_POOLS"
  # authorizer_id = aws_api_gateway_authorizer.cognito_authorizer.id
}

resource "aws_api_gateway_method_response" "discogs_auth_request_token_200" {
  rest_api_id         = aws_api_gateway_rest_api.waxmatch.id
  resource_id         = aws_api_gateway_resource.discogs_auth_request_token.id
  http_method         = aws_api_gateway_method.discogs_auth_request_token.http_method
  response_parameters = { "method.response.header.Access-Control-Allow-Origin" = true }
  response_models = {
    "application/json" = "Empty"
  }
  status_code = "200"
}
resource "aws_api_gateway_method_response" "discogs_auth_request_token_400" {
  rest_api_id = aws_api_gateway_rest_api.waxmatch.id
  resource_id = aws_api_gateway_resource.discogs_auth_request_token.id
  http_method = aws_api_gateway_method.discogs_auth_request_token.http_method
  status_code = "400"
}

resource "aws_api_gateway_integration" "discogs_auth_request_token" {
  rest_api_id             = aws_api_gateway_rest_api.waxmatch.id
  resource_id             = aws_api_gateway_resource.discogs_auth_request_token.id
  http_method             = aws_api_gateway_method.discogs_auth_request_token.http_method
  integration_http_method = "GET"
  type                    = "AWS_PROXY"
  uri                     = local.discogs_lambdas["discogs-request-token"].invoke_arn
}

resource "aws_api_gateway_integration_response" "discogs_auth_request_token" {
  rest_api_id = aws_api_gateway_rest_api.waxmatch.id
  resource_id = aws_api_gateway_resource.discogs_auth_request_token.id
  http_method = aws_api_gateway_method.discogs_auth_request_token.http_method
  status_code = "200"

  response_templates = {
    "application/json" = ""
  }
}
resource "aws_lambda_permission" "discogs_auth_request_token_lambda" {
  statement_id  = "AllowTMGReaddiscogs_authAPIInvoke"
  action        = "lambda:InvokeFunction"
  function_name = local.discogs_lambdas["discogs-request-token"].function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.waxmatch.execution_arn}/*/*/*"
}

// access token
resource "aws_api_gateway_resource" "discogs_auth_access_token" {
  rest_api_id = aws_api_gateway_rest_api.waxmatch.id
  parent_id   = aws_api_gateway_resource.discogs_auth.id
  path_part   = "access-token"
}

resource "aws_api_gateway_method" "discogs_auth_access_token" {
  rest_api_id   = aws_api_gateway_rest_api.waxmatch.id
  resource_id   = aws_api_gateway_resource.discogs_auth_access_token.id
  http_method   = "POST"
  authorization = "NONE"
  # authorization = "COGNITO_USER_POOLS"
  # authorizer_id = aws_api_gateway_authorizer.cognito_authorizer.id
}

resource "aws_api_gateway_method_response" "discogs_auth_access_token_200" {
  rest_api_id         = aws_api_gateway_rest_api.waxmatch.id
  resource_id         = aws_api_gateway_resource.discogs_auth_access_token.id
  http_method         = aws_api_gateway_method.discogs_auth_access_token.http_method
  response_parameters = { "method.response.header.Access-Control-Allow-Origin" = true }
  response_models = {
    "application/json" = "Empty"
  }
  status_code = "200"
}
resource "aws_api_gateway_method_response" "discogs_auth_access_token_400" {
  rest_api_id = aws_api_gateway_rest_api.waxmatch.id
  resource_id = aws_api_gateway_resource.discogs_auth_access_token.id
  http_method = aws_api_gateway_method.discogs_auth_access_token.http_method
  status_code = "400"
}

resource "aws_api_gateway_integration" "discogs_auth_access_token" {
  rest_api_id             = aws_api_gateway_rest_api.waxmatch.id
  resource_id             = aws_api_gateway_resource.discogs_auth_access_token.id
  http_method             = aws_api_gateway_method.discogs_auth_access_token.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = local.discogs_lambdas["discogs-access-token"].invoke_arn
}

resource "aws_api_gateway_integration_response" "discogs_auth_access_token" {
  rest_api_id = aws_api_gateway_rest_api.waxmatch.id
  resource_id = aws_api_gateway_resource.discogs_auth_access_token.id
  http_method = aws_api_gateway_method.discogs_auth_access_token.http_method
  status_code = "200"

  response_templates = {
    "application/json" = ""
  }
}
resource "aws_lambda_permission" "discogs_auth_access_token_lambda" {
  statement_id  = "AllowTMGReaddiscogs_authAPIInvoke"
  action        = "lambda:InvokeFunction"
  function_name = local.discogs_lambdas["discogs-access-token"].function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.waxmatch.execution_arn}/*/*/*"
}
