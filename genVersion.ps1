# get git data
#requires -version 2.0

# current location


$netModRev= $(git log --oneline | measure-object –line)."lines"
$netModDesc=$(git describe --tags --long)
$netModV=$netModDesc.split("-")[0]
$netModHashL=$(git rev-parse HEAD)
$netModHash=$netModHashL.Substring(0,8)

$netModDateDay=$(git log -1 --date=format:'%d' --pretty=format:%cd)
$netModDateMonth=$(git log -1 --date=format:'%m' --pretty=format:%cd)
$netModDateYear=$(git log -1 --date=format:'%Y' --pretty=format:%cd)

echo $("SpericalViewer " + $netModV + " - rev " + $netModRev)
echo $($netModHashL + " / " + $netModHash + " from " + $netModDateYear + "-" + $netModDateMonth + "-" + $netModDateDay)

# JSON VERSION

$genFolder="app\version"
$templateFolder="templates"
$versionFile="versions.json"

# make
if ( -not (Test-Path $genFolder) ) { mkdir $genFolder }

# replace
cp -force $($templateFolder + "\" + $versionFile) $($genFolder + "\" + $versionFile)

# include data
(get-content $($genFolder + "\" + $versionFile)) -replace '_\$_GIT_REV_PLACEHOLDER_\$_', $netModRev | set-content $($genFolder + "\" + $versionFile)
(get-content $($genFolder + "\" + $versionFile)) -replace '_\$_GIT_DATE_DAY_PLACEHOLDER_\$_', $netModDateDay | set-content $($genFolder + "\" + $versionFile)
(get-content $($genFolder + "\" + $versionFile)) -replace '_\$_GIT_DATE_MONTH_PLACEHOLDER_\$_', $netModDateMonth | set-content $($genFolder + "\" + $versionFile)
(get-content $($genFolder + "\" + $versionFile)) -replace '_\$_GIT_DATE_YEAR_PLACEHOLDER_\$_', $netModDateYear | set-content $($genFolder + "\" + $versionFile)
(get-content $($genFolder + "\" + $versionFile)) -replace '_\$_GIT_HASH_PLACEHOLDER_\$_', $("`"" + $netModHash + "`"") | set-content $($genFolder + "\" + $versionFile)
(get-content $($genFolder + "\" + $versionFile)) -replace '_\$_GIT_HASH_LONG_PLACEHOLDER_\$_', $("`"" + $netModHashL + "`"") | set-content $($genFolder + "\" + $versionFile)
(get-content $($genFolder + "\" + $versionFile)) -replace '_\$_GIT_VER_PLACEHOLDER_\$_', $("`"" + $netModV + "`"") | set-content $($genFolder + "\" + $versionFile)