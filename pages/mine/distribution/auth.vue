<template>
  <view class="wrapper">
    <view>
      <h4>Real-name authentication (please upload real personal information, it cannot be modified after authentication)</h4>
      <view>
        <u-form :model="ruleForm" label-width="200rpx" ref="uForm">
          <u-form-item label="name" prop="name">
            <u-input v-model="ruleForm.name" placeholder="Please enter your real name" />
          </u-form-item>
          <u-form-item label="ID" prop="idNumber">
            <u-input v-model="ruleForm.idNumber" placeholder="Please enter the ID number" />
          </u-form-item>
          <u-form-item label="Bank account opening bank" prop="settlementBankBranchName">
            <u-input v-model="ruleForm.settlementBankBranchName" type="text" placeholder="Please enter the bank opening bank" />
          </u-form-item>
          <u-form-item label="Bank account name" prop="settlementBankAccountName">
            <u-input v-model="ruleForm.settlementBankAccountName" type="text" placeholder="Please enter the bank account name" />
          </u-form-item>
          <u-form-item label="Bank account number" prop="settlementBankAccountNum">
            <u-input v-model="ruleForm.settlementBankAccountNum" type="text" placeholder="Please enter the bank account number" />
          </u-form-item>
          <!-- <u-form-item label="Front view of ID card" prop="name">
            <u-upload></u-upload>
          </u-form-item>
          <u-form-item label="Reverse photo of ID card" prop="name">
            <u-upload></u-upload>
          </u-form-item>
          <u-form-item label="Handhold ID photo" prop="name">
            <u-upload></u-upload>
          </u-form-item> -->
        </u-form>
        <u-button :customStyle="{'background':$lightColor,'color':'#fff' }" @click="submit">Submit</u-button>
      </view>
    </view>

    <view class="tips">
      <view>The information you submitted is under review</view>
      <view>After submitting the certification application, the staff will check and complete the review within three working days</view>
    </view>
  </view>
</template>
<script>
import {applyDistribution} from "@/api/goods";
import {checkBankno} from "@/utils/Foundation";
export default {
  data() {
    return {
      ruleForm: {
        name: "",
        idNumber: "",
        settlementBankBranchName: "", // bank account opening bank
        settlementBankAccountName: "", //Bank account name
        settlementBankAccountNum: "", //Bank account number
      },
      rules: {
        name: [
          {
            required: true,
            message: "Please enter your name",
            // You can write two trigger verification methods individually or at the same time
            trigger: "blur",
          },
          {
            // Custom verification function, see above
            validator: (rule, value, callback) => {
              // As mentioned above, returning true means the verification passed, and false means failing
              // this.$u.test.mobile() returns true or false
              return this.$u.test.chinese(value);
            },
            message: "Name input is incorrect",
            // Triggers can use blur and change at the same time
            trigger: ["change", "blur"],
          },
        ],
        // Bank Account Bank
        settlementBankBranchName: [
          {
            required: true,
            message: "Bank Account Opening Bank",
            // You can write two trigger verification methods individually or at the same time
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              // As mentioned above, returning true means the verification passed, and false means failing
              // this.$u.test.mobile() returns true or false
              return this.$u.test.chinese(value);
            },
            message: "The bank account bank is incorrect",
            // Triggers can use blur and change at the same time
            trigger: ["change", "blur"],
          },
        ], //Bank account name
        settlementBankAccountName: [
          {
            required: true,
            message: "Bank Account Name",
            // You can write two trigger verification methods individually or at the same time
            trigger: "blur",
          },
        ],
        //Bank Account
        settlementBankAccountNum: [
          {
            required: true,
            message: "Bank account number is incorrect",
            // You can write two trigger verification methods individually or at the same time
            trigger: "blur",
          },
          {
            validator: (rule, value, callback) => {
              // As mentioned above, returning true means the verification passed, and false means failing
              // this.$u.test.mobile() returns true or false
              return checkBankno(value);
            },
            message: "Bank account number is incorrect",
          },
        ],
        idNumber: [
          {
            required: true,
            message: "Please enter your ID card",
            // You can write two trigger verification methods individually or at the same time
            trigger: "blur",
          },
          {
            // Custom verification function, see above
            validator: (rule, value, callback) => {
              // As mentioned above, returning true means the verification passed, and false means failing
              // this.$u.test.mobile() returns true or false
              return this.$u.test.idCard(value);
            },
            message: "The ID number is incorrect",
            // Triggers can use blur and change at the same time
            trigger: ["change", "blur"],
          },
        ],
      },
    };
  },
  methods: {
    submit() {
      this.$refs.uForm.validate((valid) => {
        if (valid) {
          applyDistribution(this.ruleForm).then((res) => {
            if (res.data.success) {
              uni.showToast({
                title: "Authentication submission is successful!",
                duration: 2000,
                icon: "none",
              });

              setTimeout(() => {
                uni.navigateBack();
              }, 500);
            } else {
              uni.showToast({
                title: res.data.message,
                duration: 2000,
                icon: "none",
              });
            }
          });
        } else {
          uni.showToast({
            title: "Please fill in valid information",
            duration: 2000,
            icon: "none",
          });
        }
      });
    },
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  },
};
</script>
<style lang="scss" scoped>
.wrapper {
  padding: 32rpx;
}
.tips {
  margin-top: 20rpx;
  font-size: 24rpx;
  color: #999;
}
</style>
