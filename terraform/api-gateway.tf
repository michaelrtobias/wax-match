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
  rest_api_id       = aws_api_gateway_rest_api.waxmatch.id
  stage_name        = "dev"
  depends_on        = [aws_api_gateway_integration.discogs_auth_request_token]
  stage_description = "Deployed at ${timestamp()}"
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

data "aws_cognito_user_pools" "waxmatch" {
  name = var.waxmatch_cognito_pool_name
}

resource "aws_api_gateway_authorizer" "waxmatch" {
  name          = "CognitoUserPoolAuthorizer"
  type          = "COGNITO_USER_POOLS"
  rest_api_id   = aws_api_gateway_rest_api.waxmatch.id
  provider_arns = data.aws_cognito_user_pools.waxmatch.arns
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

// discogs auth options

// discogs auth get
resource "aws_api_gateway_resource" "discogs_auth_request_token" {
  rest_api_id = aws_api_gateway_rest_api.waxmatch.id
  parent_id   = aws_api_gateway_resource.discogs_auth.id
  path_part   = "request-token"
}

resource "aws_api_gateway_method" "discogs_auth_request_token_options_method" {
  rest_api_id   = aws_api_gateway_rest_api.waxmatch.id
  resource_id   = aws_api_gateway_resource.discogs_auth_request_token.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}
resource "aws_api_gateway_method_response" "discogs_auth_request_token_options_200" {
  rest_api_id = aws_api_gateway_rest_api.waxmatch.id
  resource_id = aws_api_gateway_resource.discogs_auth_request_token.id
  http_method = aws_api_gateway_method.discogs_auth_request_token_options_method.http_method
  status_code = "200"
  response_models = {
    "application/json" = "Empty"
  }
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers"     = true,
    "method.response.header.Access-Control-Allow-Methods"     = true,
    "method.response.header.Access-Control-Allow-Origin"      = true,
    "method.response.header.Access-Control-Allow-Credentials" = true
  }
  depends_on = [aws_api_gateway_method.discogs_auth_request_token_options_method]
}
resource "aws_api_gateway_integration" "discogs_auth_request_token_options_integration" {
  rest_api_id          = aws_api_gateway_rest_api.waxmatch.id
  resource_id          = aws_api_gateway_resource.discogs_auth_request_token.id
  http_method          = aws_api_gateway_method.discogs_auth_request_token_options_method.http_method
  type                 = "MOCK"
  passthrough_behavior = "WHEN_NO_MATCH"
  request_templates = {
    "application/json" = "{ 'statusCode': 200 }"
  }
  depends_on = [aws_api_gateway_method.discogs_auth_request_token_options_method]
}
resource "aws_api_gateway_integration_response" "discogs_auth_request_token_options_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.waxmatch.id
  resource_id = aws_api_gateway_resource.discogs_auth_request_token.id
  http_method = aws_api_gateway_method.discogs_auth_request_token_options_method.http_method
  status_code = aws_api_gateway_method_response.discogs_auth_request_token_options_200.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers"     = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
    "method.response.header.Access-Control-Allow-Methods"     = "'GET,OPTIONS,POST,PUT'",
    "method.response.header.Access-Control-Allow-Origin"      = "'*'",
    "method.response.header.Access-Control-Allow-Credentials" = "'true'"
  }
  depends_on = [aws_api_gateway_method_response.discogs_auth_request_token_options_200]
}
resource "aws_api_gateway_method" "discogs_auth_request_token" {
  rest_api_id   = aws_api_gateway_rest_api.waxmatch.id
  resource_id   = aws_api_gateway_resource.discogs_auth_request_token.id
  http_method   = "GET"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.waxmatch.id
}

resource "aws_api_gateway_method_response" "discogs_auth_request_token_200" {
  rest_api_id = aws_api_gateway_rest_api.waxmatch.id
  resource_id = aws_api_gateway_resource.discogs_auth_request_token.id
  http_method = aws_api_gateway_method.discogs_auth_request_token.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" = true
  }
  response_models = {
    "application/json" = "Empty"
  }
  depends_on = [aws_api_gateway_method.discogs_auth_request_token]
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
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = local.discogs_lambdas["discogs-request-token"].invoke_arn
  depends_on              = [aws_api_gateway_method.discogs_auth_request_token]
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

resource "aws_api_gateway_method" "discogs_auth_access_token_options_method" {
  rest_api_id   = aws_api_gateway_rest_api.waxmatch.id
  resource_id   = aws_api_gateway_resource.discogs_auth_access_token.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}
resource "aws_api_gateway_method_response" "discogs_auth_access_token_options_200" {
  rest_api_id = aws_api_gateway_rest_api.waxmatch.id
  resource_id = aws_api_gateway_resource.discogs_auth_access_token.id
  http_method = aws_api_gateway_method.discogs_auth_access_token_options_method.http_method
  status_code = "200"
  response_models = {
    "application/json" = "Empty"
  }
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers"     = true,
    "method.response.header.Access-Control-Allow-Methods"     = true,
    "method.response.header.Access-Control-Allow-Origin"      = true,
    "method.response.header.Access-Control-Allow-Credentials" = true
  }
  depends_on = [aws_api_gateway_method.discogs_auth_access_token_options_method]
}
resource "aws_api_gateway_integration" "discogs_auth_access_token_options_integration" {
  rest_api_id          = aws_api_gateway_rest_api.waxmatch.id
  resource_id          = aws_api_gateway_resource.discogs_auth_access_token.id
  http_method          = aws_api_gateway_method.discogs_auth_access_token_options_method.http_method
  type                 = "MOCK"
  passthrough_behavior = "WHEN_NO_MATCH"
  request_templates = {
    "application/json" = "{ 'statusCode': 200 }"
  }
  depends_on = [aws_api_gateway_method.discogs_auth_access_token_options_method]
}
resource "aws_api_gateway_integration_response" "discogs_auth_access_token_options_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.waxmatch.id
  resource_id = aws_api_gateway_resource.discogs_auth_access_token.id
  http_method = aws_api_gateway_method.discogs_auth_access_token_options_method.http_method
  status_code = aws_api_gateway_method_response.discogs_auth_access_token_options_200.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers"     = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
    "method.response.header.Access-Control-Allow-Methods"     = "'GET,OPTIONS,POST,PUT'",
    "method.response.header.Access-Control-Allow-Origin"      = "'*'",
    "method.response.header.Access-Control-Allow-Credentials" = "'true'"
  }
  depends_on = [aws_api_gateway_method_response.discogs_auth_access_token_options_200]
}
resource "aws_api_gateway_method" "discogs_auth_access_token" {
  rest_api_id   = aws_api_gateway_rest_api.waxmatch.id
  resource_id   = aws_api_gateway_resource.discogs_auth_access_token.id
  http_method   = "POST"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.waxmatch.id
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

// discogs identity

resource "aws_api_gateway_resource" "discogs_identity" {
  rest_api_id = aws_api_gateway_rest_api.waxmatch.id
  parent_id   = aws_api_gateway_resource.discogs.id
  path_part   = "identity"
}

resource "aws_api_gateway_method" "discogs_identity_options_method" {
  rest_api_id   = aws_api_gateway_rest_api.waxmatch.id
  resource_id   = aws_api_gateway_resource.discogs_identity.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}
resource "aws_api_gateway_method_response" "discogs_identity_options_200" {
  rest_api_id = aws_api_gateway_rest_api.waxmatch.id
  resource_id = aws_api_gateway_resource.discogs_identity.id
  http_method = aws_api_gateway_method.discogs_identity_options_method.http_method
  status_code = "200"
  response_models = {
    "application/json" = "Empty"
  }
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers"     = true,
    "method.response.header.Access-Control-Allow-Methods"     = true,
    "method.response.header.Access-Control-Allow-Origin"      = true,
    "method.response.header.Access-Control-Allow-Credentials" = true
  }
  depends_on = [aws_api_gateway_method.discogs_identity_options_method]
}
resource "aws_api_gateway_integration" "discogs_identity_options_integration" {
  rest_api_id          = aws_api_gateway_rest_api.waxmatch.id
  resource_id          = aws_api_gateway_resource.discogs_identity.id
  http_method          = aws_api_gateway_method.discogs_identity_options_method.http_method
  type                 = "MOCK"
  passthrough_behavior = "WHEN_NO_MATCH"
  request_templates = {
    "application/json" = "{ 'statusCode': 200 }"
  }
  depends_on = [aws_api_gateway_method.discogs_identity_options_method]
}
resource "aws_api_gateway_integration_response" "discogs_identity_options_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.waxmatch.id
  resource_id = aws_api_gateway_resource.discogs_identity.id
  http_method = aws_api_gateway_method.discogs_identity_options_method.http_method
  status_code = aws_api_gateway_method_response.discogs_identity_options_200.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers"     = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
    "method.response.header.Access-Control-Allow-Methods"     = "'GET,OPTIONS,POST,PUT'",
    "method.response.header.Access-Control-Allow-Origin"      = "'*'",
    "method.response.header.Access-Control-Allow-Credentials" = "'true'"
  }
  depends_on = [aws_api_gateway_method_response.discogs_identity_options_200]
}

// discogs identity get
resource "aws_api_gateway_method" "discogs_identity" {
  rest_api_id   = aws_api_gateway_rest_api.waxmatch.id
  resource_id   = aws_api_gateway_resource.discogs_identity.id
  http_method   = "GET"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.waxmatch.id
}

resource "aws_api_gateway_method_response" "discogs_identity_200" {
  rest_api_id         = aws_api_gateway_rest_api.waxmatch.id
  resource_id         = aws_api_gateway_resource.discogs_identity.id
  http_method         = aws_api_gateway_method.discogs_identity.http_method
  response_parameters = { "method.response.header.Access-Control-Allow-Origin" = true }
  response_models = {
    "application/json" = "Empty"
  }
  status_code = "200"
}
resource "aws_api_gateway_method_response" "discogs_identity_400" {
  rest_api_id = aws_api_gateway_rest_api.waxmatch.id
  resource_id = aws_api_gateway_resource.discogs_identity.id
  http_method = aws_api_gateway_method.discogs_identity.http_method
  status_code = "400"
}

resource "aws_api_gateway_integration" "discogs_identity" {
  rest_api_id             = aws_api_gateway_rest_api.waxmatch.id
  resource_id             = aws_api_gateway_resource.discogs_identity.id
  http_method             = aws_api_gateway_method.discogs_identity.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = local.discogs_lambdas["discogs-identity"].invoke_arn
}

resource "aws_api_gateway_integration_response" "discogs_identity" {
  rest_api_id = aws_api_gateway_rest_api.waxmatch.id
  resource_id = aws_api_gateway_resource.discogs_identity.id
  http_method = aws_api_gateway_method.discogs_identity.http_method
  status_code = "200"

  response_templates = {
    "application/json" = ""
  }
}
resource "aws_lambda_permission" "discogs_identity_lambda" {
  statement_id  = "AllowTMGReaddiscogs_identityAPIInvoke"
  action        = "lambda:InvokeFunction"
  function_name = local.discogs_lambdas["discogs-identity"].function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.waxmatch.execution_arn}/*/*/*"
}

// discogs collections

resource "aws_api_gateway_resource" "discogs_collections" {
  rest_api_id = aws_api_gateway_rest_api.waxmatch.id
  parent_id   = aws_api_gateway_resource.discogs.id
  path_part   = "collections"
}

// discogs releases

resource "aws_api_gateway_resource" "discogs_collection_releases" {
  rest_api_id = aws_api_gateway_rest_api.waxmatch.id
  parent_id   = aws_api_gateway_resource.discogs_collections.id
  path_part   = "releases"
}

// discogs releases options

resource "aws_api_gateway_method" "discogs_collection_releases_options_method" {
  rest_api_id   = aws_api_gateway_rest_api.waxmatch.id
  resource_id   = aws_api_gateway_resource.discogs_collection_releases.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}
resource "aws_api_gateway_method_response" "discogs_collection_releases_options_200" {
  rest_api_id = aws_api_gateway_rest_api.waxmatch.id
  resource_id = aws_api_gateway_resource.discogs_collection_releases.id
  http_method = aws_api_gateway_method.discogs_collection_releases_options_method.http_method
  status_code = "200"
  response_models = {
    "application/json" = "Empty"
  }
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers"     = true,
    "method.response.header.Access-Control-Allow-Methods"     = true,
    "method.response.header.Access-Control-Allow-Origin"      = true,
    "method.response.header.Access-Control-Allow-Credentials" = true
  }
  depends_on = [aws_api_gateway_method.discogs_collection_releases_options_method]
}
resource "aws_api_gateway_integration" "discogs_collection_releases_options_integration" {
  rest_api_id          = aws_api_gateway_rest_api.waxmatch.id
  resource_id          = aws_api_gateway_resource.discogs_collection_releases.id
  http_method          = aws_api_gateway_method.discogs_collection_releases_options_method.http_method
  type                 = "MOCK"
  passthrough_behavior = "WHEN_NO_MATCH"
  request_templates = {
    "application/json" = "{ 'statusCode': 200 }"
  }
  depends_on = [aws_api_gateway_method.discogs_collection_releases_options_method]
}
resource "aws_api_gateway_integration_response" "discogs_collection_releases_options_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.waxmatch.id
  resource_id = aws_api_gateway_resource.discogs_collection_releases.id
  http_method = aws_api_gateway_method.discogs_collection_releases_options_method.http_method
  status_code = aws_api_gateway_method_response.discogs_collection_releases_options_200.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers"     = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
    "method.response.header.Access-Control-Allow-Methods"     = "'GET,OPTIONS,POST,PUT'",
    "method.response.header.Access-Control-Allow-Origin"      = "'*'",
    "method.response.header.Access-Control-Allow-Credentials" = "'true'"
  }
  depends_on = [aws_api_gateway_method_response.discogs_collection_releases_options_200]
}

// discogs get collection releases
resource "aws_api_gateway_method" "discogs_collection_releases_get" {
  rest_api_id   = aws_api_gateway_rest_api.waxmatch.id
  resource_id   = aws_api_gateway_resource.discogs_collection_releases.id
  http_method   = "GET"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.waxmatch.id
}

resource "aws_api_gateway_method_response" "discogs_collection_releases_get_200" {
  rest_api_id         = aws_api_gateway_rest_api.waxmatch.id
  resource_id         = aws_api_gateway_resource.discogs_collection_releases.id
  http_method         = aws_api_gateway_method.discogs_collection_releases_get.http_method
  response_parameters = { "method.response.header.Access-Control-Allow-Origin" = true }
  response_models = {
    "application/json" = "Empty"
  }
  status_code = "200"
}

resource "aws_api_gateway_method_response" "discogs_collection_releases_get_400" {
  rest_api_id = aws_api_gateway_rest_api.waxmatch.id
  resource_id = aws_api_gateway_resource.discogs_collection_releases.id
  http_method = aws_api_gateway_method.discogs_collection_releases_get.http_method
  status_code = "400"
}

resource "aws_api_gateway_integration" "discogs_collection_releases_get" {
  rest_api_id             = aws_api_gateway_rest_api.waxmatch.id
  resource_id             = aws_api_gateway_resource.discogs_collection_releases.id
  http_method             = aws_api_gateway_method.discogs_collection_releases_get.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = local.discogs_lambdas["discogs-get-collection-releases"].invoke_arn
}

resource "aws_api_gateway_integration_response" "discogs_collection_releases_get" {
  rest_api_id = aws_api_gateway_rest_api.waxmatch.id
  resource_id = aws_api_gateway_resource.discogs_collection_releases.id
  http_method = aws_api_gateway_method.discogs_collection_releases_get.http_method
  status_code = "200"

  response_templates = {
    "application/json" = ""
  }
}
resource "aws_lambda_permission" "discogs_collection_releases_lambda" {
  statement_id  = "AllowTMGReaddiscogs_collection_releasesAPIInvoke"
  action        = "lambda:InvokeFunction"
  function_name = local.discogs_lambdas["discogs-get-collection-releases"].function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.waxmatch.execution_arn}/*/*/*"
}

// discogs sync

resource "aws_api_gateway_resource" "discogs_sync" {
  rest_api_id = aws_api_gateway_rest_api.waxmatch.id
  parent_id   = aws_api_gateway_resource.discogs_collections.id
  path_part   = "sync"
}

resource "aws_api_gateway_method" "discogs_sync_options_method" {
  rest_api_id   = aws_api_gateway_rest_api.waxmatch.id
  resource_id   = aws_api_gateway_resource.discogs_sync.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}
resource "aws_api_gateway_method_response" "discogs_sync_options_200" {
  rest_api_id = aws_api_gateway_rest_api.waxmatch.id
  resource_id = aws_api_gateway_resource.discogs_sync.id
  http_method = aws_api_gateway_method.discogs_sync_options_method.http_method
  status_code = "200"
  response_models = {
    "application/json" = "Empty"
  }
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers"     = true,
    "method.response.header.Access-Control-Allow-Methods"     = true,
    "method.response.header.Access-Control-Allow-Origin"      = true,
    "method.response.header.Access-Control-Allow-Credentials" = true
  }
  depends_on = [aws_api_gateway_method.discogs_sync_options_method]
}
resource "aws_api_gateway_integration" "discogs_sync_options_integration" {
  rest_api_id          = aws_api_gateway_rest_api.waxmatch.id
  resource_id          = aws_api_gateway_resource.discogs_sync.id
  http_method          = aws_api_gateway_method.discogs_sync_options_method.http_method
  type                 = "MOCK"
  passthrough_behavior = "WHEN_NO_MATCH"
  request_templates = {
    "application/json" = "{ 'statusCode': 200 }"
  }
  depends_on = [aws_api_gateway_method.discogs_sync_options_method]
}
resource "aws_api_gateway_integration_response" "discogs_sync_options_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.waxmatch.id
  resource_id = aws_api_gateway_resource.discogs_sync.id
  http_method = aws_api_gateway_method.discogs_sync_options_method.http_method
  status_code = aws_api_gateway_method_response.discogs_sync_options_200.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers"     = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
    "method.response.header.Access-Control-Allow-Methods"     = "'GET,OPTIONS,POST,PUT'",
    "method.response.header.Access-Control-Allow-Origin"      = "'*'",
    "method.response.header.Access-Control-Allow-Credentials" = "'true'"
  }
  depends_on = [aws_api_gateway_method_response.discogs_sync_options_200]
}

// discogs get sync
resource "aws_api_gateway_method" "discogs_sync" {
  rest_api_id   = aws_api_gateway_rest_api.waxmatch.id
  resource_id   = aws_api_gateway_resource.discogs_sync.id
  http_method   = "GET"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.waxmatch.id
}

resource "aws_api_gateway_method_response" "discogs_sync_200" {
  rest_api_id         = aws_api_gateway_rest_api.waxmatch.id
  resource_id         = aws_api_gateway_resource.discogs_sync.id
  http_method         = aws_api_gateway_method.discogs_sync.http_method
  response_parameters = { "method.response.header.Access-Control-Allow-Origin" = true }
  response_models = {
    "application/json" = "Empty"
  }
  status_code = "200"
}

resource "aws_api_gateway_method_response" "discogs_sync_400" {
  rest_api_id = aws_api_gateway_rest_api.waxmatch.id
  resource_id = aws_api_gateway_resource.discogs_sync.id
  http_method = aws_api_gateway_method.discogs_sync.http_method
  status_code = "400"
}

resource "aws_api_gateway_integration" "discogs_sync" {
  rest_api_id             = aws_api_gateway_rest_api.waxmatch.id
  resource_id             = aws_api_gateway_resource.discogs_sync.id
  http_method             = aws_api_gateway_method.discogs_sync.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = local.discogs_lambdas["discogs-sync"].invoke_arn
}

resource "aws_api_gateway_integration_response" "discogs_sync" {
  rest_api_id = aws_api_gateway_rest_api.waxmatch.id
  resource_id = aws_api_gateway_resource.discogs_sync.id
  http_method = aws_api_gateway_method.discogs_sync.http_method
  status_code = "200"

  response_templates = {
    "application/json" = ""
  }
}
resource "aws_lambda_permission" "discogs_sync_lambda" {
  statement_id  = "AllowTMGReaddiscogs_syncAPIInvoke"
  action        = "lambda:InvokeFunction"
  function_name = local.discogs_lambdas["discogs-sync"].function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.waxmatch.execution_arn}/*/*/*"
}
