#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run docs

# navigate into the build output directory
cd www

# TODO: CNAME HERE
echo 'flipnote.js.org' > CNAME

# push to gh-pages branch
git init
git add -A
git commit -m 'deploy github pages'
git push -f git@github.com:jaames/flipnote.js.git master:gh-pages

cd -