Write-Host "Installing Capacitor..."
npm install @capacitor/core @capacitor/android
npm install -D @capacitor/cli

Write-Host "Initializing Capacitor..."
npx cap init Agri-Rent app.agrirent.hub --web-dir dist

Write-Host "Building React App..."
npm run build

Write-Host "Adding Android Platform..."
npx cap add android

Write-Host "Syncing Capacitor..."
npx cap sync

Write-Host "Building APK..."
Set-Location android
.\gradlew.bat assembleDebug

Write-Host "Done!"
