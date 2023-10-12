terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.65.0"
    }
  }
  backend "s3" {
    bucket         = "wax-matcher-tf-state"
    key            = "state/api/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "wax_matcher_tf_state"
  }
}
