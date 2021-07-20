const promotion = [
   {
      title: 'Points Activity',
      value: 'POINT'
   },
   {
      title: 'Single product reduction',
      value: 'MINUS'
   },
   {
      title: 'Group Purchase',
      value: 'GROUPBUY'
   },
   {
      title: 'Points Redemption',
      value: 'EXCHANGE'
   },
   {
      title: 'The second item is half price',
      value: 'HALF_PRICE'
   },
   {
      title: 'Full Discount Discount',
      value: 'FULL_DISCOUNT'
   },
   {
      title: 'Limited Time Purchase',
      value: 'SECKILL'
   },
   {
      title: 'Joint Group',
      value: 'PINTUAN'
   },
   {
      title: 'Coupon',
      value: 'COUPON'
   }
];
export default promotion;

/**Format */
export function formatType(val) {
   if (val != undefined) {
      promotion.forEach(item => {
         if (val == item.value) {
            return item.title;
         }
      });
   }
}
