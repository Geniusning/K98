<template>
  <div class="qrCode_wrapper">
    <!-- 绑定手机弹框 -->
    <div v-transfer-dom>
      <x-dialog v-model="qrIsShow" class="dialog-demo">
        <div class="bindTel_wrapper">
          <h3 class="title">{{qrCodeTextObj.title}}</h3>
          <img onclick="return false" src="../../assets/image/close.png" alt="" class="close" @click="cancel">
          <div class="validate_box">
            <img @touchstart="touchstart" @touchend="touchend" :src="qrUrl" alt="" class="qrCode">
            <p class="desc">{{qrCodeTextObj.bottomText}}</p>
          </div>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  import {
    XDialog,
    XButton,
    TransferDomDirective as TransferDom
  } from "vux";
  import {
    mapGetters,
    mapMutations,
    mapState
  } from "vuex";
  import api from 'common/api.js'
  import Bus from 'common/bus.js'
  export default {
    directives: {
      TransferDom
    },
    data() {
      return {
        qrUrl: "",
      };
    },
    mounted() {
      this._getQrCode()
    },
    props: {
      isCheckQrCode: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      ...mapState(["qrCodeTextObj"]),
      ...mapGetters(["qrIsShow"]),
    },
    methods: {
      //手机验证取消事件
      cancel() {
        this.showQrcode(false);
      },
      touchstart() {
        this.startTime = +new Date()
        this.timer = setTimeout(() => {
          window.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
              console.log('后台')
              this.closeWebPage()
            }
          })
        }, 700)
      },
      touchend() {
        this.endTime = +new Date()
        if (this.endTime - this.startTime < 700) {
          clearTimeout(this.timer)
          window.removeEventListener('visibilitychange')
        }
      },
      //关闭公众号
      closeWebPage() {
        WeixinJSBridge.invoke("closeWindow", {}, function(res) {
          // alert(res.err_msg);
          // window.location.href =
          //   "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU3MTc1MzA1OA==#wechat_redirect";
        });
      },
      async _getQrCode() {
        if (this.isCheckQrCode) {
          let res = await api.loadQRCode();
          //console.log("收款码---", res);
          if (res.errCode === 0) {
            this.qrUrl = res.info.url
          }
        } else {
          api.loadAllQrcode().then(res => {
            // //console.log('二维码-----------',res);
            this.qrUrl = res.urls[0];
          })
        }
      },
      ...mapMutations({
        showQrcode: "SHOW_QRCODE"
      })
    },
    components: {
      XDialog,
      XButton
    }
  };
</script>

<style scoped lang='less'>
  @import "../../assets/less/mixin.less";
  .qrCode_wrapper {
    position: absolute;
    z-index: 99999;
  }
  .bindTel_wrapper {
    width: 8rem;
    height: 7.8rem;
    .bg("../../assets/image/bg.png");
    position: relative;
    margin: auto;
    .title {
      padding-top: 0.72rem;
      font-size: 14px;
      color: #333;
      text-shadow: 5px 5px 5px #ccc;
      text-align: center;
      font-weight: 900;
    }
    .close {
      position: absolute;
      right: 0.1333rem;
      top: 0.1333rem;
      width: 0.52rem;
      height: 0.52rem;
    }
    .validate_box {
      padding-top: 1rem;
      position: relative;
      text-align: center;
      .qrCode {
        width: 4rem;
        height: 4rem;
        -webkit-touch-callout: none;
      }
      .desc {
        margin-top: 0.2667rem;
        font-family: 'Times New Roman', Times, serif;
        font-size: 0.32rem;
      }
    }
  }
</style>
