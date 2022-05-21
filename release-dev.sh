RELEASE_VERSION=$1b

git checkout -b dev-release/$RELEASE_VERSION

git tag -a v$RELEASE_VERSION -m 'Release v. $RELEASE_VERSION'
git push origin v$RELEASE_VERSION
git push -u origin dev-release/$RELEASE_VERSION

# git checkout master
# git merge release/$RELEASE_VERSION
# git checkout release/$RELEASE_VERSION

git checkout develop
