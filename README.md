# Siv-nt
Simple image viewer - nextron



# Features

- supported image type: jpg, png, gif, webp, avif
- execute view image in image file association
- Show image in drop image file to window
- show image information (file path, file size, image size(w x h))
- toggle visibility to file info bar on click
- change zoom level when mouse wheel (min 10% - max 1000%)
- switch the image size between original size and window size by holding down the mouse right button and left clicking
- move image position when mouse left button dragging
- move first position to image when mouse left button double click

- output log data to file (%APPDATA%/Roaming/Siv-nt/(date)-main.log)
- log file auto remove (max 512 files or 1 month)



# 機能

- 対応する画像の種類: jpg、png、gif、webp、avif
- 画像ファイルの関連付けから画像を表示して起動
- ウィンドウに画像ファイルをドロップして画像を表示
- 画像の情報の表示（ファイルパス、ファイルサイズ、画像サイズ（縦横））
- クリックで画像情報表示バーの表示/非表示を切り替え
- ホイール上下でズームレベルを変更（最小10％～最大1000％）
- マウス右ボタンを押しながら左クリックで画像のサイズを原寸とウィンドウサイズで切り替え
- マウス左ボタンのドラッグで画像を移動
- マウス左ボタンのダブルクリックで画像を初期位置に移動

- ログデータをファイルに出力（%APPDATA%/Roaming/Siv-nt/logs/(日付)-main.log）
- ログファイルの自動削除（512件または一ヶ月）



# Release Plan

- [ ] v0.9.0 support audio file
- [ ] v0.8.0 support movie file
- [ ] v0.7.0 change next or prev file in same directory
- [x] v0.6.0 zoom in out, move zoom in image  
- [x] v0.5.0 toggle file info bar on click  
- [x] v0.4.0 open image from file association
- [x] v0.3.1 add logger for main process in build application  
- [x] v0.3.0 view image size  
- [x] v0.2.0 view file path, file size  
- [x] v0.1.0 show image  

If I feel like it
- [ ] v?.?.? auto release in GitHub Actions
- [ ] v?.?.? multilingual (jp, en)
- [ ] v?.?.? auto updater
- [ ] v?.?.? signing application
- [ ] v?.?.? select output log level for prod 
- [ ] v?.?.? custom theme


