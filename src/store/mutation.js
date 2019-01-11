import * as types from './mutation-types'
import util from "common/util";
import router from '../router/index.js';

const mutations = {
  //获取店长推荐
  [types.GET_RECOMMENTLIST](state, recommentList) {
    state.recommentList = recommentList;
  },
  //获取积分换礼品列表
  [types.GET_SENDGIFTLIST](state, sendGiftList) {
    state.sendGiftList = sendGiftList;
  },
  //判断消息类型
  [types.JUDGE_MESSTYPE](state, type) {
    state.messType = type;
  },
  //修改地址
  [types.GET_URL](state, url) {
    state.baseUrl = url;
  },
  //控制手机验证码弹框
  [types.CHANGE_VALIDATE](state, flag) {
    state.isShow = flag;
  },
  //新增用户生活照
  [types.CHANGE_LIFEIMG](state, life) {
    if (state.userInfo.lifePhotoURL.lifePhotoURL == null) {
      state.userInfo.lifePhotoURL.lifePhotoURL = [];
      state.userInfo.lifePhotoURL.lifePhotoURL.push(life);
    } else {
      state.userInfo.lifePhotoURL.lifePhotoURL.push(life);
    }
  },
  //获得用户生活照
  [types.GET_LIFEIMG](state, lifeList) {
    state.lifeImgList = lifeList;
  },
  //删除生活照
  [types.DELETE_LIFEIMG](state, index) {
    state.userInfo.lifePhotoURL.lifePhotoURL.splice(index, 1)
  },
  //控制二维码关注弹框
  [types.SHOW_QRCODE](state, flag) {
    state.qrIsShow = flag
  },
  //获取用户数据
  [types.GET_USERINFO](state, userinfo) {
    userinfo.sex = userinfo.sex === 1 ? "男" : "女"
    state.userInfo = userinfo;
  },
  // 获取地理位置
  [types.GET_POSITION](state, position) {
    state.position = position
  },
  //获取候选人数据
  [types.GET_FRIENDlIST](state, data) {
    // console.log(data.candidates)
    if (data.candidates.length == 0) {
      return
    }
    state.friendList = data.candidates;
    state.friendList.forEach(item => {
      if (item.info.sex == 1) {
        item.info.sex = "男";
      } else {
        item.info.sex = "女";
      }
    });
  },
  //获取更多候选人数据
  [types.GET_MOREFRIENDlIST](state, data) {
    console.log('更多候选人数据：', data);
    data.forEach(item => {
      if (item.info.sex == 1) {
        item.info.sex = "男";
      } else {
        item.info.sex = "女";
      }
      state.friendList.push(item);
    });
  },
  //获取不足10个候选人数据
  [types.get_LESSTHAN10FRIENDLIST](state, data) {
    // console.log('获取不足10个候选人数据：', data);
    data.forEach(item => {
      if (item.info.sex == 1) {
        item.info.sex = "男";
      } else {
        item.info.sex = "女";
      }
      state.friendList.push(item);
    });
  },
  //获取已经成为好友列表
  [types.GET_ALREADYFRIENDEVTLIST](state, {
    data
  }) {
    var totalCount = 0;
    // console.log(data)
    let tempData = [];
    data.forEach((item, index) => {
      if (item.info.lastMsg) { //如果有最新消息的 
        item.info.lastMsg.stime = util.timestampToTime(item.info.lastMsg.stime)
      }
      //如果有未读消息，把有未读消息的那一项放到顶部
      if (item.info.unReadMsgCount > 0) {
        tempData.unshift(item);
      } else {
        tempData.push(item)
      }
      totalCount += item.info.unReadMsgCount //累计未读消息
    })
    state.msg_badgeCount = totalCount

    state.alreadyFriendList = tempData;
    console.log('拉取好友-----------',state.alreadyFriendList)
  },
  //获取新消息时重新排列消息列表，把最新的一项放到顶部
  [types.TO_TOP_MESSAGE](state, friendList) {
    state.alreadyFriendList = friendList
  },
  //推送最后的一个消息跟已有好友消息列表对比
  [types.COMPARE_LASTMESS](state, lastMsgFrom) {
    // console.log('COMPARE_LASTMESS:```````````````````````````````````', lastMsgFrom)
    let totalCount = 0;
    state.alreadyFriendList.forEach(item => {
      if (lastMsgFrom.lastMsg.from === item.info.openid) {
        // debugger
        let tempTime = util.timestampToTime(lastMsgFrom.lastMsg.stime)
        console.log('time--------------', tempTime)
        item.info.lastMsg = lastMsgFrom.lastMsg
        item.info.lastMsg.stime = tempTime
        item.info.unReadMsgCount = lastMsgFrom.count;
      }
      totalCount += item.info.unReadMsgCount //累计未读消息   
    })
    state.msg_badgeCount = totalCount;
    state.badgeCount = state.msg_badgeCount + state.event_badgeCount
  },
  //增加推送点赞事件列表
  [types.ADD_FRIENDEVTLIST](state, friendEvtList) {
    let friendEvtObj = {
      evtType: 1,
      from: friendEvtList
    }
    state.friendEvtList.push(friendEvtObj)
  },
  //更新好友事件消息框内容
  [types.UPDATE_DYNAMICMESSAGE](state, friendEvtObj) {
    // console.log('在线推送的信息```````````````````', friendEvtObj)
    // console.log('当前正在聊天的对象---------------------------：', state.staticChatFriendObj)
    //如果和本人聊天信封弹框不在对话框弹出
    if (state.staticChatFriendObj.openid==friendEvtObj.content.fromInfo.openid) {
      return false;
    }
    switch (friendEvtObj.msgCode) {
      case 1:
        friendEvtObj.content.extMsg.lastMsg['msg'] = "你有一条消息";
        state.dynamicFriendEvt = friendEvtObj.content;
        break;
      case 2:
        friendEvtObj.content.extMsg = {
          lastMsg: {},
        };
        friendEvtObj.content.extMsg.lastMsg['msg'] = "有人给你点赞啦";
        state.dynamicFriendEvt = friendEvtObj.content;
        break;
      case 3:
        friendEvtObj.content.extMsg = {
          lastMsg: {},
        };
        friendEvtObj.content.extMsg.lastMsg['msg'] = "有人给你送礼啦";
        state.dynamicFriendEvt = friendEvtObj.content;
        break;
      case 4:
        friendEvtObj.content.extMsg = {
          lastMsg: {},
        };
        friendEvtObj.content.extMsg.lastMsg['msg'] = "店长给你发优惠券啦";
        state.dynamicFriendEvt = friendEvtObj.content;
        break;
      case 7:
        friendEvtObj.content.extMsg.lastMsg = {};
        friendEvtObj.content.extMsg.lastMsg['msg'] = "你邀请的好友进入游戏啦";
        state.dynamicFriendEvt = friendEvtObj.content;
        break;
      case 8:
        friendEvtObj.content.extMsg = {
          lastMsg: {},
        };
        friendEvtObj.content.extMsg.lastMsg['msg'] = friendEvtObj.content.fromInfo.nickname + "上线,打个招呼？";
        state.dynamicFriendEvt = friendEvtObj.content;
        break;
        case 9:
        let shopSendText = friendEvtObj.content.extMsg
        friendEvtObj.content.extMsg = {
          lastMsg: {},
        };
        friendEvtObj.content.extMsg.lastMsg['msg'] = "分享发放福利"+shopSendText+"积分";
        state.dynamicFriendEvt = friendEvtObj.content;
        break;
      default:
        break;
    }
  },
  //获取好友事件
  [types.GET_FRIENDEVTLIST](state, {
    data
  }) {
    state.event_badgeCount = data.events.length //获取未读好友事件数量
    state.friendEvtList = data.events
  },
  //获取好友送礼
  [types.GET_FRIENDGIFTLIST](state, {data}) {
    state.gift_badgeCount = data.length;
    state.friendGiftList = data;
    console.log('收礼列表-----------------',state.friendGiftList)
  },
  //获取店长消息列表
  [types.GET_CAPTAINMESSAGELIST](state, {
    data
  }) {
    state.captainMessageList = data;
  },
  //获取约战消息列表
  [types.GET_CHALLENGEGAMELIST](state, gameMessage) {
    state.challengeGameList.push(gameMessage);
    console.log(state.challengeGameList)
    state.game_badgeCount = state.challengeGameList.length;
    console.log('约战条数---------', state.game_badgeCount)
  },
  //清空约战列表
  [types.CLEAR_CHALLENGEGAMELIST](state) {
    state.challengeGameList = [];
    state.game_badgeCount = state.challengeGameList.length;
  },
  //所有类型的未读消息累加总的未读消息里面
  [types.ADD_BADGE](state) {
    let total = 0;
    total = state.msg_badgeCount + state.event_badgeCount + state.gift_badgeCount + state.game_badgeCount;
    state.badgeCount = total;
  },
  //设置候选人聊天的信息
  [types.SET_CHAT_FRIEND](state, data) {
      state.staticChatFriendObj = data.info ? data.info : data
      console.log('state.staticChatFriendObj-------------------',state.staticChatFriendObj);
  },
  //设置动态聊天朋友信息
  [types.GET_DYNAMICFRIENDOBJ](state, data) {
    //来消息人的id
    state.chatFriendObj_id = data.content.from;
    // 未读消息
    state.badgeCount = data.content.count;
  },
  //更新聊天列表
  [types.UPDATE_CHATLIST](state, obj) {
    // console.log('state.LastChatMsg：```````````````````````````````````````', obj)
    state.LastChatMsg = obj
  },
  //更新聊天输入框
  [types.UPDATE_INPUTVALUE](state, val) {
    state.inputValue = val
  },
  // 初始化websocket
  [types.CONNECT_WEBSOCKET](state, data) {
    state.socket = data;
  },
  // 更改已经成为好友游标的变化
  [types.CHANGE_CURSOR](state, cursor) {
    state.alreadyFriendListcursor = cursor
  },
  //更改场内场外好友游标
  [types.UPDATE_INANDOUT_FRIEND_CURSOR](state, cursor) {
    state.inAndOutFriendCursor = cursor
  },
  //更改分享链接
  [types.UPDATE_SHAREURL](state, url) {
    state.shareUrl = url;
  },
  //更改候选人浮标
  [types.CHANGE_FRIENDlISTCURSOR](state, cursor) {
    state.friendListCursor = cursor;
  },
  //获取礼物
  [types.GET_GIFTLIST](state, giftList) {
    state.giftList = giftList
  },
  //获取活动通知
  [types.GET_ACTIVITY_NOTICE](state, activityNoticeList) {
    state.activityNoticeList = activityNoticeList;
  },
  //获取门店信息
  [types.GET_SHOPINFO](state, shopSettingInfo) {
    state.shopSettingInfo = shopSettingInfo;
  },
  //判断邀请有礼是否还有
  [types.JUDGE_INVITE_COUPON](state, noCouponsFlag) {
    state.noCouponsFlag = noCouponsFlag;
  },
  //获取首页轮播图
  [types.GET_ADVERTISINGIMG](state, AdvertisingPhoto) {
    state.AdvertisingPhoto = AdvertisingPhoto;
  },
  //测试
  [types.TEST](state, test) {
    state.test = test
  }
}

export default mutations
