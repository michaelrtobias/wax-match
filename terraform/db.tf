# resource "aws_dynamodb_table" "watch_inventory" {
#   name           = "WaxMatch"
#   read_capacity  = 20
#   write_capacity = 20
#   hash_key       = "userid"
#   range_key      = "albumid"

#   attribute {
#     name = "userid"
#     type = "S"
#   }
#   attribute {
#     name = "albumid"
#     type = "S"
#   }
# }


resource "aws_neptune_cluster" "wax_match" {
  cluster_identifier                   = "wax-match"
  engine                               = "neptune"
  engine_version                       = "1.2.0.1"
  neptune_cluster_parameter_group_name = "default.neptune1.2"
  skip_final_snapshot                  = true
  apply_immediately                    = true

  serverless_v2_scaling_configuration {}
}

resource "aws_neptune_cluster_instance" "wax_match" {
  cluster_identifier           = aws_neptune_cluster.wax_match.cluster_identifier
  instance_class               = "db.serverless"
  neptune_parameter_group_name = "default.neptune1.2"
}
