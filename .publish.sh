#!/bin/sh

version=$(grep -o '"version": "[^"]*' package.json  | grep -o '[^"]*$')
echo -e "publish version is "$version
if [[ $version == "" ]]
then
	echo "publish abort."
else
    git tag v${version}
    git push --tags
    read -p "publish done."
fi