provider "aws" {
  region = "eu-central-1"
}

variable "cluster_name" {
  default = "hackerchat-cluster"
}

variable "cluster_version" {
  default = "1.22"
}

provider "helm" {
  kubernetes {
    host                   = aws_eks_cluster.hackerchat-cluster.endpoint
    cluster_ca_certificate = base64decode(aws_eks_cluster.hackerchat-cluster.certificate_authority[0].data)
    exec {
      api_version = "client.authentication.k8s.io/v1beta1"
      args        = ["eks", "get-token", "--cluster-name", aws_eks_cluster.hackerchat-cluster.id]
      command     = "aws"
    }
  }
}

terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
}
