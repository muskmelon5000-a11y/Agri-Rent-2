$ProgressPreference = 'SilentlyContinue'

Write-Host "Downloading OpenJDK 17..."
Invoke-WebRequest -Uri "https://download.java.net/java/GA/jdk17.0.2/dfd4a8d0985749f896bed50d7138ee7f/8/GPL/openjdk-17.0.2_windows-x64_bin.zip" -OutFile "jdk17.zip"

Write-Host "Extracting JDK 17..."
Expand-Archive jdk17.zip -DestinationPath . -Force

$env:JAVA_HOME = "$PWD\jdk-17.0.2"
Write-Host "Set JAVA_HOME to $env:JAVA_HOME"

Set-Location android
Write-Host "Building APK with Java 17..."
.\gradlew.bat assembleDebug
