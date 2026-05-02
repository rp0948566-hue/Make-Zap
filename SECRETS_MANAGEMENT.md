# SECRETS MANAGEMENT - Military Grade
# Using AWS Secrets Manager + HashiCorp Vault (optional)

# ============================================
# AWS SECRETS MANAGER
# ============================================
# Store all production secrets here
# Access via IAM roles (no hardcoded credentials)

# Secrets to create in AWS Secrets Manager:
# /markzap/prod/database/password
# /markzap/prod/redis/password
# /markzap/prod/session/secret
# /markzap/prod/api/keys/stripe
# /markzap/prod/api/keys/sendgrid
# /markzap/prod/certificates/ssl

# Access via AWS CLI:
aws secretsmanager get-secret-value --secret-id /markzap/prod/database/password

# Access via Node.js:
const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager();
const secret = await secretsManager.getSecretValue({ SecretId: '/markzap/prod/database/password' }).promise();

# ============================================
# KUBERNETES EXTERNAL-SECRETS (Optional)
# ============================================
# Sync AWS Secrets Manager to K8s Secrets automatically
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: markzap-secrets
  namespace: markzap
spec:
  refreshInterval: "1h"
  secretStoreRef:
    name: aws-secretsmanager
    kind: SecretStore
  target:
    name: markzap-secrets
    creationPolicy: Owner
  data:
    - secretKey: POSTGRES_PASSWORD
      remoteRef:
        key: /markzap/prod/database/password
    - secretKey: REDIS_PASSWORD
      remoteRef:
        key: /markzap/prod/redis/password
    - secretKey: SESSION_SECRET
      remoteRef:
        key: /markzap/prod/session/secret

# ============================================
# HASHICORP VAULT (Optional - On-Prem)
# ============================================
# Install Vault in private subnet
# Enable KMS auto-unseal
# Configure database secret engine
# Enable KV v2

# Vault policies:
path "secret/data/markzap/*" {
  capabilities = ["read"]
}

# Generate database credentials dynamically:
vault read database/creds/markzap-role

# ============================================
# ENVIRONMENT VARIABLES (Local Development)
# NEVER commit real values to git
# ============================================

# .env.example (commit this template)
NODE_ENV=production
PORT=3000

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=markzap
DATABASE_USER=markzap
DATABASE_PASSWORD=changeme

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=changeme

# AWS (if using)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=changeme
AWS_SECRET_ACCESS_KEY=changeme

# Session
SESSION_SECRET=changeme-very-long-random-string

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=markzap22@gmail.com
SMTP_PASS=changeme

# External APIs
STRIPE_SECRET_KEY=sk_test_changeme
SENDGRID_API_KEY=SG.changeme

# ============================================
# SECRET ROTATION SCHEDULE
# ============================================

# Frequency | Secret Type | Method
# ----------|-------------|--------
# 90 days   | Database passwords | AWS Secrets Manager auto-rotation
# 180 days  | API keys          | Manual rotation + rolling update
# 365 days  | TLS certificates  | ACM auto-renewal
# 30 days   | Session secrets   | Application-level rotation
# Immediate | Compromised       | Revoke + rotate all

# ============================================
# SECRETS AUDIT
# ============================================

# Monthly audit checklist:
# [ ] Review IAM access to secrets
# [ ] Rotate all access keys (90-day policy)
# [ ] Review audit logs for unusual access patterns
# [ ] Test secret rotation scripts
# [ ] Validate backup recovery of secrets
# [ ] Update secrets in all environments

# ============================================
# INCIDENT RESPONSE - Secret Leak
# ============================================

# If secret found in Git history:
# 1. Revoke immediately in Secrets Manager
# 2. Rotate to new value
# 3. Update all applications (rolling restart)
# 4. Git filter-branch to remove from history:
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/secret" \
  --prune-empty --tag-name-filter cat -- --all
# 5. Force push (coordinate with team)
# 6. Invalidate all sessions using old secret

# ============================================
# CI/CD SECRETS
# ============================================

# GitHub Secrets (Settings → Secrets and variables → Actions):
# VERCEL_TOKEN - Vercel authentication
# ORG_ID - Vercel org ID
# PROJECT_ID - Vercel project ID
# AWS_ACCESS_KEY_ID - AWS access
# AWS_SECRET_ACCESS_KEY - AWS secret
# AWS_REGION - AWS region
# SLACK_WEBHOOK - Slack notifications
# GRAFANA_TOKEN - Grafana API access
# PAGERDUTY_INTEGRATION_KEY - PagerDuty routing

# Store as "Secrets" (not variables) - encrypted at rest

# ============================================
# SECRETS SCANNING IN CI
# ============================================

# Add to CI pipeline:
- name: Scan for secrets
  run: |
    # Use git-secrets
    git-secrets --scan -r
    
    # Use TruffleHog
    trufflehog --regex --entropy=False .
    
    # Use detect-secrets
    detect-secrets scan > .secrets.baseline
    
    # Fail if secrets found
    if [ -s .secrets.baseline ]; then
      echo "❌ Secrets detected!"
      cat .secrets.baseline
      exit 1
    fi
