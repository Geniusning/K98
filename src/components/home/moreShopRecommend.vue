<template>
  <div class="moreShopRecommend-wrapper">
    <my-header title="更多会员产品" bg="#fff"></my-header>
    <ul class="welfare_list" v-if="leftRecommend.length">
      <li class="item clearfix" v-for="(item,index) in leftRecommend" :key="index">
        <div class="left">
          <img onclick="return false" :src="item.goods.image" alt class="shopPic" />
        </div>
        <div class="center">
          <p class="title">{{item.coupInfo.theme}}</p>
          <p class="desc">{{item.coupInfo.content}}</p>
          <p class="limit">{{item.coupInfo.limit?item.coupInfo.limit:'联系客服'}}</p>
          <p class="price">
            <span class="discount_p">原价:{{item.goods.discountPrice}}元</span>
            <!-- <span class="origin_p">{{shopSettingInfo.shopModeId===1?"积分换":"积分换"}}:{{item.goods.integral}}</span> -->
            <span class="origin_p">积分换:{{item.goods.integral}}</span>
          </p>
        </div>
        <div class="right">
          <div class="thunb_box" v-if="item.goods.vipMoney">
            <div class="linear_btn vip" @click="freeBook(item.goods.ID,index,'vip')">会员价<br>￥{{item.goods.vipMoney}}</div>
          </div>
          <div class="thunb_box">
            <div class="linear_btn" @click="freeBook(item.goods.ID,index,'common')">积分兑换</div>
          </div>
        </div>
      </li>
    </ul>
    <topUp :convertType="convertType" v-if="isGiftPanel" @closeIntegralPanel="closeIntegralPanel" :giftInfo="recommendItemIndo" :fatherPanelIndex="fatherPanelIndex"></topUp>
  </div>
</template>

<script>
import util from "common/util"
import api from "common/api"
import { mapGetters, mapMutations, mapState } from "vuex"
import topUp from "base/topUp/topUp";
import myHeader from "../../base/myheader/myheader";
export default {
  data () {
    return {
      convertType: 0,
      isGiftPanel: false,
      fatherPanelIndex: 0,
      leftRecommend: [],
      recommendItemIndo: {
        convert: {},
        coupInfo: {},
        recommend: {
          couponID: "",
          discountPrice: "",
          image: "",
          limit: "",
          name: "",
          originalPrice: "",
          recommendID: "",
          subtopic: ""
        }
      },
    }
  },
  created () {
    this.loadAllRecommends()
    this.fromPageType = this.$route.params.fromPage
    console.log("allRecommentList=", this.allRecommentList)
  },
  computed: {
    ...mapState(["shopSettingInfo", "l98Setting", "allRecommentList", "recommentList"]),
    // ...mapGetters(["recommentList"])
  },
  methods: {
    //获取全部店长推荐
    loadAllRecommends () {
      api.loadAllRecommends().then(res => {
        // this.leftRecommend = res
        this.getAllRecommentList(res);
        console.log("leftRecommend=", this.leftRecommend)
        if (this.fromPageType === "home") {
          this.leftRecommend = JSON.parse(JSON.stringify(this.allRecommentList))
          for (let i = this.recommentList.length - 1; i >= 0; i--) {
            for (let j = this.leftRecommend.length - 1; j >= 0; j--) {
              if (this.leftRecommend[j].goods.id === this.recommentList[i].goods.id) {
                this.leftRecommend.splice(j, 1)
              }
            }
          }
        } else {
          for (let j = this.allRecommentList.length - 1; j >= 0; j--) {
            if (this.allRecommentList[j].goods.vipMoney !== 0) {
              this.leftRecommend.push(this.allRecommentList[j])
            }
          }
        }
        console.log('全部店长推荐数据---------------------', this.leftRecommend)
      })
    },
    //监听充值面板状态
    closeIntegralPanel (flag) {
      //console.log("面板状态-----------", flag);
      this.isGiftPanel = flag;
    },
    freeBook (recommendID, index, type) {
      if (!this.l98Setting.shopItemConvertOpen) {
        this.$vux.toast.text("商家未开通本功能", "middle");
        return;
      }
      this.isGiftPanel = true;
      if (type === "vip") {
        this.fatherPanelIndex = 9
      } else {
        this.fatherPanelIndex = 2
      }
      this.recommendItemIndo = this.leftRecommend[index];
    },
    ...mapMutations({
      getAllRecommentList: "GET_ALLRECOMMENTLIST", //获取全部店长推荐
    })
  },
  components: {
    myHeader,
    topUp
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/less/btn.less';
.moreShopRecommend-wrapper {
  overflow: auto;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 10000;
  background-color: #fff;
  .welfare_list {
    padding: 0 0.2667rem;
    .item {
      // height: 2.4667rem;
      padding: 0.1333rem 0.1rem;
      .shop-logo-name {
        display: flex;
        align-items: center;
        margin-bottom: 0.1333rem;
        position: relative;
        border-radius: 6px;
        .shop-logo {
          margin-right: 0.1333rem;
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
        }
        .shop-name {
          font-weight: 800;
          background-color: rgba(0, 0, 0, 0.1);
          color: #fff;
          font-size: 0.36rem;
          display: inline-block;
          padding: 0 0.1rem;
          display: flex;
          align-items: center;
          border-radius: 6px;
        }
        .distance {
          color: #8f8f8f;
          font-size: 0.3467rem;
          position: absolute;
          top: 0.1rem;
          right: 0.0333rem;
        }
      }
      .left {
        float: left;
        width: 2.4rem;
        height: 2.2rem;
        .shopPic {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
      .center {
        float: left;
        height: 2.2rem;
        margin-left: 0.1667rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .title {
          font-size: 0.3733rem;
          color: #333;
          font-weight: bold;
          width: 4.5rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .desc {
          margin-top: 0.1rem;
          color: #8f8f8f;
          font-size: 0.32rem;
        }
        .limit {
          margin-top: 0.16rem;
          color: #8f8f8f;
          font-size: 0.2667rem;
        }
        .price {
          margin-top: 0.1rem;
          display: flex;
          .discount_p {
            color: #333;
            font-size: 0.3467rem;
            margin-right: 0.3rem;
          }
          .origin_p {
            color: red;
            font-size: 0.3467rem;
          }
        }
      }
      .right {
        margin-top: 1.4rem;
        position: relative;
        .thunb_box {
          .vip {
            position: absolute;
            top: -1.5rem;
            right: 0;
          }
        }
      }
    }
  }
}
</style>
