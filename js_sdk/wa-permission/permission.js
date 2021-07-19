/**
 * This module encapsulates the application permission judgment of Android and iOS, opens the application permission setting interface, and whether the location system service is enabled
 * https://ext.dcloud.net.cn/plugin?id=594
 */

var isIos;
// #ifdef APP-PLUS
isIos = (plus.os.name == 'iOS');
// #endif

// Determine whether the push permission is enabled
function judgeIosPermissionPush() {
   var result = false;
   var UIApplication = plus.ios.import('UIApplication');
   var app = UIApplication.sharedApplication();
   var enabledTypes = 0;
   if (app.currentUserNotificationSettings) {
      var settings = app.currentUserNotificationSettings();
      enabledTypes = settings.plusGetAttribute('types');
      console.log('enabledTypes1:' + enabledTypes);
      if (enabledTypes == 0) {
         console.log('Push permission is not enabled');
      } else {
         result = true;
         console.log('Push function has been turned on!');
      }
      plus.ios.deleteObject(settings);
   } else {
      enabledTypes = app.enabledRemoteNotificationTypes();
      if (enabledTypes == 0) {
         console.log('Push permission is not enabled!');
      } else {
         result = true;
         console.log('Push function has been turned on!');
      }
      console.log('enabledTypes2:' + enabledTypes);
   }
   plus.ios.deleteObject(app);
   plus.ios.deleteObject(UIApplication);
   return result;
}

// Determine whether the positioning permission is enabled
function judgeIosPermissionLocation() {
   var result = false;
   var cllocationManger = plus.ios.import('CLLocationManager');
   var status = cllocationManger.authorizationStatus();
   result = (status != 2);
   console.log('Locating permission on:' + result);
// The following code determines whether the positioning of the mobile device is turned off, and it is recommended to use another method checkSystemEnableLocation
   /* var enable = cllocationManger.locationServicesEnabled();
   var status = cllocationManger.authorizationStatus();
   console.log("enable:" + enable);
   console.log("status:" + status);
   if (enable && status != 2) {
   result = true;
   console.log("Mobile location service has been turned on and the location permission has been granted");
   } else {
   console.log("The positioning of the mobile phone system is not opened or the positioning permission is not given");
   } */
   plus.ios.deleteObject(cllocationManger);
   return result;
}

// Determine whether the microphone permission is turned on
function judgeIosPermissionRecord() {
   var result = false;
   var avaudiosession = plus.ios.import('AVAudioSession');
   var avaudio = avaudiosession.sharedInstance();
   var permissionStatus = avaudio.recordPermission();
   console.log('permissionStatus:' + permissionStatus);
   if (permissionStatus == 1684369017 || permissionStatus == 1970168948) {
      console.log('Microphone permission is not turned on');
   } else {
      result = true;
      console.log('Microphone permission has been turned on');
   }
   plus.ios.deleteObject(avaudiosession);
   return result;
}

// Determine whether the camera permission is turned on
function judgeIosPermissionCamera() {
   var result = false;
   var AVCaptureDevice = plus.ios.import('AVCaptureDevice');
   var authStatus = AVCaptureDevice.authorizationStatusForMediaType('vide');
   console.log('authStatus:' + authStatus);
   if (authStatus == 3) {
      result = true;
      console.log('Camera permission has been turned on');
   } else {
      console.log('Camera permission is not turned on');
   }
   plus.ios.deleteObject(AVCaptureDevice);
   return result;
}

// Determine whether the album permissions are turned on
function judgeIosPermissionPhotoLibrary() {
   var result = false;
   var PHPhotoLibrary = plus.ios.import('PHPhotoLibrary');
   var authStatus = PHPhotoLibrary.authorizationStatus();
   console.log('authStatus:' + authStatus);
   if (authStatus == 3) {
      result = true;
      console.log('Album permission has been turned on');
   } else {
      console.log('Album permission is not turned on');
   }
   plus.ios.deleteObject(PHPhotoLibrary);
   return result;
}

// Determine whether the address book permission is enabled
function judgeIosPermissionContact() {
   var result = false;
   var CNContactStore = plus.ios.import('CNContactStore');
   var cnAuthStatus = CNContactStore.authorizationStatusForEntityType(0);
   if (cnAuthStatus == 3) {
      result = true;
      console.log('The address book permission has been opened');
   } else {
      console.log('The address book permission is not turned on');
   }
   plus.ios.deleteObject(CNContactStore);
   return result;
}

// Determine whether the calendar permission is enabled
function judgeIosPermissionCalendar() {
   var result = false;
   var EKEventStore = plus.ios.import('EKEventStore');
   var ekAuthStatus = EKEventStore.authorizationStatusForEntityType(0);
   if (ekAuthStatus == 3) {
      result = true;
      console.log('Calendar permission has been turned on');
   } else {
      console.log('Calendar permission is not enabled');
   }
   plus.ios.deleteObject(EKEventStore);
   return result;
}

// Determine whether the memo permission is enabled
function judgeIosPermissionMemo() {
   var result = false;
   var EKEventStore = plus.ios.import('EKEventStore');
   var ekAuthStatus = EKEventStore.authorizationStatusForEntityType(1);
   if (ekAuthStatus == 3) {
      result = true;
      console.log('The permission of the memo has been opened');
   } else {
      console.log('The memo permission is not enabled');
   }
   plus.ios.deleteObject(EKEventStore);
   return result;
}

// Android permission query
function requestAndroidPermission(permissionID) {
   return new Promise((resolve, reject) => {
      plus.android.requestPermissions(
         [permissionID], // Theoretically support multiple permissions to query at the same time, but in fact, this function package only handles the case of one permission. Self-expandable package if needed
         function (resultObj) {
            var result = 0;
            for (var i = 0; i <resultObj.granted.length; i++) {
               var grantedPermission = resultObj.granted[i];
               console.log('Acquired permission:' + grantedPermission);
               result = 1;
            }
            for (var i = 0; i <resultObj.deniedPresent.length; i++) {
               var deniedPresentPermission = resultObj.deniedPresent[i];
               console.log('Reject the permission of this application:' + deniedPresentPermission);
               result = 0;
            }
            for (var i = 0; i <resultObj.deniedAlways.length; i++) {
               var deniedAlwaysPermission = resultObj.deniedAlways[i];
               console.log('Permanent denied permission:' + deniedAlwaysPermission);
               result = -1;
            }
            resolve(result);
            // If the required permission is denied, open the APP setting interface, and you can open the corresponding permission in the APP setting interface
            // if (result != 1) {
            // gotoAppPermissionSetting()
            //}
         },
         function (error) {
            console.log('Application permission error:' + error.code + '=' + error.message);
            resolve({
               code: error.code,
               message: error.message
            });
         }
      );
   });
}

// Use a method to determine permissions based on parameters
function judgeIosPermission(permissionID) {
   if (permissionID =='location') {
      return judgeIosPermissionLocation();
   } else if (permissionID =='camera') {
      return judgeIosPermissionCamera();
   } else if (permissionID =='photoLibrary') {
      return judgeIosPermissionPhotoLibrary();
   } else if (permissionID =='record') {
      return judgeIosPermissionRecord();
   } else if (permissionID =='push') {
      return judgeIosPermissionPush();
   } else if (permissionID =='contact') {
      return judgeIosPermissionContact();
   } else if (permissionID =='calendar') {
      return judgeIosPermissionCalendar();
   } else if (permissionID =='memo') {
      return judgeIosPermissionMemo();
   }
   return false;
}

// Jump to the permission page of **application**
function gotoAppPermissionSetting() {
   if (isIos) {
      var UIApplication = plus.ios.import('UIApplication');
      var application2 = UIApplication.sharedApplication();
      var NSURL2 = plus.ios.import('NSURL');
      // var setting2 = NSURL2.URLWithString("prefs:root=LOCATION_SERVICES");
      var setting2 = NSURL2.URLWithString('app-settings:');
      application2.openURL(setting2);

      plus.ios.deleteObject(setting2);
      plus.ios.deleteObject(NSURL2);
      plus.ios.deleteObject(application2);
   } else {
      // console.log(plus.device.vendor);
      var Intent = plus.android.importClass('android.content.Intent');
      var Settings = plus.android.importClass('android.provider.Settings');
      var Uri = plus.android.importClass('android.net.Uri');
      var mainActivity = plus.android.runtimeMainActivity();
      var intent = new Intent();
      intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
      var uri = Uri.fromParts('package', mainActivity.getPackageName(), null);
      intent.setData(uri);
      mainActivity.startActivity(intent);
   }
}

// Check whether the device service of the system is turned on
// var checkSystemEnableLocation = async function () {
function checkSystemEnableLocation() {
   if (isIos) {
      var result = false;
      var cllocationManger = plus.ios.import('CLLocationManager');
      var result = cllocationManger.locationServicesEnabled();
      console.log('系统定位开启:' + result);
      plus.ios.deleteObject(cllocationManger);
      return result;
   } else {
      var context = plus.android.importClass('android.content.Context');
      var locationManager = plus.android.importClass('android.location.LocationManager');
      var main = plus.android.runtimeMainActivity();
      var mainSvr = main.getSystemService(context.LOCATION_SERVICE);
      var result = mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER);
      console.log('系统定位开启:' + result);
      return result;
   }
}

module.exports = {
   judgeIosPermission: judgeIosPermission,
   requestAndroidPermission: requestAndroidPermission,
   checkSystemEnableLocation: checkSystemEnableLocation,
   gotoAppPermissionSetting: gotoAppPermissionSetting
};
