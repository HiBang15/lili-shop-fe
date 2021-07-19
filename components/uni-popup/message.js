export default {
   created() {
      if (this.type === 'message') {
// Get from the component object
         this.maskShow = false;
         this.children = null;
      }
   },
   created() {
      if (this.type === 'message') {
// Do not show the mask
         this.maskShow = false;
// Get the child component object
         this.childrenMsg = null;
      }
   },
   methods: {
      customOpen() {
         if (this.childrenMsg) {
            this.childrenMsg.open();
         }
      },
      customClose() {
         if (this.childrenMsg) {
            this.childrenMsg.close();
         }
      }
   }
};
