<template>
  <div class="wrapper">
    <div v-html="res.content"></div>

  </div>
</template>
<script>
import {getArticleDetail} from "@/api/article";
export default {
  data() {
    return {
      res: "",
      way: {
        user: {
          title: "User Agreement",
          type: "USER_AGREEMENT",
        },
        privacy: {
          title: "Privacy Policy",
          type: "PRIVACY_POLICY",
        },
        message: {
          title: "Certificate Information",
          type: "LICENSE_INFORMATION",
        },
        about: {
          title: "About Us",
          type: "ABOUT",
        },
      },
    };
  },
  mounted() {},
  onLoad(option) {
    uni.setNavigationBarTitle({
      title: this.way[option.type].title,
    });
    this.init(option);
  },

  methods: {
    init(option) {
      getArticleDetail(this.way[option.type].type).then((res) => {
        if (res.data.success) {
          this.res = res.data.result;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.wrapper {
  padding: 16rpx;
}
</style>
