# resource "aws_api_gateway_rest_api" "waxmatch" {
#   name = "WaxMatchAPI"

#   endpoint_configuration {
#     types = ["REGIONAL"]
#   }
# }

# resource "aws_api_gateway_deployment" "waxmatch" {
#   rest_api_id = aws_api_gateway_rest_api.waxmatch.id
#   lifecycle {
#     create_before_destroy = true
#   }
# }

# resource "aws_api_gateway_stage" "waxmatch" {
#   deployment_id = aws_api_gateway_deployment.waxmatch.id
#   rest_api_id   = aws_api_gateway_rest_api.waxmatch.id
#   stage_name    = "dev"
# }

# resource "aws_api_gateway_rest_api_policy" "waxmatch" {
#   rest_api_id = aws_api_gateway_rest_api.waxmatch.id

#   policy = <<EOF
# {
#   "Version": "2012-10-17",
#   "Statement": [
#     {
#       "Sid": "assumerole",
#       "Effect": "Allow",
#       "Principal": {
#         "Service": "apigateway.amazonaws.com"
#       },
#       "Action": "sts:AssumeRole"
#     },
#     {
#       "Effect": "Allow",
#       "Principal": "*",
#       "Action": "execute-api:Invoke",
#       "Resource": "execute-api:/*"
#     }
#   ]
# }
# EOF
# }
