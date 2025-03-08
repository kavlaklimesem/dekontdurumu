@echo off
echo Degisiklikler GitHub'a gonderiliyor...
git add .
git commit -m "Uygulamaya yapilan degisiklikler"
git push origin gh-pages
echo Islem tamamlandi!
pause 