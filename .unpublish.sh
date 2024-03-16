#!/bin/sh

version=$(grep -o '"version": "[^"]*' package.json  | grep -o '[^"]*$')
echo -e "unpublish version is "$version
if [[ $version == "" ]]
then
	echo "unpublish abort."
else
    git tag --delete v${version}
    git push origin --delete v${version}
    read -p "unpublish done."
fi