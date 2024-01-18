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


