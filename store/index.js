import Vue from 'vue';
import Vuex from 'vuex';
import storage from '@/utils/storage';

Vue.use(Vuex);

const store = new Vuex.Store({
   state: {
      verificationKey: '', //Get the key to indicate that the verification is passed
      distributionId: '', //Distributor Id If the current account has never been logged in, the record is out of date
      hasLogin: storage.getHasLogin(),
      userInfo: storage.getUserInfo(),
      uuid: storage.getUuid(),
      token: ''
   },
   mutations: {
      login(state, userInfo) {
         state.userInfo = userInfo || {};
         state.userName =
            userInfo.Name || userInfo.Nickname || userInfo.Username || 'Anonymous User';
         state.hasLogin = true;
      },
      logout(state) {
         state.userName = '';
         state.hasLogin = false;
      }
   },
   actions: {}
});

export default store;
