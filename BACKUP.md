# 🔄 MARKZAP BACKUP & RECOVERY PROCEDURES

## Backup Overview

MarkZap project uses a multi-layered backup strategy to ensure business continuity and data protection.

## 📦 Backup Architecture

### 1. Full Backups (Daily)
- **Location**: `backup/full_backups/`
- **Frequency**: Daily at 2:00 AM (automated)
- **Retention**: 7 days
- **Format**: Compressed tar.gz/zip
- **Contents**: Entire project excluding temp, backup, node_modules

### 2. Incremental Backups (Hourly)
- **Location**: `backup/incremental/`
- **Frequency**: Every 6 hours
- **Retention**: 30 days
- **Format**: Compressed tar.gz (changed files only)
- **Trigger**: `scripts/backup.sh --incremental`

### 3. Pre-Deployment Backups (Manual)
- **Trigger**: Before any production deploy
- **Location**: `backup/pre-deploy/`
- **Naming**: `pre-deploy_[timestamp].tar.gz`
- **Verification**: MD5 checksum generated

### 4. Cloud Sync (Optional)
- **Google Drive**: `gdrive` sync to `markzap-backups` folder
- **AWS S3**: `aws s3 sync backup/ s3://markzap-backups/`
- **Configure in**: `config/deployment.json`

## 🚀 Running Backups

### Windows (PowerShell/Batch)
```powershell
# Manual full backup
.\scripts\backup.bat

# Schedule daily (Task Scheduler)
# Create task: Daily at 2AM, action: Start program -> backup.bat
```

### Unix/Linux/macOS
```bash
# Manual full backup
./scripts/backup.sh

# Make executable
chmod +x scripts/backup.sh

# Add to crontab (crontab -e)
0 2 * * * /path/to/webside/scripts/backup.sh >> /var/log/markzap-backup.log 2>&1
```

### Using npm (if package.json added later)
```json
{
  "scripts": {
    "backup": "./scripts/backup.sh",
    "backup:incremental": "./scripts/backup.sh --incremental",
    "backup:clean": "find backup -type f -mtime +7 -delete"
  }
}
```

## 📁 Backup Manifest Structure

The `backup/manifest.json` tracks all backups:

```json
{
  "backups": [
    {
      "timestamp": "2026-05-02_06-44-00",
      "type": "full",
      "path": "full_backups/markzap_backup_2026-05-02_06-44-00.tar.gz",
      "size_bytes": 5242880,
      "verified": true,
      "checksum": "sha256:abc123..."
    }
  ]
}
```

## 🔍 Verifying Backups

### Automated Verification
- Backup script runs integrity check automatically
- Archive listing extracted to verify contents
- Checksum (MD5/SHA256) stored in manifest

### Manual Verification
```bash
# List backup contents
tar -tzf backup/full_backups/markzap_backup_2026-05-02_06-44-00.tar.gz

# Extract and compare
mkdir /tmp/restore_test
tar -xzf backup/full_backups/markzap_backup_2026-05-02_06-44-00.tar.gz -C /tmp/restore_test
diff -r /tmp/restore_test .  # Should show no differences

# Verify checksum
sha256sum backup/full_backups/markzap_backup_2026-05-02_06-44-00.tar.gz
```

## ♻️ Restoring from Backup

### Full Restore Procedure

1. **Stop all services** (if running):
   ```bash
   # Stop web server, CI/CD pipelines, etc.
   systemctl stop nginx  # or apache2, etc.
   ```

2. **Move current files to temporary location** (safety net):
   ```bash
   mkdir -p recovery/pre-restore-$(date +%s)
   mv * .* recovery/pre-restore-$(date +%s)/ 2>/dev/null || true
   ```

3. **Extract latest backup**:
   ```bash
   LATEST=$(ls -t backup/full_backups/markzap_backup_*.tar.gz | head -1)
   tar -xzf "$LATEST" -C .
   ```

4. **Restore permissions**:
   ```bash
   chmod -R 755 .
   chmod 600 config/*.json 2>/dev/null || true
   ```

5. **Validate**:
   ```bash
   # Check file structure
   ls -la
   # Test locally if possible
   ```

6. **Restart services**:
   ```bash
   systemctl start nginx
   # Or redeploy to hosting platform
   ```

### Partial Restore (Single File/Folder)

```bash
# Extract specific file from backup
tar -xzf backup/full_backups/markzap_backup_2026-05-02_06-44-00.tar.gz path/to/file.html

# Extract specific directory
tar -xzf backup/full_backups/markzap_backup_2026-05-02_06-44-00.tar.gz assets/
```

## 🗄️ Retention Policy

| Backup Type | Retention | Storage Location |
|-------------|-----------|------------------|
| Daily Full | 7 days | Local `backup/full_backups/` |
| Hourly Incremental | 30 days | Local `backup/incremental/` |
| Pre-Deploy | Unlimited (until manual cleanup) | `backup/pre-deploy/` |
| Cloud Sync | 90 days | Google Drive/S3 (configurable) |
| Archive | 1 year | External hard drive / Offsite |

## 📊 Monitoring & Alerts

### Backup Success Notification
Configure in `config/deployment.json`:
```json
{
  "backup": {
    "notify_on_success": true,
    "notify_on_failure": true,
    "email_alerts": ["admin@markzap.online"],
    "webhook_url": "https://hooks.slack.com/services/..."
  }
}
```

### Health Checks
- Backup script exits with code 0 on success, non-zero on failure
- Cron job logs to `/var/log/markzap-backup.log`
- Manually review manifest monthly

## 🧪 Disaster Recovery Drills

**Quarterly** perform full restore to test environment:

1. Create staging environment
2. Restore latest backup
3. Verify application works
4. Document any issues
5. Update this document with lessons learned

## 🔐 Backup Encryption (Optional)

For highly sensitive environments:

```bash
# Encrypt backup with GPG
tar -czf - . | gpg --encrypt --recipient backup@markzap.online > backup_encrypted.tar.gz.gpg

# Decrypt when needed
gpg --decrypt backup_encrypted.tar.gz.gpg | tar -xzf -
```

**Store encryption keys separately from backups**.

## 📞 Support

If backup/restore fails:
1. Check `scripts/backup.bat` or `backup.sh` logs
2. Verify disk space: `df -h`
3. Test archive manually: `tar -tzf backup_file.tar.gz`
4. Contact: devops@markzap.online

---

**Last Updated**: 2026-05-02
**Version**: 1.0
**Next Drill Date**: 2026-08-02
