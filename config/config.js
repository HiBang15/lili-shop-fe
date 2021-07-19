const name = "lilishop";
export default {
   name: name,
   schemeLink: `${name}://`, //call the app address
   downloadLink: "https://pickmall.cn/download-page/index.html", //download address, download app address
   shareLink: "https://m-b2b2c.pickmall.cn", //Share address, which is the default copy address in h5
   appid: "wx6f10f29075dc1b0b", //The only credential of the applet, that is, the AppID, can be obtained on the "WeChat Public Platform-Settings-Development Settings" page. (Need to have become a developer, and the account has no abnormal status)
   appSecret: "6dfbe0c72380dce5d49d65b3c91059b1", //Can be viewed in manifest.json
   aMapKey: "d649892b3937a5ad20b76dacb2bcb5bd", //Apply for web key in Gaode
   scanAuthNavigation:['https://m-b2b2c.pickmall.cn/'], //Scan code authentication redirect domain name configuration will be redirected according to the route configured here
   iosAppId:"id1564638363", //AppStore's application address id can be viewed in the share->copy link
   logo:"https://lilishop-oss.oss-cn-beijing.aliyuncs.com/4c864e133c2944efad1f7282ac8a3b9e.png" //logo address
};
