export function h5Copy(content) {

   if (!document.queryCommandSupported('copy')) {
      // not support
      return false;
   }

   let textarea = document.createElement('textarea');
   textarea.value = content;
   textarea.readOnly = 'readOnly';
   document.body.appendChild(textarea);
   textarea.select(); // select object
   textarea.setSelectionRange(0, content.length); //Core
   let result = document.execCommand('copy'); // execute browser copy command
   textarea.remove();
   return result;

}


/**
 * Get the contents of the system clipboard
 */
export function getClipboardData() {
   return new Promise((success, fail) => {
      // #ifndef H5
      uni.getClipboardData({
         success: ({data}) => success(data),
         fail
      });
      // #endif

      // #ifdef H5
      try {
         navigator.clipboard.readText().then(success).catch(fail);
      } catch (error) {
         fail(error);
      }
      // #endif
   });
}
