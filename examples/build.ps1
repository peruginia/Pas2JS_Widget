# Builds the host and module examples with pas2js.
#
# Usage:
#   .\examples\build.ps1
#   .\examples\build.ps1 -Pas2JS C:\lazarus\pas2js\bin\x86_64-win64\pas2js.exe -Php C:\Vario\xampp\php\php.exe
#
# The host is compiled as one JavaScript bundle; the module is compiled per
# unit (-Jc-) into examples/module/lib, and module-manifest.php writes the
# modules.json used by both the host loader and the standalone test page.

param(
  [string]$Pas2JS = $env:PAS2JS,
  [string]$Php = 'php'
)

$ErrorActionPreference = 'Stop'
$examples = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo = Split-Path -Parent $examples

if (-not $Pas2JS) {
  $Pas2JS = 'C:\lazarus\pas2js\bin\x86_64-win64\pas2js.exe'
}
if (-not (Test-Path $Pas2JS)) {
  throw "pas2js not found: $Pas2JS (use -Pas2JS <path>)"
}

Push-Location $repo
try {
  $common = @('-Jirtl.js', '-Jm-', '-Jeutf-8', '-JRjs', '-O-', '-Fuwidgets')

  Write-Host 'Building examples/host...'
  Get-ChildItem 'examples/host' -Filter *.js.map -ErrorAction SilentlyContinue | Remove-Item -Force
  & $Pas2JS @common '-Jc' '-Fuexamples/host' '-oexamples/host/project1.js' 'examples/host/project1.lpr'
  if ($LASTEXITCODE -ne 0) { throw "host build failed ($LASTEXITCODE)" }

  New-Item -ItemType Directory -Force 'examples/module/lib' | Out-Null
  Get-ChildItem 'examples/module/lib' -Filter *.js.map -ErrorAction SilentlyContinue | Remove-Item -Force

  Write-Host 'Building examples/module...'
  & $Pas2JS @common '-Jc-' '-FUexamples/module/lib' '-Fuexamples/host' '-Fuexamples/module' `
    '-oexamples/module/lib/project1.js' 'examples/module/project1.lpr'
  if ($LASTEXITCODE -ne 0) { throw "module build failed ($LASTEXITCODE)" }

  Write-Host 'Writing examples/module/lib/modules.json...'
  & $Php 'design/tools/module-manifest.php' 'examples/module/lib' 'examples/module/lib/modules.json' 'Module1'
  if ($LASTEXITCODE -ne 0) { throw "manifest generation failed ($LASTEXITCODE)" }
}
finally {
  Pop-Location
}
