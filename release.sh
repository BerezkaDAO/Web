RELEASE_VERSION=$1

git checkout -b release/$RELEASE_VERSION
sh build-docker.sh
if [ $? -eq 0 ]
then
  git tag -a v$RELEASE_VERSION -m 'Release v. $RELEASE_VERSION'
  git push origin v$RELEASE_VERSION
  git push -u origin release/$RELEASE_VERSION
  sh publish-docker-prom.sh
  git checkout master
  git merge release/$RELEASE_VERSION
  git checkout release/$RELEASE_VERSION
else
  echo "Could not build docker" >&2
fi
git checkout develop
