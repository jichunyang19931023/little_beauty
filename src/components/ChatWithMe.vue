<template>
  <div>
    <div class="new_movies" v-if="user.roleType == 1">
        <div class="title">
        <span><Icon type="bowtie" />&nbsp;联系我呀</span>
        <div @click="sendLetter()" class="send_btn">
            <Icon color="#ec5d80" size="30" type="paper-airplane" class="write_icon"></Icon><span class="send">我写好了</span>
        </div>
      </div>
      <div class="chat_content">
        <Input v-model="textarea" type="textarea" :autosize="{minRows:10}" placeholder="亲爱的陌生人，给我写信吧，我会回复你的。"></Input>
      </div>
      <div class="article">
          <img class="wechat floatL" src="../assets/images/wechat.jpg">
          <div class="connection floatL">
            <span class="t">讲个小故事，你要听吗？</span></br>
            <span class="qq">站主是个程序员小可爱，会在公众号分享一些自己编的小故事或者小感受，欢迎来转转呀。</span>
          </div>
          <div>
            <div class="mail_box">我的小信箱</div>
            <ul>
              <li @click="getLetterById(letter.id)" v-for="letter in letterList" class="letter_item">
                <div>
                  <Icon type="email" color="#f9aebc" size="25" class="email_icon"></Icon>
                  <span class="email_time">{{letter.createTime}}</span>
                </div>
                <div v-if="letter.replyStatus == 1">
                  <Icon type="email" color="#76c1f7" size="25" class="email_icon float_margin"></Icon>
                  <span class="email_time">{{letter.replyTime}}</span>
                </div>
              </li>
              <div style="color: gray;" v-if="letterList.length==0">暂无信件</div>
            </ul>
          </div>
        </div>
    </div>
    <div class="new_movies" v-if="user.roleType == 0">
      <div class="title">
        <span><Icon type="bowtie" />&nbsp;我的小信箱</span>
        <Radio-group v-model="showStatus" @on-change="clickStatus()" class="choose_status">
          <Radio label="">全部</Radio>
          <Radio label="0">未回复</Radio>
          <Radio label="1">已回复</Radio>
        </Radio-group>
        <div>
            <div class="mail_box"></div>
            <ul>
              <li @click="getLetterById(letter.id)" v-for="letter in letterList" class="letter_item">
                <span class="email_writer">{{letter.writer}}&nbsp;的来信</span>
                <div style="float: left;">
                  <Icon type="email" color="#f9aebc" size="25" class="email_icon"></Icon>
                  <span class="email_time">{{letter.createTime}}</span>
                </div>
                <div v-if="letter.replyStatus == 1">
                  <Icon type="email" color="#76c1f7" size="25" class="email_icon float_margin"></Icon>
                  <span class="email_time">{{letter.replyTime}}</span>
                </div>
              </li>
              <div style="color: gray;" v-if="letterList.length==0">暂无信件</div>
            </ul>
        </div>
      </div>
    </div>
    <Modal title="信件内容" v-model="modal" :mask-closable="false" @on-ok="makeSure()">
      <Input v-model="letterContent" type="textarea" :autosize="{minRows: 10}" readonly></Input>
      <span class="letter_title">
        回复：
      </span>
      <Input v-model="replyContent" type="textarea" :autosize="{minRows: 10}" :readonly="replyReadOnly? 'readonly':false"></Input>
    </Modal>
  </div>
</template>

<script>
import { Chat } from "../service/chat.js";
import { Auth } from "../service/auth.js";
export default {
        name:'HelloWorld',
        data() {
            return {
                textarea:"",
                replyContent:"",
                letterContent:"",
                user:"",
                letterList:[],
                modal: false,
                replyReadOnly: true,
                showStatus: ""
            }
        },
        beforeMount: function() {
            Auth.getUserInfo({}).then(res => {
                if (res.data.code == 200) {
                    this.user = res.data.info;
                    this.getLetters();
                }
            });
        },
        methods: {
            getLetters: function(){
              let data = {};
              if (this.user.roleType == 1) {
                data.writeId = this.user.id;
              }
              Chat.getLetters(data).then(response => {
                  if (response.data.code == 200) {
                      this.letterList = response.data.info;
                  } else {
                      this.$Message.error(response.data.msg);
                  }
              });
            },
            sendLetter: function(){
              var param = new URLSearchParams();
              // 如果是管理员权限
              if (this.user.roleType == 0) {
                if (!this.replyContent) {
                  this.$Message.error("回复内容不能是空的哟~");
                  return;
                }
                param.append('letterId',this.letterId);
                param.append('replyContent',this.replyContent);
                param.append('type', 1);
              }else{
                if (!this.textarea) {
                  this.$Message.error("内容不能是空的哟~");
                  return;
                }
                param.append('writeId',this.user.id);
                param.append('letterContent',this.textarea);
                param.append('type', 0);
              }
              Chat.sendLetter(param).then(response => {
                  if (response.data.code == 200) {
                      this.textarea = "";
                      this.getLetters();
                      this.$Message.success("信件成功发送！");
                  }else{
                    this.$Message.error(response.data.msg);
                  }
              });
            },
            getLetterById: function(id){
              let data = {
                id: id
              };
              Chat.getLetterById(data).then(response => {
                  if (response.data.code == 200) {
                      this.modal = true;
                      this.letterId = response.data.info.id;
                      this.letterContent = response.data.info.letterContent;
                      this.hasReply = response.data.info.replyStatus == 1;
                      if (!response.data.info.replyContent && this.user.roleType == 1) {
                        this.replyContent = "暂无回复，请耐心等候哟";
                      }else{
                        this.replyContent = response.data.info.replyContent;
                      }
                      this.replyReadOnly = this.user.roleType == 1 || response.data.info.replyContent;
                  }
              });
            },
            makeSure: function(){
              // 只有管理员才能回复
              if (this.user.roleType == 1) {
                return;
              }
              if (this.hasReply) {
                return;
              }
              this.sendLetter();
            },
            clickStatus: function(){
              let data = {};
              if (this.user.roleType == 0) {
                data.letterStatus = this.showStatus;
              }
              Chat.getLetters(data).then(response => {
                  if (response.data.code == 200) {
                      this.letterList = response.data.info;
                  } else {
                      this.$Message.error(response.data.msg);
                  }
              });
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .common-content{
    margin: 20px 150px;
  }
</style>
<style scoped>
a {
  color: #42b983 !important;
}
.new_movies,.movies{
    width: 100%;
    float: left;
    padding: 0 25px;
}
.new_movies .title,.movies .title{
  padding: 8px 10px;
  border-bottom: 1px dashed #ec5d80;
  font-size: 16px;
  color: #ec5d80 !important;
}
.new_movies{
  padding: 10px 5px;
  width: 100%;
}

.chat_content{
  margin-top: 10px;
  width: 60%;
  float: left;
}
.article{
  float: left;
  width: 38%;
  margin-left: 2%;
  margin-top: 10px;
}
.article .connection{
  margin-left: 10px;
  padding: 5px;
  width: 70%;
}
.article .t{
  font-size: 15px;
}
.article .qq{
  line-height: 23px;
  color: #999;
}
.article .wechat{
  width: 100px;
}
.send_btn{
  float: right;
}
.send{
  color: #afaaab;
  font-size: 16px;
  float: left;
  padding-top: 5px;
  padding-right: 3px;
}
.send:hover{
  color: #ec5d80;
  cursor: pointer;
}
.email_icon{
  float: left;
}
.email_time{
  float: left;
  padding: 3px 5px;
  color: #9c8989;
}
.float_margin{
  margin-left: 25px;
}
.mail_box{
  float: left;
  width: 100%;
  margin-top: 7px;
  padding-top: 7px;
  margin-bottom: 5px;
  font-size: 16px;
  border-top: 1px solid #efefef;
}
ul,li{
  float: left;
  width: 100%;
}
.letter_item{
  cursor: pointer;
}
.letter_item:hover{
  background-color: #fbf8f8;
}
.letter_title{
  float: left;
  margin: 10px 0;
}
.email_writer{
  color: #2d8cf0;
  float: left;
  margin-right: 10px;
}
.choose_status{
  float: right;
  color: gray;
  font-size: 15px;
}
</style>
