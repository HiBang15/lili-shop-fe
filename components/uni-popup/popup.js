import message from './message.js';
// Define type type: pop-up type: top/bottom/center
const config = {
   // pop up at the top
   top: 'top',
   // Pop up at the bottom
   bottom: 'bottom',
   // Center popup
   center: 'center',
   // notification
   message: 'top',
   // Dialog
   dialog: 'center',
   // share it
   share: 'bottom'
};
export default {
   data() {
      return {
         config: config
      };
   },
   mixins: [message]
};
