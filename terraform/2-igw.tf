resource "aws_internet_gateway" "hackerchat-igw" {
  vpc_id = aws_vpc.hackerchat-main-vpc.id

  tags = {
    "Name" = "hackerchat-igw"
  }
}
