@echo off

rem get git data

echo Try cygwin...
if exist C:\cygwin\bin\bash (
	C:\cygwin\bin\bash genVersion
	goto END
) else (
	echo skiped - not installed
)

FOR /F "tokens=3" %%A IN ('REG QUERY "HKLM\SOFTWARE\Microsoft\PowerShell\1" /v Install ^| FIND "Install"') DO SET PowerShellInstalled=%%A

echo Try powershell...
IF "%PowerShellInstalled%"=="0x1" (
	powershell .\genVersion.ps1
	goto END
) else (
	echo skiped - not installed
)

genVersionBatch.bat

:END
pause