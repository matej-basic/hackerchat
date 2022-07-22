resource "helm_release" "aws-load-balancer-controller" {
  name       = "aws-load-balancer-controller"
  repository = "https://aws.github.io/eks-charts"
  chart      = "aws-load-balancer-controller"
  version    = "1.4.1"
  namespace  = "kube-system"

  set {
    name  = "clusterName"
    value = aws_eks_cluster.hackerchat-cluster.id
  }

  set {
    name  = "image.tag"
    value = "v2.4.2"
  }

  set {
    name  = "replicaCount"
    value = 1
  }

  set {
    name  = "serviceAccount.name"
    value = "aws-load-balancer-controller"
  }

  set {
    name  = "serviceAccount.annotations.eks\\.amazonaws\\.com/role-arn"
    value = aws_iam_role.aws_load_balancer_controller.arn
  }

  set {
    name  = "region"
    value = "eu-central-1"
  }

  set {
    name  = "vpcId"
    value = aws_vpc.hackerchat-main-vpc.id
  }

  depends_on = [
    aws_eks_fargate_profile.kube-system
  ]
}
