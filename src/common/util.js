/*
 * @Author: nicky 
 * @Date: 2018-04-12 15:44:17 
 * @Last Modified by: liuning
 * @Last Modified time: 2019-10-29 17:05:04
 */
import api from 'common/api'
import Config from 'common/config.js'
let util = {};
//路由跳转
util.routerTo = function (route, vm, param) {
  vm.$router.push({
    name: route,
    params: param
  });
}
//匹配微信的网页授权的code
util.requesturl = function (attr) {
  var reg = new RegExp("(^|&)" + attr + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURI(r[2].toString());
  return null;
}

//微信登陆，把openid传给后端
util.WcLogin = function (openId) {
  xhr = new XMLHttpRequest()
  xhr.open('POST', "http://m.tairunmh.com/mobile/user/app/login", true)
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
      console.log('loginbackbakckckckckckckckckkc')
      var result = JSON.parse(this.responseText)
      if (result.status == 1) {
        sessionStorage.setItem('loginStatus', 1)
      } else {
        sessionStorage.setItem('loginStatus', 0)

      }
    }
  });
  xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
  var data = "openId=" + openId + "&type=weixin"
  xhr.send(data);
  var img = document.createElement('img')
}

//微信code 获取 openid  
util.GetOpenIdByCode = function (code) {
  xhr = new XMLHttpRequest()
  xhr.open('POST', "http://m.tairunmh.com/mobile/mooncake/queryOpenIdByCode", true)
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
      console.log('backbakckckckckckckckckkc')
      var res = JSON.parse(this.responseText)
      localStorage.setItem('trOpenId', res.data.openId)
      WcLogin(res.data.openId)
    }
  });
  xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
  var data = "code=" + code + "&appId=wx2684abab04c7017d";
  xhr.send(data);
}
//时间戳转化成地址  格式xxxx-xx-xx xx-xx-xx
util.timestampToTime = function (timestamp) {
  // console.log("timestamp----------------",timestamp)
  if (typeof timestamp == "string") {
    return timestamp
  }
  timestamp = Number(timestamp);
  // console.log(timestamp.toString().length)
  if (timestamp.toString().length > 11) {
    var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10) ? '0' + date.getDate() + " " : date.getDate() + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10) ? '0' + date.getMinutes() + ":" : date.getMinutes() + ':';
    var s = (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds();
    // console.log("处理后的时间----------",Y + M + D + h + m + s)
    return Y + M + D + h + m + s;
  } else {
    var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10) ? '0' + date.getDate() + " " : date.getDate() + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10) ? '0' + date.getMinutes() + ":" : date.getMinutes() + ':';
    var s = (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds();
    // console.log("处理后的时间----------",Y + M + D + h + m + s)
    return Y + M + D + h + m + s;

  }
}
util.timestampToTimeNoLine = function (timestamp) {
  if (typeof timestamp != "number") { //如果传入的不是整型就提示
    // console.error('传入的数据不是Number类型')
    return timestamp;
  }
  timestamp = Number(timestamp);
  console.log(timestamp.toString().length)
  if (timestamp.toString().length > 11) {
    var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = (date.getDate() < 10) ? '0' + date.getDate() + " " : date.getDate() + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10) ? '0' + date.getMinutes() + ":" : date.getMinutes() + ':';
    var s = (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
  } else {
    var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + ''; //+''转字符串
    var M = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    var D = (date.getDate() < 10) ? '0' + date.getDate() + " " : date.getDate() + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10) ? '0' + date.getMinutes() + ":" : date.getMinutes() + ':';
    var s = (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;

  }
}
//计算上线时间
util.calcOnlineTime = function (visitime) {
  let day = Math.floor(visitime / 86400);
  if (visitime > 60 && visitime < 3600) {
    return Math.floor(visitime / 60) + "分钟前上线"
  } else if (visitime > 3600 && visitime < 86400) {
    return Math.floor(visitime / 3600) + "小时前上线"
  } else if (day <= 366 && day >= 1) {
    return Math.ceil(day) + "天前上线"
  } else {
    return "刚刚上线"
  }
}
util.returnDiscountType = (discountTypeNumber) => {
  if (parseInt(discountTypeNumber) === 0) {
    return "现金券"
  } else if (parseInt(discountTypeNumber) === 1) {
    return "实物券"
  } else if (parseInt(discountTypeNumber) === 2) {
    return "折扣券"
  } else if (parseInt(discountTypeNumber) === 3) {
    return "兑换券"
  } else if (parseInt(discountTypeNumber) === 4) {
    return "满减券"
  } else if (parseInt(discountTypeNumber) === 5) {
    return "月卡券"
  } else if (parseInt(discountTypeNumber) === 6) {
    return "次卡券"
  }
}
//获取微信jssdk
util._getJssdkInfo = function (shareObj, url, amount, shareType, fn) {
  shareType = shareType || "activity"
  api.getJssdkInfo("/api/loadJSSDKParams?url=" + encodeURIComponent(url))
    .then(res => {
      console.log("获取微信jssdk---------", res)
      wx.config({
        // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: res.appId,
        timestamp: res.timestamp,
        nonceStr: res.nonceStr,
        signature: res.signature,
        jsApiList: ["openLocation", "getLocation", "onMenuShareAppMessage", 
          "chooseImage", "onMenuShareTimeline", 
          "startRecord", "stopRecord", "onVoiceRecordEnd", "playVoice","pauseVoice",
          "stopVoice", "onVoicePlayEnd", "uploadVoice","downloadVoice"]
      });
      wx.ready(() => {
        wx.onMenuShareAppMessage({ //分享好友
          title: shareObj.title,
          desc: shareObj.desc,
          link: shareObj.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: shareObj.imgUrl,
          success: () => {
            //分享朋友记录
            console.log("分享好友")
            api.createShareDaylog("friend")
            //分享获得积分
            fn(amount, shareType)

          }
        });
        wx.onMenuShareTimeline({  //朋友圈
          title: shareObj.title, // 分享标题
          link: shareObj.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: shareObj.imgUrl, // 分享图标
          success: () => {
            // 用户点击了分享后执行的回调函数
            //分享朋友圈记录
            console.log("分享朋友圈")
            api.createShareDaylog("timeLine")
          }
        })
      });
      wx.error(function (res) {
        console.log(res);
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
      });
    })
    .catch(err => {
      console.log(err);
    });
}
//获取cookie
util.getCookie = function (cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1);
    if (c.indexOf(name) != -1) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
//获取url参数
util.GetQueryString = function (name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
};
//判断安卓或者苹果
util.isAndroid = function () {
  let u = navigator.userAgent;
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if (isAndroid) {
    return true;
  }
  if (isiOS) {
    return false;
  }
}
util.isIphonex = () => {
  if (typeof window !== 'undefined' && window) {
    return /iphone/gi.test(window.navigator.userAgent) && window.screen.height >= 812;
  }
  return false;
}
util.sortByKey = function (key) {
  return function (obj1, obj2) {
    var v1 = obj1[key]
    var v2 = obj2[key]
    return v2 - v1
  }
}
util.sortByKeyS2L = function (key) {
  return function (obj1, obj2) {
    var v1 = obj1[key]
    var v2 = obj2[key]
    return v1 - v2
  }
}
util.prefixZero = function (num, n) {
  var len = num.toString().length;
  while (len < n) {
    num = "0" + num;
    len++;
  }
  return num;
}
util.returnDiscountContent = function (coupon) {
  if (parseInt(coupon.type) === 0) {
    return "现金券" + coupon.value + "元"
  } else if (parseInt(coupon.type) === 1) {
    return "实物券" + coupon.content
  } else if (parseInt(coupon.type) === 2) {
    return "折扣券" + coupon.value + "折"
  } else if (parseInt(coupon.type) === 3) {
    return "兑换券" + coupon.content
  } else if (parseInt(coupon.type) === 4) {
    return "满减券" + coupon.content
  } else if (parseInt(coupon.type) === 6) {
    return "月卡券" + coupon.content
  } else if (parseInt(coupon.type) === 7) {
    return "次卡券" + coupon.content
  }
}
export default util
