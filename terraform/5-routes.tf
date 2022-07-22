resource "aws_route_table" "private-rt" {
  vpc_id = aws_vpc.hackerchat-main-vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.hackerchat-nat-gw.id
  }

  tags = {
    "Name" = "private-rt"
  }
}

resource "aws_route_table" "public-rt" {
  vpc_id = aws_vpc.hackerchat-main-vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.hackerchat-igw.id
  }

  tags = {
    "Name" = "public-rt"
  }
}

resource "aws_route_table_association" "public-eu-central-1a" {
  subnet_id      = aws_subnet.public-eu-central-1a.id
  route_table_id = aws_route_table.public-rt.id
}

resource "aws_route_table_association" "public-eu-central-1b" {
  subnet_id      = aws_subnet.public-eu-central-1b.id
  route_table_id = aws_route_table.public-rt.id
}

resource "aws_route_table_association" "private-eu-central-1a" {
  subnet_id      = aws_subnet.private-eu-central-1a.id
  route_table_id = aws_route_table.private-rt.id
}

resource "aws_route_table_association" "private-eu-central-1b" {
  subnet_id      = aws_subnet.private-eu-central-1b.id
  route_table_id = aws_route_table.private-rt.id
}
