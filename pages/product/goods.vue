<template>
  <div class="main-page">

    <!-- #ifdef APP-PLUS -->
    <view class="status_bar"></view>
    <!-- #endif -->
    <!-- Only h5 is valid Open the App -->

    <!-- Share -->
    <shares v-if="shareFlage && goodsDetail.id" :skuId="this.routerVal.id" :goodsId="this.routerVal.goodsId"
            :link="'/pages/product/goods?id='+this .routerVal.id+'&goodsId='+this.routerVal.goodsId"
            :thumbnail="goodsDetail.thumbnail" :goodsName="goodsDetail.goodsName" type="goods"
            @close="shareFlage = false" />
    <popups v-model="popupsSwitch" @tapPopup="handleNavbarList" :popData="navbarListData" :x="navbarListX"
            :y="navbarListY" placement="top-start" />
    <view class="index">

      <!-- topBar -->
      <u-navbar :background="navbar" :is-back="false" :class="headerFlag?'header':'header bg-none scroll-hide'">
        <div class="headerRow">
          <div class="backs">
            <u-icon @click="back()" name="arrow-left" class="icon-back"></u-icon>

            <u-icon name="list" @click="popupsSwitch = !popupsSwitch" class="icon-list"></u-icon>
          </div>
          <div class="headerList" :class="headerFlag?'tab-bar':'tab-bar scroll-hide'">
            <div class="headerRow">
              <div class="nav-item" v-for="header in headerList" :key="header.id"
                   :class="{ cur: scrollId === header.id }" @click="headerTab(header. id)">
                {{ header.text }}
              </div>
            </div>
          </div>
        </div>
      </u-navbar>

      <u-navbar :border-bottom="false" v-show="!headerFlag" class="header-only-back" :background="navbarOnlyBack"
                :is-back="false">
        <div>
          <div class="bg-back">
            <u-icon size="40" @click="back()" name="arrow-left" class="icon-back"></u-icon>
            <u-icon size="40" @click="popupsSwitch = !popupsSwitch" name="list" class="icon-list"></u-icon>
          </div>
        </div>
      </u-navbar>
    </view>

    <view class="product-container" :style="{ height: productRefHeight }" ref="productRef" id="productRef">
      <scroll-view scroll-anchoring enableBackToTop="true" scroll-with-animation scroll-y class="scroll-page"
                   :scroll-top="tabScrollTop" @scroll="pageScroll">
        <view>
          <!-- Carousel Picture -->
          <GoodsSwiper id="main1" :res="imgList" />

          <!-- Promotional activity bar -->
          <PromotionAssembleLayout v-if="PromotionList" :detail="goodsDetail" :res="PromotionList" />

          <view class="card-box top-radius-0" id="main2">
            <!-- Activity does not display the price -->
            <view v-if="!isPromotion" class="desc-bold -goods-msg">
              <view class="-goods-flex">
                <view class="desc-bold">
                  {{ goodsDetail.goodsName || '' }}
                </view>
                <view class="favorite" @click="clickFavorite(goodsDetail.id)">
                  <u-icon size="30" :color="favorite?'#f2270c':'#262626'"
                          :name="favorite?'heart-fill':'heart'"></u-icon>
                  <view :style="{ color: favorite?'#f2270c':'#262626' }">{{ favorite ? 'Favorite' : 'Favorite' }}</view>
                </view>
              </view>

              <!-- Product description -->
              <view class="-goods-desc">
                {{ goodsDetail.sellingPoint || '' }}
              </view>
            </view>
            <view v-else class="-goods-msg">
              <!-- When there is no group join, spike and other activities -->
              <view>
                <view class="-goods-flex">
                  <!-- If there are points, display points -->
                  <view class="-goods-price" v-if="goodsDetail.price != undefined">
                    <span v-if="pointDetail.points"> <span class="price">{{ pointDetail.points }}</span>
                      <span>Points</span>
                    </span>

                    <span v-else> <span>¥</span><span class="price">{{ formatPrice(goodsDetail.price)[0] }}</span>.{{
                        formatPrice(goodsDetail.price)[1]
                      }} </span>
                  </view>
                  <view class="-goods-price" v-else> ¥<span class="price">0 </span>.00</view>

                  <view class="icons share" @click="shareChange()">
                    <u-icon size="30" name="share-fill"></u-icon>
                    <view>Share</view>
                  </view>
                  <view class="icons" @click="clickFavorite(goodsDetail.id)">
                    <u-icon size="30" :color="favorite?'#f2270c':'#262626'"
                            :name="favorite?'heart-fill':'heart'"></u-icon>
                    <view :style="{ color: favorite?'#f2270c':'#262626' }">{{
                        favorite ? 'Favorite' : 'Favorite'
                      }}
                    </view>
                  </view>
                </view>
                <view class="-goods-name desc-bold">
                  {{ goodsDetail.goodsName || '' }}
                </view>
                <view class="-goods-desc">
                  {{ goodsDetail.sellingPoint || '' }}
                </view>
              </view>
            </view>
          </view>

          <view class="card-box">
            <view class="card-flex" @click="shutMask(1)">
              <view class="card-title"> Promotion</view>
              <view class="card-content">
                <span v-if="PromotionList && emptyPromotion()">No promotion information yet</span>
                <PromotionLayout v-else @shutMasks="shutMask" :res="PromotionList" />
              </view>
              <view class="card-bottom">
                <u-icon name="more-dot-fill"></u-icon>
              </view>
            </view>
          </view>

          <!-- Join group user list -->
          <PromotionAssembleListLayout v-if="isGroup" @to-assemble-buy-now="toAssembleBuyNow" :res="PromotionList" />

          <!-- Configuration address If it is a virtual product, it will not be displayed -->
          <view class="card-box" v-if="goodsDetail.goodsType !='VIRTUAL_GOODS'">
            <view class="card-flex" @click="shutMask(4)">
              <view class="card-title"> selected</view>
              <view class="card-content">
                <span v-if="selectedGoods.spec">{{ selectedGoods.spec.specName }}-{{
                    selectedGoods.spec.specValue
                  }}</span>
                <span v-else>default</span>
              </view>
              <view class="card-bottom">
                <u-icon name="more-dot-fill"></u-icon>
              </view>
            </view>
            <view class="card-flex" @click="shutMask(3)">
              <view class="card-title"> Send to</view>
              <view class="card-content">
                <span v-if="delivery">{{
                    delivery.consigneeAddressPath | clearStrComma
                  }}</span>
                <span v-else>No address information yet</span>
              </view>
              <view class="card-bottom">
                <u-icon name="more-dot-fill"></u-icon>
              </view>
            </view>
          </view>

          <!-- Evaluation -->
          <Evaluation id="main5" :goodsDetail="goodsDetail" />

          <!-- Shop recommendation -->
          <storeLayout id="main7" :storeDetail="storeDetail" :goodsDetail="goodsDetail" :res="recommendList" />

          <!-- Baby details -->
          <GoodsIntro id="main9" :res="goodsDetail" :goodsParams="goodsParams" :goodsId="goodsDetail.goodsId"
                      v-if="goodsDetail.id" />

          <!-- Baby recommendation -->
          <GoodsRecommend id="main11" :res="likeGoodsList" />
        </view>
      </scroll-view>

      <view class="page-bottom mp-iphonex-bottom" id="pageBottom">
        <view class="icon-btn">
          <view class="icon-btn-item" @click="navigateToStore(goodsDetail.storeId)">
            <u-icon size="34" class="red" name="home-fill"></u-icon>
            <view class="red icon-btn-name">Shop</view>
          </view>
          <view class="icon-btn-item" @click="linkMsgDetail()">
            <u-icon size="34" name="kefu-ermai"></u-icon>
            <view class="icon-btn-name">Customer Service</view>
          </view>
          <view class="icon-btn-item" @click="reluchToCart()">
            <u-icon size="34" name="storeping-cart"></u-icon>
            <view class="icon-btn-name">Shopping cart</view>
            <view v-if="nums && nums> 0" class="num-icon">{{ nums }}</view>
          </view>
        </view>
        <!-- Normal settlement page -->
        <view class="detail-btn" v-if="!isGroup">
          <view class="to-store-car to-store-btn" v-if="goodsDetail.goodsType!='VIRTUAL_GOODS'" @click="shutMask(4)">
            add to Shopping Cart
          </view>
          <view class="to-buy to-store-btn" @click="shutMask(4,'buy')">Buy now</view>
          <view class="to-store-car to-store-btn" v-if="startTimer">Not yet started</view>
        </view>
        <!-- Join group settlement -->
        <view class="detail-btn" v-else>
          <view class="to-store-car pt-buy to-store-btn" @click="shutMask(4,'buy')">
            <view>￥{{ goodsDetail.price | unitPrice }}</view>
            <view>Buy separately</view>
          </view>
          <view class="to-buy pt-buy to-store-btn" @click="toAssembleBuyNow">
            <view>￥{{ goodsDetail.promotionPrice | unitPrice }}</view>
            <view>Join group price</view>
          </view>
        </view>
      </view>
      <!-- Specifications-Modal layer pop-up window -->
      <view class="popup spec" @click="shutMask(false)" v-show="maskFlag">
        <!-- Promotional pop-up window -->
        <view class="cuxiao mask" v-show="cuxiao">
          <view ref="mask_title" class="title mask_title">
            Discount
            <span @click="shutMask(false)">×</span>
          </view>
          <scroll-view class="scroll_mask" :scroll-y="true">
            <view class="con-cuxiao">
              <text>Promotions</text>
              <PromotionDetailsLayout :res="PromotionList" />
            </view>
            <view class="con-cuxiao coupons">
              <text>Coupon available</text>
              <PromotionCoupon @getCoupon="getCoupon" :res="PromotionList" />
            </view>
          </scroll-view>
        </view>

        <!-- Delivery address pop-up window -->
        <popupAddress @closeAddress="closePopupAddress" @deliveryData="deliveryFun" v-if="goodsDetail.id"
                      :goodsId="goodsDetail.id" :addressFlag="addressFlag" />

        <!-- Product specifications, product details, and id of the default participation activity-->
        <popupGoods :addr="delivery" ref="popupGoods" @changed="changedGoods" @closeBuy="closePopupBuy"
                    @queryCart="cartCount()" :goodsDetail="goodsDetail" :goodsSpec="goodsSpec" :id="productId"
                    v-if="goodsDetail.id " :pointDetail="pointDetail" @handleClickSku="selectSku" :buyMask="buyMask" />
      </view>
    </view>
  </div>
</template>

<script>
/************Interface API***************/
import {
  getGoods,
  getGoodsList,
  getMpScene,
  getGoodsDistribution
} from '@/api/goods.js';
import * as API_trade from '@/api/trade.js';
import * as API_Members from '@/api/members.js';
import * as API_store from '@/api/store.js';
import { modelNavigateTo } from '@/pages/tabbar/home/template/tpl.js';
/************Request storage***************/
import storage from '@/utils/storage.js';

/************Component***************/
import PromotionLayout from './product/promotion/-promotion'; //Promotion component
import PromotionDetailsLayout from './product/promotion/-promotion-details'; //Promotion details
import PromotionAssembleLayout from './product/promotion/-promotion-assemble-promotions'; //Promotions
import PromotionAssembleListLayout from './product/promotion/-promotion-assemble-list'; //Assemble user list
import PromotionCoupon from './product/promotion/-promotion-coupon'; //Coupon component
import GoodsIntro from './product/goods/-goods-intro'; //Product introduction component
import GoodsRecommend from './product/goods/-goods-recommend'; //Baby recommendation
import storeLayout from './product/shop/-shop'; //Shop component
import Evaluation from './product/evaluation/-evaluation'; //Evaluation component
import GoodsSwiper from './product/goods/-goods-swiper'; //Carousel diagram component
import popupGoods from './product/popup/goods'; //Module of shopping cart goods
import popupAddress from './product/popup/address'; //Address selection module
import shares from '@/components/m-share/index'; //Share
import popups from '@/components/popups/popups'; //bubble box
export default {
  components: {
    popups,
    shares,
    PromotionLayout,
    PromotionDetailsLayout,
    PromotionAssembleLayout,
    PromotionAssembleListLayout,
    PromotionCoupon,
    GoodsIntro,
    GoodsRecommend,
    storeLayout,
    Evaluation,
    GoodsSwiper,
    popupGoods,
    popupAddress
  },
  data() {
    return {
      // #ifdef H5
      navbarListX: 110, //x axis of navigation bar list bar
      navbarListY: 80, //Navbar list bar y axis
      // #endif
      // #ifdef MP-WEIXIN
      navbarListX: 100, //x axis of navigation bar list bar
      navbarListY: 140, //Navbar list bar y axis
      // #endif
      // #ifdef APP-PLUS
      navbarListX: 120, //x axis of navigation bar list bar
      navbarListY: 170, //Navbar list bar y axis
      // #endif
      navbarListData: [
        //Navigation bar list column data
        {
          title: 'Home',
          icon: 'home-fill',
          ___type: 'other'
        },
        {
          title: 'Shopping Cart',
          icon: 'bag-fill',
          ___type: 'other'
        },
        {
          title: 'Search',
          icon: 'search',
          ___type: 'category'
        },
        {
          title: 'Personal Center',
          icon: 'account-fill',
          ___type: 'other'
        }
      ],
      popupsSwitch: false, //Navigation bar list bar switch
      shareFlage: false,
      selectedGoods: '', //Selected product specification nickname
      isPromotion: true, //Judgment and display the group activity text
      isGroup: false, // Is it a group activity
      pointDetail: '', // Is it a point product
      assemble: '', //The sku of the group
      navbarOnlyBack: {
        background: 'transparent'
      },
      navbar: {
        background: '#fff'
      },

      productRefHeight: '',
      header: {
        top: 0,
        height: 50
      },
      goodsParams: [], // Commodity parameters
      headerFlag: false, //Whether the top navigation is displayed or not
      headerList: [
        //The top navigation text is in accordance with the rules. Global search for details
        {
          text: 'Product',
          id: '1'
        },
        {
          text: 'evaluation',
          id: '2'
        },
        {
          text: 'Details',
          id: '3'
        },
        {
          text: 'Recommended',
          id: '4'
        }
      ],
      oldtabScrollTop: 0,
      tabScrollTop: null,
      scrollArr: [],
      scrollId: '1',

      scrollFlag: true,
      current: '1', //The currently displayed carousel page

      goodsDetail: {}, //Product data
      goodsSpec: '', //Specification data
      imgList: [], //Carousel picture data
      favorite: false, //Favorite or not flag
      recommendList: [], //Recommendation list
      maskFlag: false, //modal display or not
      cuxiao: false, //Promotional popup
      goodsInfo: false, //Product introduction pop-up window
      addressFlag: false, //shipping address pop-up window
      buyMask: false, //Add the shopping cart to buy directly, view the selected pop-up window

      num: 1, //The number added to the shopping cart

      skuId: '', //
      storeDetail: '', //Basic store information,

      // Store Information
      storeParams: {
        pageNumber: 1,
        pageSize: 10
      },

      likeGoodsList: '', //Similar goods list
      PromotionList: '', //Activities, promotions, list
      specList: [],
      skusCombination: [],
      selectedSpec: [],
      nums: 0,
      delivery: '',

      exchange: {},
      productId: 0,

      startTimer: false, //not open is false

      routerVal: ''
    };
  },
  // #ifdef MP-WEIXNI
  shareAppMessage() {
    return {
      title: this.goodsDetail.goodsName,
      type: 0,
      query: `id=${ this.routerVal.id }&goodsId=${ this.routerVal.goodsId }`,
      path: `/pages/product/goods`,
      imageUrl: this.goodsDetail.goodsGalleryList[0]
    };
  },
  // #endif
  watch: {
    isGroup(val) {
      if (val) {
        let timer = setInterval(() => {
          this.$refs.popupGoods.buyType = 'PINTUAN';
          clearInterval(timer);
        }, 100);

        this.isPromotion = false;
      } else {
        this.isPromotion = true;
        this.$refs.popupGoods.buyType = '';
      }
    }
  },
  mounted() {
    const {windowHeight} = uni.getSystemInfoSync();
    let bottomHeight = 0;
    let topHeight = 0;
    uni.getSystemInfo({
      success: function (res) {
        // res-various parameters
        let bottom = uni.createSelectorQuery().select('.page-bottom');
        bottom
            .boundingClientRect(function (data) {
              if (data && data.height) {
                //data-various parameters
                bottomHeight = data.height; // Get the element width
              }
            })
            .exec();
        let top = uni.createSelectorQuery().select('.header');
        top
            .boundingClientRect(function (data) {
              if (data && data.height) {
                //data-various parameters
                topHeight = data.height; // Get the element width
              }
            })
            .exec();
      }
    });

    this.productRefHeight = windowHeight - bottomHeight + 'px';
  },
  async onLoad(options) {
    this.routerVal = options;
    // #ifdef MP-WEIXIN
    // Mini Programs are shared by default
    uni.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    // #endif
  },
  async onShow() {
    this.goodsDetail = {};
    //If there is a parameter ids indicating that the short connection is distributed, the parameters need to be obtained
    if (this.routerVal.scene) {
      getMpScene(this.routerVal.scene).then((res) => {
        if (res.data.success) {
          let data = res.data.result.split(','); // skuId,goodsId,distributionId
          this.init(data[0], data[1], data[2]);
        }
      });
    } else {
      this.init(
          this.routerVal.id,
          this.routerVal.goodsId,
          this.routerVal.distributionId,
          this.routerVal.whetherPoint
      );
    }
  },
  methods: {
    /**
     * Navigation bar list bar
     */
    handleNavbarList(val) {
      modelNavigateTo({url: val});
    },

    /**
     * Circulate whether the current promotion is empty
     */
    emptyPromotion() {
      if (
          this.PromotionList == '' ||
          this.PromotionList == null ||
          this.PromotionList == []
      ) {
        return true;
      }
    },
    selectSku(idObj) {
      this.init(idObj.skuId, idObj.goodsId);
    },
    /**
     * Initialization information
     */
    async init(id, goodsId, distributionId) {
      console.log(id, goodsId);
      this.isGroup = false; //Initialize the group
      this.productId = id; // skuId
      // Here request to get page data parse data
      uni.showLoading({
        title: 'Loading',
        mask: true
      });

      let response = await getGoods(id, goodsId);
      if (!response.data.success) {
        uni.navigateBack();
        return false;
      }

      // Here is the binding distributor
      if (distributionId || this.$store.state.distributionId) {
        let disResult = await getGoodsDistribution(distributionId);
        if (!disResult.data.success || disResult.statusCode == 403) {
          this.$store.state.distributionId = distributionId;
        }
      }
      uni.hideLoading();
      /**Product information and specification information storage */
      this.goodsDetail = response.data.result.data;
      this.goodsSpec = response.data.result.specs;
      this.PromotionList = response.data.result.promotionMap;
      this.goodsParams = response.data.result.goodsParamsDTOList || [];

      // Determine whether to join the group activities or points products, if there is, display the information of the group activities
      this.PromotionList &&
      Object.keys(this.PromotionList).forEach((item) => {
        // Join group goods
        if (item.indexOf('PINTUAN') == 0) {
          this.isGroup = true;
        }
        // Points
        if (item.indexOf('POINTS_GOODS') == 0) {
          this.pointDetail = this.PromotionList[item];
        }
      });
      // Carousel picture
      this.imgList = this.goodsDetail.goodsGalleryList;

      // Get basic store information
      this.getstoreBaseInfoFun(this.goodsDetail.storeId);

      // Get the shopping cart
      this.cartCount();

      // Get recommended products from the store
      this.getstoreRecommend();

      // Get product list
      this.getOtherLikeGoods();
      // Get whether the product has been favorited If you are not logged in, do not get it

      if (this.$options.filters.isLogin('auth')) {
        this.getGoodsCollectionFun(this.goodsDetail.id);
      }
    },
    linkMsgDetail() {
      // customer service
      // #ifdef MP-WEIXIN

      const params = {
        storeName: this.storeDetail.storeName,
        goodsName: this.goodsDetail.goodsName,
        goodsId: this.goodsDetail.goodsId,
        goodsImg: this.goodsDetail.thumbnail,
        price: this.goodsDetail.promotionPrice || this.goodsDetail.price,
        // originalPrice: this.goodsDetail.original || this.goodsDetail.price,
        uuid: storage.getUuid(),
        token: storage.getAccessToken(),
        sign: this.storeDetail.yzfSign,
        mpSign: this.storeDetail.yzfMpSign
      };
      uni.navigateTo({
        url:
            '/pages/product/customerservice/index?params=' +
            encodeURIComponent(JSON.stringify(params))
      });
      // #endif
      // #ifndef MP-WEIXIN
      const sign = this.storeDetail.yzfSign;
      uni.navigateTo({
        url:
            '/pages/tabbar/home/web-view?src=https://yzf.qq.com/xv/web/static/chat/index.html?sign=' +
            sign
      });
      // #endif
    },
    // Format money 1999 --> [1999,00]
    formatPrice(val) {
      if (typeof val == 'undefined') {
        return val;
      }
      return val.toFixed(2).split('.');
    },

    /**Select product */
    changedGoods(val) {
      this.selectedGoods = val;
    },

    /** Click on the sub-level address callback parameter*/
    deliveryFun(val) {
      this.delivery = val;
    },

    /**
     * Address child closed callback
     */
    closePopupAddress(val) {
      this.addressFlag = val;
      this.maskFlag = false;
    },
    /**
     * Commodity specification child closed callback
     */
    closePopupBuy(val) {
      this.buyMask = val;
      this.maskFlag = false;
    },

    /** Participate in the group fight Create a group fight */
    toAssembleBuyNow(order) {
      this.shutMask(4, 'PINTUAN', order);
    },
    /**
     * check the shopping cart
     */
    reluchToCart() {
      let obj = {
        from: 'product',
        id: this.productId
      };
      storage.setCartBackbtn(obj);
      uni.switchTab({
        url: '/pages/tabbar/cart/cartList'
      });
    },

    /**
     * Query the total number of shopping carts
     */
    cartCount() {
      if (storage.getHasLogin()) {
        API_trade.getCartNum().then((res) => {
          this.nums = res.data.result;
        });
      }
    },

    /**
     * Return
     */
    back() {
      if (getCurrentPages().length == 1) {
        uni.switchTab({
          url: '/pages/tabbar/home/index'
        });
      } else {
        uni.navigateBack();
      }
    },

    /**
     * Get store information
     */
    getstoreBaseInfoFun(id) {
      API_store.getstoreBaseInfo(id).then((res) => {
        if (res.data.success) {
          this.storeDetail = res.data.result;
        }
      });
    },

    /**
     * Delete favorite shops
     */
    deleteGoodsCollectionFun(id) {
      API_Members.deleteGoodsCollection(id).then((res) => {
        if (res.statusCode == 200) {
          uni.showToast({
            title: 'The product has been uncollected!',
            icon: 'none'
          });
          this.favorite = !this.favorite;
        }
      });
    },

    /**
     * Get whether the product has been favorited
     */
    getGoodsCollectionFun(goodsId) {
      if (storage.getHasLogin()) {
        API_Members.getGoodsIsCollect(goodsId, 'GOODS').then((res) => {
          this.favorite = res.data.result;
        });
      }
    },

    /**
     * Get a list of recommended products in the store
     */
    getstoreRecommend() {
      getGoodsList({
        pageNumber: 1,
        pageSize: 6,
        storeId: this.goodsDetail.storeId,
        recommend: true
      }).then((res) => {
        this.recommendList = res.data.result.content;
      });
    },

    /**
     * Get a list of similar products
     */
    getOtherLikeGoods() {
      getGoodsList({
        pageNumber: 1,
        pageSize: 10,
        category: this.goodsDetail.categoryId,
        keyword: this.goodsDetail.name
      }).then((res) => {
        this.likeGoodsList = res.data.result.content;
        console.warn(this.likeGoodsList);
      });
    },

    /**
     * Receive coupons
     */
    receiveCouponsFun(id) {
      API_Members.receiveCoupons(id).then((res) => {
        uni.showToast({
          title: res.data.message,
          icon: 'none'
        });
      });
    },

    /**
     * Jump to the shop page
     */
    navigateToStore(store_id) {
      uni.navigateTo({
        url: `/pages/product/shopPage?id=` + store_id
      });
    },

    /**
     * Get coupon button
     */
    getCoupon(item) {
      this.receiveCouponsFun(item.id);
    },

    /**
     * Specification pop-up switch
     */
    shutMask(flag, buyFlag, type) {
      // type refers to whether to click the bottom button
      if (flag) {
        switch (flag) {
          case 1: //Coupon pop-up window
            this.maskFlag = true;
            this.cuxiao = true;

            break;

          case 3:
            this.maskFlag = true;
            this.addressFlag = true;
            break;
          case 4: //Add a shopping cart to buy directly, check the selected pop-up window
            // Determine whether it is a specification
            this.maskFlag = true;
            this.buyMask = true;
            if (buyFlag == 'PINTUAN') {
              if (type.orderSn) {
                this.$refs.popupGoods.parentOrder = type;
              }
              this.$refs.popupGoods.buyType = 'PINTUAN';
            }
            if (buyFlag == 'buy') {
              this.$refs.popupGoods.buyType = '';
            }

            break;
        }
      } else {
        this.maskFlag = false;
        this.cuxiao = false;
        this.buyMask = false;
      }
    },

    /**
     * Collection
     */
    clickFavorite(id) {
      if (this.favorite) {
        // Unfavorite
        this.deleteGoodsCollectionFun(id);
        return false;
      }
      API_Members.collectionGoods(id, 'GOODS').then((res) => {
        if (res.data.success) {
          uni.showToast({
            title: 'Collection successful!',
            icon: 'none'
          });
        }
      });
      this.favorite = !this.favorite;
    },

    /**
     * Show or hide the top header
     */
    pageScroll(e) {
      if (this.scrollFlag) {
        this.calcSize();
      }
      if (e.detail.scrollTop > 200) {
        //Display back to top button when the distance is greater than 200
        this.headerFlag = true;
      } else {
        //Hide the back to top button when the distance is less than 200
        this.headerFlag = false;
      }
      if (e.detail.scrollTop < this.scrollArr[0] - 10) {
        this.scrollId = '1';
      }
      if (e.detail.scrollTop > this.scrollArr[1] - 10) {
        this.scrollId = '2';
      }
      if (e.detail.scrollTop > this.scrollArr[2] - 10) {
        this.scrollId = '3';
      }
      if (e.detail.scrollTop > this.scrollArr[3] - 10) {
        this.scrollId = '4';
      }
    },

    /**
     * Calculate the height information of each module to jump to
     */
    calcSize() {
      let h = 0;
      let that = this;
      let arr = [
        'main1',
        'main2',
        'main3',
        'main4',
        'main5',
        'main6',
        'main7',
        'main8',
        'main9',
        'main10',
        'main11'
      ];
      arr.forEach((item) => {
        let view = uni.createSelectorQuery().select('#' + item);
        view
            .fields(
                {
                  size: true
                },
                (data) => {
                  if (
                      item === 'main1' ||
                      item === 'main5' ||
                      item === 'main9' ||
                      item === 'main11'
                  ) {
                    that.scrollArr.push(h);
                  }
                  if (data && data.height) {
                    h += data.height;
                  }
                }
            )
            .exec();
      });
      this.scrollFlag = false;
    },

    /**
     * Click on the top to jump to the corresponding location
     */
    headerTab(id) {
      if (this.scrollFlag) {
        this.calcSize();
      }
      this.scrollId = id;

      this.$nextTick(() => {
        this.tabScrollTop = this.scrollArr[id - 1];
      });
    },

    /**
     * Click to share
     */
    async shareChange() {
      this.shareFlage = true;
    }
  }
};
</script>

<style lang="scss" scoped>
// #ifdef MP-WEIXIN
@import "./product/mp-goods.scss";
// #endif

@import "./product/style.scss";
@import "./product/product.scss";
</style>
