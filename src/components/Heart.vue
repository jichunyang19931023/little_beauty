<template>
  <div>
    <div class="new_movies">
      <div class="title">
        <span><Icon type="bowtie" />&nbsp;心灵小驿站</span>
      </div>
      <div v-for="item in titleList">
        <div class="question">
          <Alert class="heart-title" type="success" v-html="item.question"></Alert>
        </div>
        <div class="question" v-if="item.chooses.length > 0">
          <Alert class="heart-reply" type="error">
            <Radio-group @on-change="chooseMood" class="heart-content" v-model="item.chooseItem">
              <Radio :disabled="item.chooseState" v-for="choose in item.chooses" :label="choose.num" :key="choose.num">{{choose.value}}</Radio>
            </Radio-group>
          </Alert>
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
                titleNum: 0,
                titleList:[{
                  question:"今天心情怎么样呢？",
                  chooses:[
                  {num:1,value:"A. 还不错欸"}, {num:2,value:"B. 一般般吧"},
                  {num:3,value:"C. 有点难过"}, {num:4, value:"D. 需要安慰"}],
                  chooseItem:"",
                  chooseState:false
                }]
            }
        },
        beforeMount: function() {
            var cookieMsg = this.getCookie("userInfo");
            var username = new Array();
            username = cookieMsg.split("-");
            var login = username[username.length-1];
            if (login != "") {
              
            }else{
              
            }
        },
        methods: {
            chooseMood: function() {
              let chooseItem = this.titleList[this.titleList.length - 1].chooseItem;
              this.titleList[this.titleList.length - 1].chooseState = true;
              let data = {
                  titleNum: this.titleNum,
                  chooseItem: chooseItem
                }
                Heart.getReply(data).then(res => {
                  if (res.data.code == 200) {
                    if (res.data.info) {
                      this.titleNum = res.data.info.id;
                      let obj = {};
                      obj.question = res.data.info.replyContent;
                      obj.chooses = [];
                      res.data.info.chooseList.forEach(function(item, index){
                        if (item) {
                          let choose = {};
                          choose.num = index + 1;
                          choose.value = item;
                          obj.chooses.push(choose);
                        }
                      });
                      this.titleList.push(obj);
                      if (obj.question.indexOf("日常小温暖") != -1) {
                        let that = this;
                        setTimeout(function(){that.$router.push("/newBlog");}, 2000);
                        return;
                      }
                      if (obj.question.indexOf("联系我呀") != -1) {
                        let that = this;
                        setTimeout(function(){that.$router.push("/chatWithMe");}, 2000);
                        return;
                      }
                    }
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
.question{
  float: left;
  width: 100%;
}
.heart-title{
    margin: 10px 5px;
    font-size: 15px;
    color: #7d8e7f;
    width: 40%;
    line-height: 1.5;
}
.heart-reply{
  width: 50%;
  float: right;
}
.heart-content{
  font-size: 15px;
  color: #8c847f;
}
.heart-content>label{
  margin-top: 5px;
}
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
.new_movies .movie,.movies .movie{
  padding: 10px 5px;
  width: 100%;
}
.movie .time,.title .more{
  float: right;
  color: #aaa !important;
}
.movie .t{
  font-size: 16px;
  color: #48484c;
  font-weight: 700;
}
.movie .abs{
  margin: 8px 0;
  line-height: 23px;
  height: 57px;
  overflow: hidden;
  width: 100%;
}

.movie .writer{
  color: #ec5d80;
}
.movie img{
  float: left;
  width: 15%;
  height: 120px;
  margin: 2px 2% 2px 0;
}
.my-color{
  color: #666 !important;
}
</style>
