<template>
  <!-- This file path is forbidden to move -->
  <view>
    <view class="container ">
      <view class="u-skeleton" v-if="!articleData">
          <u-empty text="No content in this article" mode="list"></u-empty>
      </view>
      <u-parse v-else :html="articleData"></u-parse>
    </view>
  </view>
</template>

<script>
import {getArticleDetail} from "@/api/article.js";
export default {
  data() {
    return {
      // Used to receive the data transmitted by the upper level through the path
      routers: "",
      // Store the article information after requesting the article interface
      articleData: "",
    };
  },
  onLoad(val) {
    this.routers = val;
    getArticleDetail(val.id).then((res) => {
      if (res.data.result) {
        // Assign the requested article data
        this.articleData = res.data.result.content;
      }
      // Modify the current NavigationBar (title header) as the head of the article
      uni.setNavigationBarTitle({
        title: val.title,
      });
    });
  },
};
</script>
<style lang="scss" scoped>
page {
  background: #fff;
}
.container {
  padding: 32rpx;
  > p {
    margin: 20rpx;
  }
}
</style>
