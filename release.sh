#!/usr/bin/env bash

# Only on master
if [ "$(git rev-parse --abbrev-ref HEAD)" != "master" ]; then
  echo "Failure: You can version only when on master branch"
  exit 1
fi

# No uncommitted changes
if [ ! -z "$(git status --porcelain)" ]; then
  echo "Failure: You can version only on a clean working directory"
  exit 1
fi


oldversion=$(cut -d ',' -f2 .version)
newversion=$(expr "$oldversion" + 1)
echo "$newversion" > .version

git add .version
git commit -m "Bump to version $newversion"
git tag "v$newversion"
git push --follow-tags
