# INFRASTRUCTURE ARCHITECTURE - MarkZap Production
# Military-Grade, Zero-Trust, Multi-Region Ready

## 📐 HIGH-LEVEL ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────────┐
│                         INTERNET / USERS                             │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │   CloudFlare CDN + WAF │  ← DDoS Protection (Anycast)
                    │   + DDoS Mitigation    │  ← Rate Limiting
                    │   + SSL/TLS Termination │  ← Edge Caching
                    └───────────┬───────────┘
                                │ HTTPS (443)
                    ┌───────────▼───────────┐
                    │   AWS CloudFront       │  ← Global CDN
                    │   + WAF Rules          │  ← AWS Shield
                    │   + Geo-restriction    │  ← ACM Certificates
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │   Application Load     │  ← Layer 7 Load Balancing
                    │   Balancer (ALB)       │  ← Health Checks
                    │   + SSL Offloading     │  ← WAF Integration
                    └───────────┬───────────┘
                                │
            ┌───────────────────┼───────────────────┐
            │                   │                   │
    ┌───────▼───────┐  ┌────────▼────────┐  ┌───────▼───────┐
    │  ECS Task     │  │  ECS Task       │  │  ECS Task     │
    │  (AZ A)       │  │  (AZ B)         │  │  (AZ C)       │
    │  Container    │  │  Container      │  │  Container    │
    │  MarkZap App  │  │  MarkZap App    │  │  MarkZap App  │
    └───────┬───────┘  └────────┬────────┘  └───────┬───────┘
            │                   │                   │
            └───────────────────┼───────────────────┘
                                │
                ┌───────────────▼───────────────┐
                │   Private Subnets (VPC)       │
                │   ┌───────────────────────┐   │
                │   │  RDS PostgreSQL       │   │  ← Multi-AZ
                │   │  + Auto-backup        │   │  ← Encryption
                │   │  + Read Replica       │   │  ← 7-day retention
                │   └───────────────────────┘   │
                │   ┌───────────────────────┐   │
                │   │  ElastiCache Redis    │   │  ← Cluster Mode
                │   │  + Replication        │   │  ← In-Transit Encryption
                │   │  + Auto-failover      │   │  ← At-Rest Encryption
                │   └───────────────────────┘   │
                └───────────────────────────────┘
```

## 🏗️ INFRASTRUCTURE COMPONENTS

### 1. NETWORK & SECURITY (Zero-Trust)

| Component | Provider | Purpose | Configuration |
|-----------|----------|---------|---------------|
| **VPC** | AWS | Network isolation | 10.0.0.0/16, 3 AZs |
| **Public Subnets** | AWS | ALB, NAT Gateway | 10.0.101.0/24, 10.0.102.0/24, 10.0.103.0/24 |
| **Private Subnets** | AWS | ECS Tasks, RDS, Redis | 10.0.1.0/24, 10.0.2.0/24, 10.0.3.0/24 |
| **Security Groups** | AWS | Microsegmentation | Least-privilege rules |
| **Network ACLs** | AWS | Stateless filtering | Deny-all inbound, allow-specific |
| **WAF** | AWS | Web Application Firewall | OWASP Top 10 rules + custom |
| **Shield** | AWS | DDoS Protection | Advanced (paid) or Standard (free) |
| **CloudFlare** | CloudFlare | DNS + CDN + WAF | Proxy enabled, security level high |

### 2. COMPUTE & CONTAINERS

| Component | Technology | Details |
|-----------|------------|---------|
| **Container Registry** | Amazon ECR | Private, encrypted, image scanning |
| **Orchestration** | Amazon ECS (Fargate) | Serverless containers, no EC2 management |
| **Alternative** | Kubernetes (EKS) | Full control, self-managed nodes |
| **Task Definition** | Fargate | 0.5 vCPU, 1GB RAM per task |
| **Auto Scaling** | ECS Service Auto Scaling | 3-10 replicas, target 70% CPU |
| **Load Balancer** | ALB (Application Load Balancer) | HTTP/2, HTTPS redirect, sticky sessions |
| **Service Discovery** | AWS Cloud Map | Internal DNS for service discovery |

### 3. DATABASE LAYER

| Component | Technology | HA | Backup | Encryption |
|-----------|------------|----|--------|------------|
| **Primary DB** | PostgreSQL 16 (RDS) | Multi-AZ | Automated (7-day) | At-Rest + In-Transit |
| **Read Replica** | PostgreSQL (RDS) | Cross-AZ | Manual snapshots | Encrypted |
| **Cache** | Redis 7 (ElastiCache) | Multi-AZ + Auto-failover | Daily snapshots | TLS encryption |
| **Backup Vault** | AWS Backup | Cross-region | 35-day retention | KMS encrypted |

### 4. STORAGE & CDN

| Component | Technology | Purpose | TTL |
|-----------|------------|---------|-----|
| **S3 Bucket** | AWS S3 | Static assets (images, CSS, JS) | Versioned, encrypted |
| **CDN** | CloudFront | Global edge caching | 1 year for assets |
| **Edge Locations** | 300+ POPs | Low latency delivery | Dynamic site acceleration |
| **Origin Shield** | CloudFront | Origin protection | Cache hit ratio boost |

### 5. MONITORING & OBSERVABILITY

| Tool | Purpose | Retention |
|------|---------|-----------|
| **Prometheus** | Metrics collection | 15 days (local) |
| **Grafana** | Dashboards & visualization | Unlimited |
| **Loki** | Log aggregation | 30 days |
| **AlertManager** | Alert routing & deduplication | Real-time |
| **CloudWatch** | AWS metrics & logs | 15 days (default) |
| **X-Ray** | Distributed tracing | 30 days |

### 6. SECURITY & COMPLIANCE

| Layer | Tool / Service | Configuration |
|-------|---------------|---------------|
| **Edge** | CloudFlare WAF | OWASP ModSec rules, rate limiting 1000/5min |
| **Network** | Security Groups | Deny-all, allow-specific |
| **Host** | ECS Task IAM Roles | Least-privilege policies |
| **Secrets** | AWS Secrets Manager | Auto-rotation, KMS encrypted |
| **Certificates** | ACM (AWS Certificate Manager) | Auto-renewal, 2048-bit RSA |
| **Audit** | AWS CloudTrail | 90-day immutable logs |
| **Scanning** | Trivy, CodeQL, Snyk | CI/CD pipeline integration |

### 7. CI/CD PIPELINE

```
GitHub Push → Security Scan → Build → Test → Container Scan → Push to ECR →
Deploy to Staging → Smoke Tests → Manual Approval → Deploy to Production →
Post-Deploy Tests → Notify Team → Backup Snapshot
```

**Pipeline Stages:**
1. **Security Scan** (5 min) - Trivy, CodeQL, npm audit, secret scanning
2. **Build & Test** (3 min) - npm ci, lint, unit tests, build
3. **Container Scan** (2 min) - Trivy container vulnerability scan
4. **Push to ECR** (1 min) - Push signed image
5. **Deploy to Staging** (5 min) - Terraform apply + ECS deploy
6. **Smoke Tests** (1 min) - Health checks
7. **Production Deploy** (5 min) - Blue-green deployment
8. **Canary Analysis** (optional) - Automated canary validation
9. **Rollback** (if health checks fail) - Automatic rollback on errors

### 8. DISASTER RECOVERY

| Scenario | RTO | RPO | Strategy |
|----------|-----|-----|----------|
| **Single AZ failure** | < 5 min | 0 | Multi-AZ deployment |
| **Region failure** | < 1 hour | < 15 min | Cross-region replication (warm standby) |
| **Database corruption** | < 30 min | < 1 hour | Point-in-time recovery (PITR) |
| **Accidental delete** | < 15 min | 0 | Deletion protection + daily backups |
| **DDoS attack** | < 2 min | N/A | CloudFlare + AWS Shield |

**Backup Strategy:**
- RDS automated backups: 7-day retention, daily snapshots
- ElastiCache snapshots: Daily, 7-day retention
- EBS volumes: Snapshot-based, incremental
- S3 versioning: Enabled for all buckets
- Global cross-region replication: Critical data

---

## ☁️ CLOUD PROVIDER SETUP (AWS)

### IAM Roles & Policies

```yaml
# ecs-task-execution-role
- AmazonECSTaskExecutionRolePolicy
- AmazonEC2ContainerRegistryReadOnly
- CloudWatchLogsFullAccess

# ecs-task-role
- Custom policy for SSM Parameter Store access
- S3 read access for assets
- CloudWatch metrics publishing

# backup-role
- AWSBackupServiceRolePolicyForBackup

# rds-monitoring-role
- AmazonRDSEnhancedMonitoringRole
```

### VPC Architecture

```
VPC: 10.0.0.0/16
├── Public Subnets (3 AZs)
│   ├── 10.0.101.0/24 - NAT Gateway A
│   ├── 10.0.102.0/24 - NAT Gateway B
│   └── 10.0.103.0/24 - NAT Gateway C
└── Private Subnets (3 AZs)
    ├── 10.0.1.0/24 - ECS Tasks, RDS (AZ A)
    ├── 10.0.2.0/24 - ECS Tasks, RDS (AZ B)
    └── 10.0.3.0/24 - ECS Tasks, RDS (AZ C)
```

---

## 🚀 DEPLOYMENT WORKFLOW

### GitHub Actions Workflow

1. **Developer pushes to main**
   ```
   git push origin main
   ```

2. **CI Pipeline triggers automatically**
   ```
   ├─ Security scanning (Trivy, CodeQL, npm audit)
   ├─ Build Docker image
   ├─ Run unit tests
   ├─ Push to ECR (ECR repository)
   └─ Create Terraform plan
   ```

3. **Deploy to staging (automatic)**
   ```
   ├─ Terraform apply (staging)
   ├─ ECS service update (staging)
   ├─ Run smoke tests
   └─ Notify Slack: "✅ Staging deployed"
   ```

4. **Promote to production (manual approval)**
   ```
   ├─ Manual approval in GitHub Actions
   ├─ Terraform apply (production)
   ├─ Blue-green ECS deployment
   ├─ Health checks (5 min)
   ├─ Canary analysis (5% traffic)
   ├─ Full traffic shift (100%)
   └─ Notify Slack: "🚀 Production live"
   ```

5. **Post-deployment**
   ```
   ├─ Create backup snapshot
   ├─ Update monitoring dashboards
   ├─ Run performance tests
   └─ Archive build artifacts to S3
   ```

---

## 📊 MONITORING & ALERTING

### Key Metrics to Monitor

| Metric | Threshold | Alert | Action |
|--------|-----------|-------|--------|
| CPU Utilization > 80% | Warning | Scale out |
| Memory Utilization > 85% | Warning | Scale out |
| Response Time p95 > 1s | Warning | Investigate |
| Error Rate > 5% | Critical | Immediate rollback |
| Database Connections > 80 | Warning | Check connection pool |
| Disk Space < 10% | Critical | Add storage |
| SSL Certificate < 7 days | Warning | Renew certificate |
| Deployment Failed | Critical | Notify DevOps |

### Grafana Dashboards

1. **Production Overview** - System health
2. **Application Performance** - Latency, throughput, errors
3. **Database Metrics** - Connections, queries, replication lag
4. **Cache Performance** - Hit rate, memory usage
5. **Infrastructure** - CPU, memory, network
6. **Business Metrics** - Visitor count, conversions, revenue

---

## 🔐 SECURITY IMPLEMENTATION

### Defense in Depth

```
┌─────────────────────────────────────────────────┐
│  Layer 7: WAF (CloudFlare + AWS WAF)           │  ←  SQLi, XSS, DDoS
├─────────────────────────────────────────────────┤
│  Layer 6: TLS 1.3 (End-to-end encryption)      │  ←  Perfect Forward Secrecy
├─────────────────────────────────────────────────┤
│  Layer 4: VPC + Security Groups                │  ←  Microsegmentation
├─────────────────────────────────────────────────┤
│  Layer 3: Private Subnets + NAT                │  ←  No direct internet
├─────────────────────────────────────────────────┤
│  Layer 2: IAM Roles + Policies                 │  ←  Least privilege
├─────────────────────────────────────────────────┤
│  Layer 1: Secrets Manager + KMS                │  ←  Encrypted at rest
└─────────────────────────────────────────────────┘
```

### Security Tools

- **SAST**: GitHub Code Scanning (CodeQL)
- **SCA**: npm audit, Trivy
- **DAST**: OWASP ZAP (staging only)
- **Container Scanning**: Trivy in CI/CD
- **Secret Detection**: git-secrets, TruffleHog
- **Infrastructure Scanning**: Checkov, tfsec

---

## 📈 SCALABILITY DESIGN

### Horizontal Scaling

- **Application**: ECS Service Auto Scaling (3-10 replicas)
- **Database**: Read replicas (1 primary + 2 read replicas)
- **Cache**: Redis Cluster Mode (sharded)
- **CDN**: Global edge network (300+ locations)
- **Load Balancer**: ALB with 1000+ targets support

### Performance Targets

| Metric | Target | Max |
|--------|--------|-----|
| Response Time (p95) | < 500ms | < 1s |
| Uptime (SLA) | 99.9% | 99.95% |
| Concurrent Users | 10,000+ | 50,000+ |
| Requests/sec | 1,000 | 5,000 |
| Cache Hit Ratio | > 70% | > 90% |

---

## 🔄 DISASTER RECOVERY PLAN

### Recovery Time Objectives (RTO)

| Component | RTO | Recovery Strategy |
|-----------|-----|------------------|
| Application server | 5 min | Auto-scaling group replacement |
| Database (primary) | 30 min | Promote read replica |
| Database (AZ failure) | 5 min | Automatic failover |
| Complete region loss | 1 hour | Deploy to secondary region |
| Data corruption | 15 min | Point-in-time recovery |

### Recovery Point Objectives (RPO)

| Data Type | RPO | Backup Strategy |
|-----------|-----|-----------------|
| Transactional data | 0 | Multi-AZ synchronous replication |
| Cache data | 5 min | Redis AOF persistence |
| Application logs | 1 hour | Centralized logging to S3 |
| Uploaded files | Real-time | S3 versioning + cross-region replication |

### DR Runbook

**Scenario: Primary Region (us-east-1) Failure**

1. **Detect** (automated) - CloudWatch alarms trigger
2. **Assess** (5 min) - Confirm region-wide outage
3. **Failover** (30 min):
   ```bash
   # Promote read replica in secondary region
   aws rds promote-read-replica --db-instance-identifier markzap-dr
   # Update DNS to point to secondary region
   aws route53 change-resource-record-sets --hosted-zone-id ...
   # Deploy containers to secondary region
   terraform apply -var="region=us-west-2"
   ```
4. **Validate** (15 min) - Smoke tests, health checks
5. **Monitor** (ongoing) - Enhanced monitoring for 24h
6. **Restore** (when primary recovers) - Reverse replication, fail back

---

## 📝 RUNBOOKS

### Common Incident Runbooks

1. **High Latency** → Check database connections, add replicas
2. **High Error Rate** → Rollback to previous deployment
3. **Memory Exhaustion** → Scale up or add more tasks
4. **Disk Full** → Add storage, clean logs
5. **SSL Certificate Expiry** → Automated renewal via Cert Manager
6. **DDoS Attack** → Enable rate limiting, enable under attack mode
7. **Data Corruption** → Restore from PITR backup
8. **Secrets Leaked** → Rotate all secrets immediately

---

## 🎯 COST OPTIMIZATION

### Estimated Monthly Costs (AWS us-east-1)

| Service | Qty | Cost/Month |
|---------|-----|------------|
| ECS Fargate (3 tasks) | 3x | $25 |
| ALB | 1x | $20 |
| RDS PostgreSQL (Multi-AZ) | 1x | $50 |
| ElastiCache Redis | 1x | $15 |
| S3 Storage | 10 GB | $0.30 |
| CloudFront | 100 GB transfer | $8 |
| CloudWatch Logs | 5 GB | $1 |
| Secrets Manager | 5 secrets | $0.50 |
| **Total (approx)** | | **~$120/month** |

**With auto-scaling peak load (10 tasks): ~$280/month**

---

## 📋 COMPLIANCE & AUDIT

### Compliance Frameworks

- **GDPR**: Data privacy, right to erasure (implemented via data deletion policies)
- **PCI DSS**: Not storing payment data directly (use Stripe/PayPal)
- **ISO 27001**: Security controls documented and implemented
- **SOC 2**: Audit logging, access controls, encryption

### Audit Trail

- CloudTrail: All API calls logged (90-day retention)
- CloudWatch Logs: Application logs (30-day retention)
- S3 Access Logs: All object access logged
- RDS Audit: PostgreSQL audit logging enabled
- WAF Logs: All blocked requests logged

---

## 🔧 OPERATIONAL RUNBOOKS

**See separate files:**
- `runbooks/incident-response.md`
- `runbooks/database-failover.md`
- `runbooks/ssl-renewal.md`
- `runbooks/scale-out.md`

---

## 📞 ESCALATION MATRIX

| Severity | Response Time | Primary | Secondary | Tertiary |
|----------|---------------|---------|-----------|----------|
| P0-Critical | 15 min | DevOps On-Call | CTO | Founder |
| P1-High | 1 hour | DevOps Lead | CTO | Founder |
| P2-Medium | 4 hours | DevOps Engineer | DevOps Lead | CTO |
| P3-Low | 24 hours | DevOps Engineer | DevOps Lead | - |

**Contact Channels:**
- Slack: #markzap-alerts (P0-P1), #markzap-dev (P2-P3)
- PagerDuty: For P0-P1 only
- Email: alerts@markzap.online
- SMS: Via PagerDuty

---

## 🎓 TRAINING & ONBOARDING

### New Engineer Onboarding Checklist

- [ ] Access to AWS console & IAM user created
- [ ] Access to GitHub repository
- [ ] Access to Vercel/Netlify dashboard
- [ ] Access to monitoring (Grafana, CloudWatch)
- [ ] Access to Slack channels
- [ ] Read infrastructure documentation
- [ ] Complete security training
- [ ] Set up local development environment
- [ ] Run deployment simulation
- [ ] Shadow on-call for 2 weeks

---

## 🔄 MAINTENANCE WINDOWS

| Frequency | Task | Duration | Impact |
|-----------|------|----------|--------|
| Daily | Log rotation, metrics review | 30 min | None (automated) |
| Weekly | Security patches, dependency updates | 2 hours | None (rolling) |
| Monthly | infrastructure updates, cost review | 4 hours | Potential brief downtime |
| Quarterly | Disaster recovery drill | 4 hours | Planned maintenance |
| Annually | Architecture review, compliance audit | - | Scheduled maintenance |

---

## 📚 DOCUMENTATION STRUCTURE

```
infrastructure/
├── ARCHITECTURE.md              (this file)
├── TERRAFORM/                    (IaC code)
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── modules/
├── KUBERNETES/                   (k8s manifests)
│   ├── manifests.yaml
│   ├── Helm/
│   └── kustomize/
├── MONITORING/                   (monitoring configs)
│   ├── prometheus/
│   ├── grafana/
│   ├── loki/
│   └── alertmanager/
├── SECURITY/                     (security policies)
│   ├── policies/
│   ├── scanning/
│   └── compliance/
├── RUNBOOKS/                     (operational runbooks)
│   ├── incident-response.md
│   ├── failover.md
│   └── rollback.md
├── SCRIPTS/                      (automation scripts)
│   ├── deploy.sh
│   ├── backup.sh
│   └── recovery.sh
└── DIAGRAMS/                     (architecture diagrams)
    ├── network.dwg
    └── data-flow.puml
```

---

**Version**: 1.0  
**Last Updated**: 2026-05-02  
**Maintained By**: MarkZap Infrastructure Team

---

## 🚀 GETTING STARTED

### Prerequisites

```bash
# 1. Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# 2. Configure AWS credentials
aws configure
# Enter: Access Key, Secret Key, region (us-east-1), output format (json)

# 3. Install Terraform
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
sudo apt-get update && sudo apt-get install terraform

# 4. Install Docker & docker-compose (for local dev)
sudo apt-get install docker.io docker-compose

# 5. Clone repository and deploy
git clone https://github.com/your-org/markzap.git
cd markzap
cd terraform/environments/production
terraform init
terraform plan
terraform apply
```

### Local Development with Docker Compose

```bash
# Start full stack locally
docker-compose up -d

# View logs
docker-compose logs -f web

# Stop
docker-compose down

# Backup
docker-compose exec postgres pg_dump -U markzap markzap > backup.sql
```

---

**This infrastructure provides enterprise-grade reliability, security, and scalability for MarkZap production workloads.**
