resource "aws_iam_role" "eks-cluster-role" {
  name = "eks-cluster-role-${var.cluster_name}"

  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "eks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
POLICY
}

resource "aws_iam_role_policy_attachment" "amazon-eks-cluster-policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.eks-cluster-role.name
}

resource "aws_eks_cluster" "hackerchat-cluster" {
  name     = var.cluster_name
  version  = "1.22"
  role_arn = aws_iam_role.eks-cluster-role.arn

  vpc_config {
    endpoint_private_access = false
    endpoint_public_access  = true
    public_access_cidrs     = ["0.0.0.0/0"]

    subnet_ids = [
      aws_subnet.public-eu-central-1a.id,
      aws_subnet.public-eu-central-1b.id,
      aws_subnet.private-eu-central-1a.id,
      aws_subnet.private-eu-central-1b.id,
    ]
  }

  depends_on = [
    aws_iam_role_policy_attachment.amazon-eks-cluster-policy
  ]
}
