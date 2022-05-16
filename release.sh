RELEASE_VERSION=$1

git checkout -b release/$RELEASE_VERSION

git tag -a v$RELEASE_VERSION -m 'Release v. $RELEASE_VERSION'
git push origin v$RELEASE_VERSION
git push -u origin release/$RELEASE_VERSION

git checkout master
git merge release/$RELEASE_VERSION
git checkout release/$RELEASE_VERSION

git checkout develop
