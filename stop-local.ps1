# ============================================================================
#  stop-local.ps1  —  stoppt die lokalen Prototyp-Server (ohne Docker)
#  Beendet, was auf Port 8080 (Vite-Frontend) und 3000 (Express-Backend) lauscht.
#  Aufruf:  .\stop-local.ps1
# ============================================================================
foreach ($p in 8080, 3000) {
  $owningPids = (Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue).OwningProcess |
    Select-Object -Unique
  foreach ($procId in $owningPids) {
    try { Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue } catch {}
  }
}
Start-Sleep -Seconds 1
Write-Host ''
Write-Host '  Server gestoppt — Ports 8080/3000 frei. Bereit fuer den naechsten Slot.' -ForegroundColor Yellow
