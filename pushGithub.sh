echo'start pushing github'
echo'Switch git address'
git remote rm origin

git remote add origin git@github.com:hongyehuicheng/lilishop-uniapp.git
echo'Set upload code branch, push github'
git push --set-upstream origin master --force
echo'Push github completed'
git remote rm origin

git remote add origin git@gitee.com:beijing_hongye_huicheng/lilishop-uniapp.git

git pull origin master

echo'cut back to gitee resource'
git branch --set-upstream-to=origin/master master
echo'Set up git tracking resources'
