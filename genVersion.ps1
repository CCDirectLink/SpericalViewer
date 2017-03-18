# get git data
#requires -version 2.0

# current location


$dataRev=$(git log --oneline | measure-object –line)."lines"
$dataDesc=$(git describe --tags --long)
$dataV=$dataDesc.split("-")[0]
$dataHashL=$(git rev-parse HEAD)
$dataHash=$dataHashL.Substring(0,8)

$dateDay=$(git log -1 --date=format:'%d' --pretty=format:%cd)
$dateMonth=$(git log -1 --date=format:'%m' --pretty=format:%cd)
$dateYear=$(git log -1 --date=format:'%Y' --pretty=format:%cd)

# TRIM

$dateDay=($dateDay).TrimStart('0')
$dateMonth=($dateMonth).TrimStart('0')
$dateYear=($dateYear).TrimStart('0')

# ECHO

echo $("SpericalViewer " + $dataV + " - rev " + $dataRev)
echo $($dataHashL + " / " + $dataHash + " from " + $dateYear + "-" + $dateMonth + "-" + $dateDay)

# JSON VERSION

$genFolder="app\version"
$templateFolder="templates"
$versionFile="versions.json"

# make
if ( -not (Test-Path $genFolder) ) { mkdir $genFolder }

# replace
cp -force $($templateFolder + "\" + $versionFile) $($genFolder + "\" + $versionFile)

# include data
(get-content $($genFolder + "\" + $versionFile)) -replace '_\$_GIT_REV_PLACEHOLDER_\$_', $dataRev | set-content $($genFolder + "\" + $versionFile)
(get-content $($genFolder + "\" + $versionFile)) -replace '_\$_GIT_DATE_DAY_PLACEHOLDER_\$_', $dateDay | set-content $($genFolder + "\" + $versionFile)
(get-content $($genFolder + "\" + $versionFile)) -replace '_\$_GIT_DATE_MONTH_PLACEHOLDER_\$_', $dateMonth | set-content $($genFolder + "\" + $versionFile)
(get-content $($genFolder + "\" + $versionFile)) -replace '_\$_GIT_DATE_YEAR_PLACEHOLDER_\$_', $dateYear | set-content $($genFolder + "\" + $versionFile)
(get-content $($genFolder + "\" + $versionFile)) -replace '_\$_GIT_HASH_PLACEHOLDER_\$_', $("`"" + $dataHash + "`"") | set-content $($genFolder + "\" + $versionFile)
(get-content $($genFolder + "\" + $versionFile)) -replace '_\$_GIT_HASH_LONG_PLACEHOLDER_\$_', $("`"" + $dataHashL + "`"") | set-content $($genFolder + "\" + $versionFile)
(get-content $($genFolder + "\" + $versionFile)) -replace '_\$_GIT_VER_PLACEHOLDER_\$_', $("`"" + $dataV + "`"") | set-content $($genFolder + "\" + $versionFile)