# GitHub Pages（gh-pages ブランチ）へデプロイする
# usage: npm run deploy   （ローカルミラー C:\Users\hp\dev\hidden-skill で実行）
$ErrorActionPreference = 'Stop'
$repo = 'https://github.com/kasugai-s-web/hidden-skill.git'
$root = Split-Path $PSScriptRoot -Parent

Set-Location $root
npm run build
if ($LASTEXITCODE -ne 0) { throw 'build failed' }

Set-Location "$root\dist"
New-Item -ItemType File -Force .nojekyll | Out-Null
if (-not (Test-Path .git)) { git init -q -b gh-pages }
if (-not (git config user.name)) {
  git config user.name 'kasugai-s-web'
  git config user.email 'kasugai-s-web@users.noreply.github.com'
}
git add -A
git commit -q --allow-empty -m "Deploy $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git push -f $repo gh-pages:gh-pages
Write-Host 'deployed: https://kasugai-s-web.github.io/hidden-skill/'
