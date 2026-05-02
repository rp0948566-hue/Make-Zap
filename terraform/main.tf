terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Generate random password for RDS
resource "random_password" "rds_password" {
  length  = 32
  special = true
}

# VPC for complete isolation
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.1.2"

  name = "markzap-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["${var.aws_region}a", "${var.aws_region}b", "${var.aws_region}c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway     = true
  single_nat_gateway     = false  # Multi-AZ
  enable_dns_hostnames   = true
  enable_dns_support     = true

  public_subnet_tags = {
    Name = "markzap-public"
    Tier = "public"
  }

  private_subnet_tags = {
    Name = "markzap-private"
    Tier = "private"
  }

  vpc_tags = {
    Name = "markzap-vpc"
    Project = "markzap"
    Environment = var.environment
  }
}

# Security Group for Application Load Balancer
resource "aws_security_group" "alb" {
  name        = "markzap-alb-sg"
  description = "Security group for ALB"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "markzap-alb-sg"
    Project = "markzap"
  }
}

# Security Group for ECS/EKS Tasks
resource "aws_security_group" "task" {
  name        = "markzap-task-sg"
  description = "Security group for ECS/EKS tasks"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "markzap-task-sg"
    Project = "markzap"
  }
}

# Security Group for RDS
resource "aws_security_group" "rds" {
  name        = "markzap-rds-sg"
  description = "Security group for RDS PostgreSQL"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.task.id]
  }

  tags = {
    Name = "markzap-rds-sg"
    Project = "markzap"
  }
}

# Security Group for ElastiCache Redis
resource "aws_security_group" "redis" {
  name        = "markzap-redis-sg"
  description = "Security group for ElastiCache Redis"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.task.id]
  }

  tags = {
    Name = "markzap-redis-sg"
    Project = "markzap"
  }
}

# RDS Subnet Group
resource "aws_db_subnet_group" "markzap" {
  name       = "markzap-db-subnet"
  subnet_ids = module.vpc.private_subnets

  tags = {
    Name = "markzap-db-subnet"
    Project = "markzap"
  }
}

# RDS PostgreSQL (Multi-AZ)
resource "aws_db_instance" "markzap_postgres" {
  identifier             = "markzap-${var.environment}"
  engine                = "postgres"
  engine_version        = "16.3"
  instance_class        = var.db_instance_class
  allocated_storage     = var.db_allocated_storage
  max_allocated_storage = var.db_max_allocated_storage
  db_name               = "markzap"
  username              = "markzap"
  password              = random_password.rds_password.result

  db_subnet_group_name   = aws_db_subnet_group.markzap.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  multi_az               = true
  storage_encrypted      = true
  storage_type          = "gp3"
  deletion_protection   = true
  skip_final_snapshot   = false
  final_snapshot_identifier = "markzap-final-${timestamp()}"

  enabled_cloudwatch_logs_exports = ["postgresql"]
  monitoring_interval            = 60
  monitoring_role_arn           = aws_iam_role.rds_monitoring.arn

  performance_insights_enabled    = true
  performance_insights_retention_period = 7

  tags = {
    Name = "markzap-postgres"
    Project = "markzap"
    Environment = var.environment
  }
}

# ElastiCache Redis Cluster
resource "aws_elasticache_subnet_group" "markzap" {
  name       = "markzap-cache-subnet"
  subnet_ids = module.vpc.private_subnets
}

resource "aws_elasticache_replication_group" "markzap_redis" {
  replication_group_id          = "markzap-redis"
  description                   = "Redis cluster for MarkZap"
  node_type                    = var.redis_node_type
  port                         = 6379
  parameter_group_name         = "default.redis7"
  num_cache_clusters           = 2  # Multi-AZ
  automatic_failover_enabled   = true
  multi_az_enabled            = true

  subnet_group_name          = aws_elasticache_subnet_group.markzap.name
  security_group_ids         = [aws_security_group.redis.id]

  at_rest_encryption_enabled  = true
  transit_encryption_enabled = true

  snapshot_retention_limit   = 7
  snapshot_window           = "05:00-06:00"

  tags = {
    Name = "markzap-redis"
    Project = "markzap"
    Environment = var.environment
  }
}

# S3 Bucket for static assets (frontend)
resource "aws_s3_bucket" "markzap_assets" {
  bucket = "markzap-assets-${var.environment}-${random_id.suffix.hex}"
  force_destroy = false

  tags = {
    Name = "markzap-assets"
    Project = "markzap"
    Environment = var.environment
  }
}

resource "aws_s3_bucket_versioning" "markzap_assets" {
  bucket = aws_s3_bucket.markzap_assets.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "markzap_assets" {
  bucket = aws_s3_bucket.markzap_assets.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "markzap_assets" {
  bucket = aws_s3_bucket.markzap_assets.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# CloudFront CDN
resource "aws_cloudfront_distribution" "markzap_cdn" {
  origin {
    domain_name = aws_s3_bucket.markzap_assets.bucket_regional_domain_name
    origin_id   = "S3-markzap-assets"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  origin {
    domain_name = module.ecs.service_alb_dns_name  # ECS/ALB
    origin_id   = "ECS-markzap"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2", "TLSv1.3"]
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "MarkZap CDN - Production"
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-markzap-assets"
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl           = 86400  # 1 day
    max_ttl               = 31536000  # 1 year

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  # Cache behavior for API
  ordered_cache_behavior {
    path_pattern     = "/api/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "ECS-markzap"
    compress         = true
    viewer_protocol_policy = "redirect-to-https"
    min_ttl          = 0
    default_ttl     = 300  # 5 minutes
    max_ttl         = 300

    forwarded_values {
      query_string = true
      headers      = ["Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers"]
      cookies {
        forward = "all"
      }
    }
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.markzap_cert.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  tags = {
    Name = "markzap-cdn"
    Project = "markzap"
    Environment = var.environment
  }
}

# ACM Certificate for CloudFront & ALB
resource "aws_acm_certificate" "markzap_cert" {
  provider          = aws.us_east_1  # CloudFront requires us-east-1
  domain_name       = "markzap.online"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

# Application Load Balancer
resource "aws_lb" "markzap_alb" {
  name               = "markzap-alb-${var.environment}"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = module.vpc.public_subnets

  enable_deletion_protection = true
  enable_http2               = true
  idle_timeout               = 60

  tags = {
    Name = "markzap-alb"
    Project = "markzap"
    Environment = var.environment
  }
}

# ALB Target Group
resource "aws_lb_target_group" "markzap_tg" {
  name        = "markzap-tg-${var.environment}"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = module.vpc.vpc_id
  target_type = "ip"

  health_check {
    path                = "/health"
    port                = "traffic-port"
    protocol            = "HTTP"
    matcher             = "200-299"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
  }

  tags = {
    Name = "markzap-tg"
    Project = "markzap"
  }
}

# ALB Listener HTTPS
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.markzap_alb.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = aws_acm_certificate.markzap_cert.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.markzap_tg.arn
  }
}

# ALB Listener HTTP -> HTTPS redirect
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.markzap_alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"
    redirect {
      protocol = "HTTPS"
      port     = "443"
      status_code = "HTTP_301"
    }
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "markzap" {
  name = "markzap-cluster-${var.environment}"

  configuration {
    execute_command_configuration {
      logging = "OVERRIDE"

      log_configuration {
        cloud_watch_log_group_name = "/ecs/markzap"
      }
    }
  }

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name = "markzap-cluster"
    Project = "markzap"
    Environment = var.environment
  }
}

# ECS Task Definition
resource "aws_ecs_task_definition" "markzap" {
  family                   = "markzap-task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  task_role_arn           = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name  = "markzap"
      image = "${aws_ecr_repository.markzap.repository_url}:latest"
      essential = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
          protocol      = "tcp"
        }
      ]
      environment = [
        {
          name  = "NODE_ENV"
          value = "production"
        },
        {
          name  = "PORT"
          value = "3000"
        },
        {
          name  = "DATABASE_URL"
          value = "postgresql://markzap:${random_password.rds_password.result}@${aws_db_instance.markzap_postgres.endpoint}/markzap"
        },
        {
          name  = "REDIS_URL"
          value = "redis://:${var.redis_password}@${aws_elasticache_replication_group.markzap_redis.primary_endpoint_address}:6379"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/markzap"
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:3000/health || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 15
      }
    }
  ])

  tags = {
    Name = "markzap-task"
    Project = "markzap"
    Environment = var.environment
  }
}

# ECS Service
resource "aws_ecs_service" "markzap" {
  name            = "markzap-service"
  cluster         = aws_ecs_cluster.markzap.id
  task_definition = aws_ecs_task_definition.markzap.arn
  launch_type     = "FARGATE"

  desired_count                      = 3
  platform_version                  = "LATEST"
  deployment_minimum_healthy_percent = 50
  deployment_maximum_percent         = 200

  network_configuration {
    subnets          = module.vpc.private_subnets
    security_groups  = [aws_security_group.task.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.markzap_tg.arn
    container_name   = "markzap"
    container_port   = 3000
  }

  service_registries {
    registry_arn = aws_service_discovery_service.markzap.arn
  }

  capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight            = 1
  }

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  tags = {
    Name = "markzap-service"
    Project = "markzap"
    Environment = var.environment
  }
}

# Service Discovery (Cloud Map)
resource "aws_service_discovery_private_dns_namespace" "markzap" {
  name        = "markzap.local"
  description = "Private DNS namespace for MarkZap"
  vpc         = module.vpc.vpc_id
}

resource "aws_service_discovery_service" "markzap" {
  name = "markzap"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.markzap.id

    dns_records {
      ttl  = 60
      type = "A"
    }

    dns_records {
      ttl  = 60
      type = "SRV"
      _port = 3000
    }

    routing_policy = "MULTIVALUE"
  }

  health_check_custom_config {
    failure_threshold = 1
  }
}

# ECR Repository
resource "aws_ecr_repository" "markzap" {
  name                 = "markzap"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = {
    Name = "markzap-ecr"
    Project = "markzap"
  }
}

# WAF Web ACL
resource "aws_wafv2_web_acl" "markzap_waf" {
  name        = "markzap-waf-${var.environment}"
  description = "WAF for MarkZap production"
  scope       = "CLOUDFRONT"

  default_action {
    allow {}
  }

  rule {
    name     = "AWS-AWSManagedRulesCommonRuleSet"
    priority = 1

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name               = "AWS-AWSManagedRulesCommonRuleSet"
      sampled_requests_enabled   = true
    }
  }

  rule {
    name     = "AWS-AWSManagedRulesSQLiRuleSet"
    priority = 2

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesSQLiRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name               = "AWS-AWSManagedRulesSQLiRuleSet"
      sampled_requests_enabled   = true
    }
  }

  rule {
    name     = "RateLimit"
    priority = 10

    action {
      captcha {
        immunity_time_property {
          immunity_time = 300
        }
      }
    }

    statement {
      rate_based_statement {
        limit              = 1000
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "RateLimit"
      sampled_requests_enabled    = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name               = "markzap-waf"
    sampled_requests_enabled   = true
  }

  tags = {
    Name = "markzap-waf"
    Project = "markzap"
  }
}

# CloudWatch Alarms
resource "aws_cloudwatch_metric_alarm" "high_cpu" {
  alarm_name          = "markzap-high-cpu-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "60"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "EC2 CPU utilization exceeds 80%"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    ClusterName = aws_ecs_cluster.markzap.name
    ServiceName = aws_ecs_service.markzap.name
  }
}

resource "aws_cloudwatch_metric_alarm" "high_memory" {
  alarm_name          = "markzap-high-memory-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "MemoryUtilization"
  namespace           = "AWS/ECS"
  period              = "60"
  statistic           = "Average"
  threshold           = "85"
  alarm_description   = "EC2 Memory utilization exceeds 85%"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    ClusterName = aws_ecs_cluster.markzap.name
    ServiceName = aws_ecs_service.markzap.name
  }
}

# SNS Topic for alerts
resource "aws_sns_topic" "alerts" {
  name = "markzap-alerts-${var.environment}"
}

# Backup Vault (AWS Backup)
resource "aws_backup_vault" "markzap" {
  name = "markzap-backup-vault"
}

resource "aws_backup_plan" "markzap" {
  name = "markzap-backup-plan"

  rule {
    rule_name         = "daily-backup"
    target_vault_name = aws_backup_vault.markzap.name
    schedule          = "cron(0 2 * * ? *)"

    lifecycle {
      delete_after = 35
    }
  }
}

resource "aws_backup_selection" "markzap_rds" {
  iam_role_arn = aws_iam_role.backup.arn
  name         = "markzap-rds-backup"
  plan_id      = aws_backup_plan.markzap.id

  resources = [
    aws_db_instance.markzap_postgres.arn,
    aws_elasticache_replication_group.markzap_redis.id
  ]
}

# IAM Roles

resource "aws_iam_role" "ecs_task_execution" {
  name = "ecs-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  managed_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
    "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
    "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
  ]
}

resource "aws_iam_role" "ecs_task" {
  name = "ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  inline_policy {
    name = "markzap-task-policy"

    policy = jsonencode({
      Version = "2012-10-17"
      Statement = [
        {
          Effect = "Allow"
          Action = [
            "ssm:GetParameter"
          ]
          Resource = "*"
        },
        {
          Effect = "Allow"
          Action = [
            "logs:CreateLogStream",
            "logs:PutLogEvents",
            "logs:CreateLogGroup"
          ]
          Resource = "*"
        },
        {
          Effect = "Allow"
          Action = [
            "s3:GetObject"
          ]
          Resource = "${aws_s3_bucket.markzap_assets.arn}/*"
        }
      ]
    })
  }
}

resource "aws_iam_role" "rds_monitoring" {
  name = "rds-monitoring-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "monitoring.rds.amazonaws.com"
        }
      }
    ]
  })

  managed_policy_arns = [
    "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
  ]
}

resource "aws_iam_role" "backup" {
  name = "backup-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "backup.amazonaws.com"
        }
      }
    ]
  })

  managed_policy_arns = [
    "arn:aws:iam::aws:policy/AmazonSSMReadOnlyAccess",
    "arn:aws:iam::aws:policy/service-role/AWSBackupServiceRolePolicyForBackup"
  ]
}

# CloudFront Origin Access Identity
resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "OAI for MarkZap S3 bucket"
}

# S3 bucket policy for CloudFront
resource "aws_s3_bucket_policy" "markzap_assets" {
  bucket = aws_s3_bucket.markzap_assets.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudFrontRead"
        Effect    = "Allow"
        Principal = {
          AWS = aws_cloudfront_origin_access_identity.oai.iam_arn
        }
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.markzap_assets.arn}/*"
      }
    ]
  })
}

# Random suffix for unique bucket names
resource "random_id" "suffix" {
  byte_length = 4
}

# Variables
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "RDS allocated storage (GB)"
  type        = number
  default     = 20
}

variable "db_max_allocated_storage" {
  description = "RDS max storage (GB)"
  type        = number
  default     = 100
}

variable "redis_node_type" {
  description = "Redis node type"
  type        = string
  default     = "cache.t3.micro"
}

variable "redis_password" {
  description = "Redis password"
  type        = string
  sensitive   = true
}

# Outputs
output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "alb_dns_name" {
  description = "ALB DNS name"
  value       = aws_lb.markzap_alb.dns_name
}

output "cloudfront_domain" {
  description = "CloudFront CDN domain"
  value       = aws_cloudfront_distribution.markzap_cdn.domain_name
}

output "rds_endpoint" {
  description = "RDS endpoint"
  value       = aws_db_instance.markzap_postgres.endpoint
  sensitive   = true
}

output "redis_endpoint" {
  description = "Redis endpoint"
  value       = aws_elasticache_replication_group.markzap_redis.primary_endpoint_address
  sensitive   = true
}

output "ecs_cluster_name" {
  description = "ECS Cluster name"
  value       = aws_ecs_cluster.markzap.name
}

output "ecr_repository_url" {
  description = "ECR Repository URL"
  value       = aws_ecr_repository.markzap.repository_url
}
