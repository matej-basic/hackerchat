resource "aws_eip" "nat-gw" {
  vpc = true

  tags = {
    "Name" = "nat-gw"
  }
}

resource "aws_nat_gateway" "hackerchat-nat-gw" {
  allocation_id = aws_eip.nat-gw.id
  subnet_id     = aws_subnet.public-eu-central-1a.id

  tags = {
    "Name" = "hackerchat-nat-gw"
  }

  depends_on = [
    aws_internet_gateway.hackerchat-igw
  ]
}
