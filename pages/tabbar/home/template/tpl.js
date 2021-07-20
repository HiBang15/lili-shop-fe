/** Configure the jump of the floor module */
export function modelNavigateTo(item) {
   let val = item.url;
   switch (val.___type) {
      case 'goods':
         uni.navigateTo({
            url: '/pages/product/goods?id=' + val.id + '&goodsId=' + val.goodsId
         });
         break;
      case 'category':
         if (val.id) {
            uni.navigateTo({
               url: `/pages/navigation/search/searchPage?category=${ val.id }`
            });
         } else {
            uni.navigateTo({
               url: `/pages/navigation/search/searchPage`
            });
         }
         break;
      case 'stores':
         uni.navigateTo({
            url: `/pages/product/shopPage?id=${ val.id }`
         });
         break;
      // activity
      case 'marketing':
         uni.navigateTo({
            url: '/pages/product/goods?id=' + val.skuId + 'goodsId=' + val.goodsId
         });
         break;
      case 'pages':
         uni.navigateTo({
            url: val.___path + '?id=' + val.id + '&title=' + val.title
         });
         break;
      case 'other':
         switch (val.title) {
            case 'Home':
               uni.switchTab({
                  url: `/pages/tabbar/home/index`
               });
               break;
            case 'shopping cart':
               uni.switchTab({
                  url: `/pages/tabbar/cart/cartList`
               });
               return;
            case 'personal center':
               uni.switchTab({
                  url: `/pages/tabbar/user/my`
               });
               break;
            case 'Collection of Goods':
               uni.navigateTo({
                  url: `/pages/mine/myCollect`
               });
               break;
            case 'My order':
               uni.navigateTo({
                  url: `/pages/order/myOrder?status=0`
               });
               break;
            case 'Voucher Collection Center':
               uni.navigateTo({
                  url: `/pages/cart/coupon/couponCenter`
               });
               break;
            case 'sign in':
               uni.navigateTo({
                  url: `/pages/mine/signIn`
               });
               break;
            case 'Spike Channel':
               uni.navigateTo({
                  url: `/pages/promotion/seckill`
               });
               break;
            case 'Joint group channel':
               uni.navigateTo({
                  url: `/pages/promotion/joinGroup`
               });
               break;
            case 'Mini Program Live':
               uni.navigateTo({
                  url: `/pages/promotion/lives`
               });
               break;
            case 'Bargain':
               uni.navigateTo({
                  url: `/pages/promotion/bargain/list`
               });
               break;
            case 'Points Mall':
               uni.switchTab({
                  url: `/pages/navigation/point/point-mall`
               });
               break;
         }

         break;
   }
}
