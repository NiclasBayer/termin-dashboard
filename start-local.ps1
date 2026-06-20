# ============================================================================
#  start-local.ps1  —  Prototyp lokal starten (Frontend-only, ohne Docker)
#  Vite-Dev-Server auf http://localhost:8080
#
#  Aufruf im Projektordner:
#     .\start-local.ps1
# ============================================================================
$root = $PSScriptRoot

function Stop-Port($port) {
  $owningPids = (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue).OwningProcess |
    Select-Object -Unique
  foreach ($procId in $owningPids) {
    try { Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue } catch {}
  }
}

# Alten Server beenden (verhindert Port-Konflikte)
Stop-Port 8080

Start-Process -WorkingDirectory "$root\frontend" -FilePath 'npm.cmd' -ArgumentList 'run', 'dev' -WindowStyle Minimized

Write-Host ''
Write-Host '  Prototyp startet…  ->  http://localhost:8080' -ForegroundColor Green
Write-Host '  (Server-Fenster ist minimiert. Schliessen = stoppen.)' -ForegroundColor DarkGray
