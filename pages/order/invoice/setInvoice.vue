<template>
  <u-popup closeable border-radius="28" @close="close" mode="bottom" height="80%" v-model="show">

    <div class="wrapper">
      <!-- Invoice type -->
      <div class="invoice-title">Invoice type</div>
      <div class="flex">
        <div class="invoice-item" :class="{'active':typeItem.active,disabled:typeItem.disabled}" v-for="(typeItem,index) in invoiceType" :key="index">
          {{typeItem.title}}
        </div>
      </div>
      <div class="tips">
        {{tips}}
      </div>
      <div class="divider">
      </div>
      <!-- Invoice header -->
      <div class="invoice-title">Invoice header</div>

      <div class="flex">
        <div class="invoice-item" @click="handleClickHeader(headerItem,index,invoiceHeader)" :class="{'active':headerItem.active,disabled:headerItem.disabled}"
          v-for="(headerItem,index) in invoiceHeader" :key="index">
          {{headerItem.title}}
        </div>
      </div>
      <div>
        <div class="form-item">
          <span> {{title}}Name</span>
          <u-input :placeholder="'Please enter'+title+'name'" v-model="submitData.receiptTitle" />
        </div>
        <div class="form-item" v-if="taxpayerFlag">
          <span>Taxpayer Identification Number</span>
          <u-input placeholder="Please enter the taxpayer identification number" v-model="submitData.taxpayerId" />
        </div>

      </div>
      <div class="divider">
      </div>
      <div class="invoice-title">
        Invoice Information
      </div>
      <div class="flex">
        <div class="invoice-item" @click="handleClickHeader(goodsItem,index,goodsType)" :class="{'active':goodsItem.active,disabled:goodsItem.disabled}" v-for="(goodsItem, index) in goodsType"
          :key="index">
          {{goodsItem.title}}
        </div>
      </div>

      <div class="submit" @click="submitInvoice()">OK</div>
    </div>
  </u-popup>
</template>
<script>
import {addReceipt} from "@/api/members";
export default {
  props: ["res"],
  watch: {
    invoiceHeader: {
      handler(val) {
        this.title = val.filter((item) => {
          return item.active == true;
        })[0].title;
        this.taxpayerFlag = false;
        this.submitData.taxpayerId = "";

        if (this.title == "unit") {
          this.taxpayerFlag = true;
        }
      },
      deep: true,
    },
    goodsType: {
      handler(val) {
        this.submitData.receiptContent = val.filter((item) => {
          return item.active == true;
        })[0].title;
      },
      deep: true,
    },
  },

  data() {
    return {
      taxpayerFlag: false,
      submitData: {
        receiptTitle: "", //Invoice title
        taxpayerId: "", //Taxpayer
        receiptContent: "",
      },
      show: true,
      title: "",
      tips:
        "Electronic invoices are electronic value-added tax invoices, which are valid documents recognized by the tax bureau. Its legal effect, basic purpose and use regulations are the same as paper invoices.",
      //   invoice type
      invoiceType: [
        {
          title: "Electronic General Invoice",
          active: true,
        },
        {
          title: "Special Value Added Tax Invoice",
          active: false,
          disabled: true,
        },
      ],
      //   Invoice
      invoiceHeader: [
        {
          title: "Personal",
          active: false,
        },
        {
          title: "Unit",
          active: false,
        },
      ],
      //   Product Types
      goodsType: [
        {
          title: "Product Details",
          active: false,
        },
        {
          title: "Product Category",
          active: false,
        },
      ],
    };
  },
  mounted() {
    if (this.res) {
      this.submitData.receiptTitle = this.res.receiptTitle;
      this.submitData.taxpayerId = this.res.taxpayerId; //Taxpayer
      this.submitData.receiptContent = this.res.receiptContent;
      this.res.receiptContent == "Product Details"
        ? (this.goodsType[0].active = true)
        : (this.goodsType[1].active = true);
      this.res.taxpayerId
        ? (this.invoiceHeader[1].active = true)
        : (this.invoiceHeader[0].active = true);
    } else {
      this.invoiceHeader[0].active = true;
      this.goodsType[0].active = true;
    }

  },
  methods: {
    handleClickHeader(val, index, arr) {
      arr = arr.map((item) => {
        return (item.active = false);
      });
      val.active = true;
    },
    /**
     * Monitor off
     */
    close(val) {
      this.$emit("callbackInvoice", val);
    },
    submitInvoice() {
      /**
       * Verification
       */
      const {receiptTitle, taxpayerId, receiptContent} = this.submitData;

      if (this.$u.test.isEmpty(receiptTitle)) {
        uni.showToast({
          title: "Please fill in the invoice header!",
          duration: 2000,
          icon: "none",
        });
        return false;
      }
      if (
        !this.$u.test.isEmpty(receiptTitle) &&
        this.$u.test.isEmpty(taxpayerId) &&
        this.invoiceHeader[1].active == true
      ) {
        uni.showToast({
          title: "Please fill in the taxpayer identification number!",
          duration: 2000,
          icon: "none",
        });

        return false;
      }

      this.show = false;
      this.close(this.submitData);
    },
  },
};
</script>
<style scoped lang="scss">
.form-item {
  display: flex;
  margin: 30rpx 0;
  align-items: center;
  > span {
    margin-right: 50rpx;
  }
}
.submit {
  width: 100%;
  margin-top: 100rpx;
  background: $main-color;
  text-align: center;
  line-height: 80rpx;
  height: 80rpx;
  margin: 100rpx auto 0 auto;
  color: #f2f2f2;
  border-radius: 100px;
}
.invoice-item {
  margin-right: 30rpx;
  color: #333;
  font-weight: 24rpx;

  padding: 12rpx 46rpx;
  border-radius: 100px;
  background: #eee;
  min-width: 100rpx;
  text-align: center;
}
.active {
  font-weight: bold;
  color: $main-color;
  border: 2rpx solid $main-color;
  background: rgba($color: $main-color, $alpha: 0.1);
}
.disabled {
  color: #b5b5b6;
}
.wrapper {
  padding: 30rpx;
}
.invoice-title {
  margin-bottom: 30rpx;
  font-weight: bold;
  font-size: 30rpx;
}
.tips {
  margin-top: 30rpx;
  color: #999;
  font-size: 24rpx;
}
.divider {
  margin: 30rpx 0;
  height: 1rpx;
  border-bottom: 1px solid #f2f3f5;
}
.flex {
  display: flex;
}
</style>
