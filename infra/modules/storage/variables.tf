variable "app_name" {
  type = string
}

variable "app_env" {
  type = string
}

variable "location" {
  type = string
}

variable "common_tags" {
  type    = map(string)
  default = {}
}