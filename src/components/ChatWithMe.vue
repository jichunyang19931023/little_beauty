<template>
  <div>
    <div class="new_movies">
      <div class="title">
        <span><Icon type="bowtie" />&nbsp;联系我呀</span>
        <div class="send_btn">
            <Icon color="#ec5d80" size="30" type="paper-airplane" class="write_icon"></Icon><span class="send">我写好了</span>
        </div>
      </div>
      <div class="chat_content">
        <Input v-model="textarea" type="textarea" :autosize="{minRows: 10}" placeholder="亲爱的陌生人，给我写信吧，我会回复你的。"></Input>
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
              <li>
                <Icon type="email" color="#f9aebc" size="25" class="email_icon"></Icon>
                <span class="email_time">2021-01-29 14:34</span>
                <Icon type="email" color="#76c1f7" size="25" class="email_icon float_margin"></Icon>
                <span class="email_time">2021-01-29 14:34</span>
              </li>
              <li>
                <Icon type="email" color="#f9aebc" size="25" class="email_icon"></Icon>
                <span class="email_time">2021-01-29 14:34</span>
                <Icon type="email" color="#76c1f7" size="25" class="email_icon float_margin"></Icon>
                <span class="email_time">2021-01-29 14:34</span>
              </li>
            </ul>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Heart } from "../service/heart.js";
export default {
        name:'HelloWorld',
        data() {
            return {
                textarea:""
            }
        },
        beforeMount: function() {
            
        },
        methods: {
            
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
</style>
