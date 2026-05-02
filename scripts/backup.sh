#!/bin/bash
# ============================================
# MARKZAP PROJECT - AUTOMATED BACKUP SCRIPT
# Unix/Linux/macOS Bash
# Creates timestamped backups with verification
# ============================================

set -e  # Exit on error

echo "[INFO] Starting MarkZap backup process..."

# Set variables
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_DIR="backup"
FULL_BACKUP_DIR="$BACKUP_DIR/full_backups"
INCREMENTAL_DIR="$BACKUP_DIR/incremental"
MANIFEST="$BACKUP_DIR/manifest.json"
PROJECT_ROOT="$(pwd)"

echo "[INFO] Timestamp: $TIMESTAMP"

# Create directories
mkdir -p "$FULL_BACKUP_DIR" "$INCREMENTAL_DIR"

# Compute project size
SIZE_BEFORE=$(du -sb "$PROJECT_ROOT" | cut -f1)
echo "[INFO] Project size: ${SIZE_BEFORE} bytes"

# Create full backup (compressed tar.gz)
echo "[INFO] Creating full backup archive..."
BACKUP_FILE="$FULL_BACKUP_DIR/markzap_backup_$TIMESTAMP.tar.gz"

# Exclude backup dir, temp, and .git from backup
tar -czf "$BACKUP_FILE" \
  --exclude='backup/' \
  --exclude='temp/' \
  --exclude='.git/' \
  --exclude='node_modules/' \
  --exclude='.playwright-mcp/' \
  -C "$PROJECT_ROOT" .

if [ ! -f "$BACKUP_FILE" ]; then
    echo "[ERROR] Backup creation failed!"
    exit 1
fi

# Get actual backup size
BACKUP_SIZE=$(stat -c%s "$BACKUP_FILE" 2>/dev/null || stat -f%z "$BACKUP_FILE" 2>/dev/null)

# Update manifest
echo "[INFO] Updating backup manifest..."
if [ ! -f "$MANIFEST" ]; then
    echo '{"backups":[' > "$MANIFEST"
else
    # Remove last bracket and add comma
    sed -i '' '$s/],$/,/' "$MANIFEST" 2>/dev/null || sed -i '$s/],$/,/' "$MANIFEST"
fi

cat >> "$MANIFEST" << EOF
  {
    "timestamp": "$TIMESTAMP",
    "type": "full",
    "path": "full_backups/$(basename "$BACKUP_FILE")",
    "size_bytes": $BACKUP_SIZE,
    "verified": true
  }
]
EOF

# Verify backup integrity
echo "[INFO] Verifying backup integrity..."
if tar -tzf "$BACKUP_FILE" > /dev/null 2>&1; then
    echo "[INFO] Backup archive is valid."
else
    echo "[ERROR] Backup verification failed!"
    rm -f "$BACKUP_FILE"
    exit 1
fi

# Clean up old backups (keep last 7 days)
echo "[INFO] Cleaning up backups older than 7 days..."
find "$FULL_BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete 2>/dev/null || true

# Clean up incremental backups (keep last 30 days)
find "$INCREMENTAL_DIR" -name "*.tar.gz" -mtime +30 -delete 2>/dev/null || true

echo ""
echo "[SUCCESS] Backup completed successfully!"
echo "  File: $(basename "$BACKUP_FILE")"
echo "  Location: $FULL_BACKUP_DIR"
echo "  Size: $((BACKUP_SIZE / 1024)) KB"
echo "  Manifest: $MANIFEST"
echo ""
echo "Next steps:"
echo "  1. Verify backup file exists"
echo "  2. Upload to cloud storage (Google Drive, S3, etc.)"
echo "  3. Test restoration procedure monthly"

exit 0
