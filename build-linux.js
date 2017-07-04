const packager = require("electron-packager");
const package = require("./plato/package.json");

lang = "en";
if(process.argv.length >= 3) {
    lang = process.argv[2];
    if(lang != "en" && lang != "ja") {
        console.log("Language ID error\nUsage: node " + process.argv[1] + " <en|ja>");
        process.exit(1);
    }
}
// console.log("lang=" + lang);

packager({
    name: package["name"],
    dir: "./",// ソースフォルダのパス
    out: "../bin/" + lang,// 出力先フォルダのパス
    icon: "./images/icon.icns",// アイコンのパス
    platform: "linux",
    arch: "ia32",
    version: "1.4.2",// Electronのバージョン
    overwrite: true,// 上書き
    asar: false,// asarパッケージ化
    prune: false,
    "app-version": package["version"],// アプリバージョン
    "app-copyright": "Copyright (C) 2017 "+package["author"]+".",// コピーライト
    
}, function (err, appPaths) {// 完了時のコールバック
    if (err) console.log(err);
    console.log("Done: " + appPaths);
});

packager({
    name: package["name"],
    dir: "./",// ソースフォルダのパス
    out: "../bin/" + lang,// 出力先フォルダのパス
    icon: "./images/icon.icns",// アイコンのパス
    platform: "linux",
    arch: "x64",
    version: "1.4.2",// Electronのバージョン
    overwrite: true,// 上書き
    asar: false,// asarパッケージ化
    prune: false,
    "app-version": package["version"],// アプリバージョン
    "app-copyright": "Copyright (C) 2017 "+package["author"]+".",// コピーライト
    
}, function (err, appPaths) {// 完了時のコールバック
    if (err) console.log(err);
    console.log("Done: " + appPaths);
});
