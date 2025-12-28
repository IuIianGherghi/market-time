# Market-Time Deployment Script
# Deployment automat pe server cloudify.ro

$SERVER_IP = "185.104.181.59"
$SSH_USER = "root"
$DOMAIN = "api.market-time.ro"

Write-Host "🚀 Market-Time Deployment Script" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""

# Function to execute SSH commands
function SSH-Execute {
    param(
        [string]$Command,
        [string]$Description
    )
    Write-Host "⚙️  $Description..." -ForegroundColor Yellow
    ssh ${SSH_USER}@${SERVER_IP} $Command
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $Description - Complete!" -ForegroundColor Green
    } else {
        Write-Host "❌ $Description - Failed!" -ForegroundColor Red
        exit 1
    }
}

Write-Host "📋 Deployment Steps:" -ForegroundColor Cyan
Write-Host "1. Clone repository from GitHub" -ForegroundColor White
Write-Host "2. Copy theme files to WordPress" -ForegroundColor White
Write-Host "3. Copy mu-plugins to WordPress" -ForegroundColor White
Write-Host "4. Set correct permissions" -ForegroundColor White
Write-Host "5. Import database schema" -ForegroundColor White
Write-Host ""

$confirm = Read-Host "Continue with deployment? (y/n)"
if ($confirm -ne 'y') {
    Write-Host "Deployment cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "🔧 Starting deployment..." -ForegroundColor Green
Write-Host ""

# Step 1: Find WordPress installation path
Write-Host "🔍 Finding WordPress installation path..." -ForegroundColor Yellow
$WP_PATH = ssh ${SSH_USER}@${SERVER_IP} "find /home -name 'api.market-time.ro' -type d 2>/dev/null | head -1"
if ([string]::IsNullOrEmpty($WP_PATH)) {
    Write-Host "❌ WordPress installation not found!" -ForegroundColor Red
    Write-Host "💡 Please check if site 'api.market-time.ro' is created in CloudPanel" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Found WordPress at: $WP_PATH" -ForegroundColor Green
Write-Host ""

# Step 2: Clone repository
SSH-Execute "cd /tmp && rm -rf market-time-repo && git clone https://github.com/IuIianGherghi/market-time.git market-time-repo" "Cloning repository from GitHub"

# Step 3: Copy theme
SSH-Execute "cp -r /tmp/market-time-repo/market-time/backend/wp-content/themes/market-time ${WP_PATH}/wp-content/themes/" "Copying Market-Time theme"

# Step 4: Create mu-plugins directory if not exists
SSH-Execute "mkdir -p ${WP_PATH}/wp-content/mu-plugins" "Creating mu-plugins directory"

# Step 5: Copy mu-plugins
SSH-Execute "cp /tmp/market-time-repo/market-time/backend/wp-content/mu-plugins/*.php ${WP_PATH}/wp-content/mu-plugins/" "Copying must-use plugins"

# Step 6: Copy SQL scripts to temp
SSH-Execute "cp /tmp/market-time-repo/market-time/scripts/create-tables-v2.sql /tmp/" "Copying SQL scripts"

# Step 7: Set permissions
SSH-Execute "chown -R clp:clp ${WP_PATH}/wp-content/themes/market-time" "Setting theme permissions"
SSH-Execute "chown -R clp:clp ${WP_PATH}/wp-content/mu-plugins" "Setting mu-plugins permissions"
SSH-Execute "chmod -R 755 ${WP_PATH}/wp-content/themes/market-time" "Setting theme file permissions"
SSH-Execute "chmod -R 755 ${WP_PATH}/wp-content/mu-plugins" "Setting mu-plugins file permissions"

# Step 8: Cleanup
SSH-Execute "rm -rf /tmp/market-time-repo" "Cleaning up temporary files"

Write-Host ""
Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Import database schema:" -ForegroundColor White
Write-Host "   ssh ${SSH_USER}@${SERVER_IP}" -ForegroundColor Gray
Write-Host "   mysql -u DB_USER -p DB_NAME < /tmp/create-tables-v2.sql" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Configure wp-config.php (add API keys)" -ForegroundColor White
Write-Host ""
Write-Host "3. Login to WordPress Admin:" -ForegroundColor White
Write-Host "   https://${DOMAIN}/wp-admin" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Install ACF plugin and activate Market-Time theme" -ForegroundColor White
Write-Host ""
Write-Host "5. Test API:" -ForegroundColor White
Write-Host "   https://${DOMAIN}/wp-json/market-time/v1/products" -ForegroundColor Gray
Write-Host ""
