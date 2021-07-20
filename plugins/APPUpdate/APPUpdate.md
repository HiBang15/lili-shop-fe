# APP version update, mandatory update, beautiful update interface, IOS update (jump to IOS store), wgt update

### QQ exchange group (learn a lot of dry goods) 607391225

![QQ Exchange Group](http://qn.kemean.cn//upload/202004/14/15868301778472k7oubi6.png)

# [Click to jump-plugin example](https://ext.dcloud.net.cn/plugin?id=2009)

# [Click to jump-5 years of web front-end open source uni-app rapid development template-download to see the document](https://ext.dcloud.net.cn/plugin?id=2009)

### common problem

1. The app is not updated after the Android apk is downloaded?

Answer: The problem is that there is no permission to add APP to install the application. The solution is in
the `manifest.json` file in the `Android packaging permission configuration` of `APP module permission configuration`
and check the following permissions

```
<uses-permission android:name=\"android.permission.INSTALL_PACKAGES\"/>
<uses-permission android:name=\"android.permission.REQUEST_INSTALL_PACKAGES\"/>
```

If you still have problems, please
see [Solutions that cannot be executed when installing apk] (https://ask.dcloud.net.cn/article/35703 "Solutions that
cannot be executed when installing apk")

2. The version number has not changed after the APP update, or the previous version number?

Answer: It may be that the updated installation package does not have an upgraded version number. The basic settings in
the `manifest.json` file `application version number` and `application version name` need to be increased

3. The previous APP is not overwritten after the APP update?

Answer: It may be that the updated installation package `package name` is different from the APP's `package name`

### The first step is to configure the APP update interface

Configure the update interface in the `getServerNo` function method in `APPUpdate.js`

```
let httpData = {
    version:version
};
if (platform == "android") {
    httpData.type = 1101;
} else {
    httpData.type = 1102;
}
/* Interface input description
 * version: The current version number of the application (already obtained automatically)
 * type: platform (1101 is Android, 1102 is IOS)
 */
// You can use the request method of your own project
$http.get("api/kemean/aid/app_version", httpData).then(res => {
/*Interface parameter description (res data description)
* | Parameter name | Must return | Type | Description
* | -------------|--------- | --------- | ------------- |
* | versionCode | y | int | version number |
* | versionName | y | String | version name |
* | versionInfo | y | String | Version information \n New line (for example: 1. Bug1 is modified \n 2. Bug2 is modified \n 3. Bug3 is modified) |
* | forceUpdate | y | boolean | Whether to force update |
* | downloadUrl | y | String | Version download link `Please put the jump store application store link for IOS installation package update, and put the file download link for Android apk and wgt files` |
*/
   // As long as the data above the callback is ok (returning data means that the interface allows updating)
   // sample return data
   callback && callback({
versionCode: 101,
versionName: "1.0.1",
versionInfo: "1. Modified bug1 \n 2. Modified bug2 \n 3. Modified bug3",
forceUpdate: false,
downloadUrl: "http://www.xxx.com/download/123",
   });
});
```

### Step 2 How to use

```
// App.vue page

// #ifdef APP-PLUS
import APPUpdate from "@/plugins/APPUpdate";
// #endif

onLaunch: function(e) {
// #ifdef APP-PLUS
APPUpdate();
// #endif
}
```

### The third step is to add the permission to install the app

In the `manifest.json` file, the `Android packaging permission configuration` of
the `APP module permission configuration` check the following permissions

```
<uses-permission android:name=\"android.permission.INSTALL_PACKAGES\"/>
<uses-permission android:name=\"android.permission.REQUEST_INSTALL_PACKAGES\"/>
```

### Modify the theme color of the pop-up window or the pop-up window icon

Define the theme color in the `$mainColor` constant above in `APPUpdate.js`, and define the icon address in
the `$iconUrl` constant

### Check whether there is a new version of the APP (usually used in the settings page)

```
// #ifdef APP-PLUS
import APPUpdate, {getCurrentNo} from "@/plugins/APPUpdate";
// #endif
export default {
    data() {
        return {
            version: "" // version number
            };
        },
        //First load
        onLoad(e) {
            // #ifdef APP-PLUS
            getCurrentNo(res => {
                // Go to the page to get the current APP version number (used for page display)
                this.version = res.version;
            });
            // #endif
        },
        //Method
        methods: {
        // Check if there is a new version of the app
        onAPPUpdate() {
            // true prompt when there is no new version, default: false
            APPUpdate(true);
        }
    }
}
```
