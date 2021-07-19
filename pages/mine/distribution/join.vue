<template>
  <view class="wrapper">
    <u-tabs
      :list="list"
      :is-scroll="false"
      :current="current"
      @change="change"
      :active-color="$lightColor"
    ></u-tabs>



    <!-- Promoter Information -->
    <view class="message">
      <u-form :model="ruleForm" label-width="250rpx" ref="uForm">
        <u-form-item label="member nickname" prop="name">
          <u-input v-model="ruleForm.name" />
        </u-form-item>
        <u-form-item label="account type" prop="name"> </u-form-item>
        <u-form-item
          label="Payee Name"
          placeholder="Please enter the payee name"
          prop="name"
        >
          <u-input v-model="ruleForm.name" />
        </u-form-item>
        <u-form-item
          label="Receiving account number"
          placeholder="Please enter the payee account number"
          prop="name"
        >
          <u-input v-model="ruleForm.name" />
        </u-form-item>
        <u-form-item
          label="Bank name"
          placeholder="Please enter the name of the bank branch where the account is opened"
          prop="name"
        >
          <u-input v-model="ruleForm.name" />
        </u-form-item>
      </u-form>
      <u-button :customStyle="{'background':$lightColor,'color':'#fff' }" @click="submit">Submit</u-button>
    </view>
  </view>
</template>
<script>
export default {
  components: {},
  // Must be in the onReady life cycle, because the onLoad life cycle component may not be created yet
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  },
  data() {
    return {
      current:0,
      list: [
        {
          name: "Promoter Information",
        },
        {
          name: "Platform Audit",
        },
        {
          name: "Done",
        },
      ],
      ruleForm: {
        name: "",
        radio: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "Please enter your name",
            // You can write two trigger verification methods individually or at the same time
            trigger: "blur",
          },
        ],
      },
    };
  },
};
</script>
<style lang="scss" scoped>
.menu {
  height: 88rpx;
  line-height: 88rpx;
  background: $main-color;
  display: flex;
  > .menu-item {
    flex: 1;
    text-align: center;
    color: $light-color;
  }
}
.active {
  color: #fff !important;
}
.message {
  padding: 0 32rpx;
}
</style>
