packer {
  required_plugins {
    amazon = {
      version = ">= 1.2.8, <2.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "aws_region" {
  type    = string
  default = env("AWS_REGION")
}

variable "ssh_username" {
  type    = string
  default = env("SSH_USERNAME")
}

variable "vpc_id" {
  type    = string
  default = env("VPC_ID")
}

variable "subnet_id" {
  type    = string
  default = env("SUBNET_ID")
}

variable "assg_name" {
  type    = string
  default = env("ASSG_NAME")
}

variable "instance_type" {
  type    = string
  default = env("INSTANCE_TYPE")
}

variable "access_key" {
  type    = string
  default = env("AWS_ACCESS_KEY_ID")
}

variable "secret_key" {
  type    = string
  default = env("AWS_SECRET_ACCESS_KEY")
}

variable "database" {
  type    = string
  default = env("DATABASE")
}

variable "user" {
  type    = string
  default = env("USER")
}

variable "password" {
  type    = string
  default = env("PASSWORD")
}

variable "host" {
  type    = string
  default = env("HOST")
}

variable "port" {
  type    = number
  default = env("PORT")
}

variable "dialect" {
  type    = string
  default = env("DIALECT")
}

variable "bcrypt_salts" {
  type    = number
  default = env("BCRYPT_SALT_ROUNDS")
}

variable "demo_account_id" {
  type    = string
  default = env("DEMO_ACCOUNT_ID")
}


source "amazon-ebs" "ubuntu" {
  ami_name        = "csye6225_${var.assg_name}_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  instance_type   = var.instance_type
  region          = var.aws_region
  ami_description = "AMI for csye6225 a04"
  access_key      = var.access_key
  secret_key      = var.secret_key
  source_ami_filter {
    filters = {
      name                = "ubuntu/images/*ubuntu-jammy-22.04-amd64-server-*"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    most_recent = true
    owners      = ["099720109477"]
  }
  ssh_username = var.ssh_username
  subnet_id    = var.subnet_id
  vpc_id       = var.vpc_id

  launch_block_device_mappings {
    device_name           = "/dev/sda1"
    volume_size           = 25
    volume_type           = "gp2"
    delete_on_termination = true
  }
}

build {
  sources = [
    "source.amazon-ebs.ubuntu",
  ]

  provisioner "shell" {
    environment_vars = ["DATABASE=${var.database}",
      "USER=${var.user}",
    "PASSWORD=${var.password}"]

    script = "install-script.sh"
  }

  provisioner "file" {
    source      = "webapp.zip"
    destination = "/tmp/"
  }

  provisioner "file" {
    source      = "./csye6225-aws.service"
    destination = "/tmp/"
  }

  provisioner "shell" {
    environment_vars = [
      "DATABASE=${var.database}",
      "USER=${var.user}",
      "PASSWORD=${var.password}",
      "PORT=${var.port}",
      "HOST=${var.host}",
      "DIALECT=${var.dialect}",
    "BCRYPT_SALT_ROUNDS=${var.bcrypt_salts}"]

    script = "init-app.sh"
  }

  // post-processor "shell-local" {
  //  inline = [
  //    "aws ec2 modify-image-attribute --image-id {{.BuildID}} --launch-permission \"Add=[{\\\"UserId\\\":\\\"${var.demo_account_id}\\\"}]\""
  //  ]
  //}
}


