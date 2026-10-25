# Cosmo School - One-click live script (Windows PowerShell)
# Starts: WordPress (Docker) + production Next.js (port 3001) + Cloudflare Tunnel
# Public URL is printed at the end; it CHANGES on every restart (quick tunnel).

$ErrorActionPreference = "SilentlyContinue"
$ROOT = "D:\open Code\cosmo_web"
$CF   = "C:\Program Files (x86)\cloudflared\cloudflared.exe"
$LOG  = "$env:TEMP\opencode\cosmo-live.log"
$LOG  = "C:\Users\sakib\AppData\Local\Temp\opencode\cosmo-live.log"

function Is-PortOpen($port) {
    return [bool](Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue)
}

Write-Host "== Cosmo School live ==" -ForegroundColor Cyan

# --- 1. WordPress (Docker) ---
if (Is-PortOpen 8080) {
    Write-Host "[1/3] WordPress: already running on :8080" -ForegroundColor Green
} else {
    Write-Host "[1/3] Starting WordPress (docker compose up -d)..." -ForegroundColor Yellow
    Push-Location $ROOT
    docker compose up -d
    Pop-Location
    Start-Sleep -Seconds 5
    if (Is-PortOpen 8080) { Write-Host "      WordPress is up on :8080" -ForegroundColor Green } else { Write-Host "      WordPress FAILED to start" -ForegroundColor Red }
}

# --- 2. Production Next.js ---
if (Is-PortOpen 3001) {
    Write-Host "[2/3] Next.js: already running on :3001" -ForegroundColor Green
} else {
    Write-Host "[2/3] Building (if needed) and starting Next.js on :3001..." -ForegroundColor Yellow
    Push-Location $ROOT
    if (-not (Test-Path ".next\BUILD_ID")) { npx next build }
    $env:PORT = "3001"
    Start-Process -FilePath "cmd.exe" -ArgumentList '/c', 'set PORT=3001 && npx next start -p 3001' -WorkingDirectory $ROOT -WindowStyle Hidden
    Pop-Location
    Start-Sleep -Seconds 8
    if (Is-PortOpen 3001) { Write-Host "      Next.js is up on :3001" -ForegroundColor Green } else { Write-Host "      Next.js FAILED to start" -ForegroundColor Red }
}

# --- 3. Cloudflare Tunnel ---
$tlog = "$LOG.tunnel.log"
if (Get-Process cloudflared -ErrorAction SilentlyContinue) {
    Write-Host "[3/3] Tunnel: cloudflared already running" -ForegroundColor Green
} else {
    Write-Host "[3/3] Starting Cloudflare tunnel..." -ForegroundColor Yellow
    if (Test-Path $tlog) { Remove-Item $tlog -Force }
    Start-Process -FilePath $CF -ArgumentList 'tunnel --url http://127.0.0.1:3001 --logfile', ("`"" + $tlog + "`"") -WindowStyle Hidden
    Start-Sleep -Seconds 12
    Write-Host "      Tunnel connected" -ForegroundColor Green
}

# --- Public URL ---
$url = $null
for ($i = 0; $i -lt 5 -and -not $url; $i++) {
    if (Test-Path $tlog) {
        $m = Select-String -Path $tlog -Pattern "https://[a-z0-9-]+\.trycloudflare\.com" | Select-Object -Last 1
        if ($m) { $url = $m.Matches[0].Value }
    }
    if (-not $url) { Start-Sleep -Seconds 2 }
}

Write-Host ""
if ($url) {
    Write-Host "  Site is LIVE at:  $url" -ForegroundColor Green
    Write-Host "  (URL changes every restart; PC & Docker must stay on)" -ForegroundColor DarkGray
} else {
    Write-Host "  Tunnel running but URL not found yet - check log: $tlog" -ForegroundColor DarkYellow
}
Write-Host "  Local:   http://localhost:3001 (frontend)   http://localhost:8080 (WordPress)" -ForegroundColor DarkGray
Write-Host "  To stop: close this window / kill cloudflared + node" -ForegroundColor DarkGray