<template>
  <div id="blog_body">
    <div class="head_title">
      <Breadcrumb style="vertical-align: middle;padding-top: 10px;">
        <BreadcrumbItem to="/">Home</BreadcrumbItem>
        <BreadcrumbItem>我的小温暖</BreadcrumbItem>
      </Breadcrumb>
      <router-link to="/newBlog" class="new-blog">
        <Icon type="ios-nutrition" class="carrot"></Icon>&nbsp;记录小温暖
      </router-link>
    </div>
    <ul class="floatL">
      <li class="blog-unit"  v-for="article in articleList">
        <router-link :to="{path:'/blogPage',query:{id:article.id}}" target="_blank">
          <h3 class="blog-title bottom-dis-8">{{article.title}}</h3>
          <p class="text bottom-dis-8">{{article.abs}}</p>
        </router-link>
        <div class="unit-control clearfix bottom-dis-16">
              <div class="unit-con-left clearfix floatL">
                  <div class="floatL">{{article.createTimeStr}}</div>
                  <div class=" floatL left-dis-24">
                    <Icon class="comment-color" type="chatbubble-working"></Icon>
                    <span>{{article.commentCount}}</span>
                  </div>
                  <div class=" floatL left-dis-24">
                    <Icon class="collect-color" type="star"></Icon>
                    <span>{{article.collectCount}}</span>
                  </div>
              </div>
        </div>
        
        <ul class="unit-con-right floatR">
          <li class="floatL edit-btn left-dis-8 right-dis-8" @click="editArticle(article.id)">
            <a class="button-color" target="_blank">编辑</a>
          </li>
          <li class="floatL del-btn" @click="delArticle(article.id)">
            <a class="button-del-color">删除</a>
          </li>
        </ul>
      </li>
      <div class="no_warm" v-if="articleList.length == 0">还没有日常小温暖的记录呢</div>
    </ul>  
    <div class="new_articles floatL article">
      <div class="title">
        <span><Icon type="heart" />&nbsp;写封信吧</span>
      </div>
      <div style="margin: 10px 5px;cursor: pointer;" @click="gotoLetter()">
        <img class="wechat floatL" src="../../assets/images/letter.jpg">
        <span class="letter_text">因为陌生，所以可以无所顾忌；<br/>因为陌生，所以可以敞开心扉。<br/>写信给我吧，我在这里等你。</span>
      </div>
    </div>
    <div class="new_articles floatL">
      <div class="title">
        <span><Icon type="heart" />&nbsp;来听故事</span>
      </div>
      <ul>
        <li class="article floatL">
          <img class="wechat floatL" src="../../assets/images/wechat.jpg">
          <div class="connection floatL">
            <span class="t">讲个小故事，你要听吗？</span></br>
            <span class="qq">邮箱：878147364@qq.com</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Article } from "../../service/article.js";
export default {
        name:'HelloWorld',
        data() {
            return {
                articleList: [],
                articleLoading: true
            }
        },
        beforeMount: function() {
            this.loadArticles();
        },
        methods: {
            loadArticles: function() {
              var cookieMsg = this.getCookie("userInfo");
              var username = new Array();
              username = cookieMsg.split("-");
              var personId = username[username.length-2];
              let data = {
                personId : personId
              }
              Article.loadArticles(data).then(response => {
                  this.articleLoading = false;
                  if (response.data.code == 200) {
                        var articles = response.data.info.records;
                        articles.forEach(function(item){
                          item.title = item.title.substr(0,20);
                        });
                        this.articleList = articles;
                  } else {
                        this.$Message.error(response.data.msg);
                  }
              });
            },
            editArticle: function(id) {
              this.$router.push('/newBlog?id='+id);
            },
            delArticle: function(id) {
              var param = new URLSearchParams();
              param.append('id',id);
              Article.delArticle(param).then(response => {
                  if (response.data.code == 200) {
                      this.$Message.info("删除成功！");
                      let that = this;
                      setTimeout(function(){that.$router.push('/blogList');}, 2000);
                  } else {
                      this.$Message.error(response.data.msg);
                  }
              });
            },
            gotoLetter: function(){
              this.$router.push('/chatWithMe');
            }
        }
    }
</script>
<style>
  .common-content{
    margin: 20px 150px;
  }
</style>
<style scoped>
.head_title{
  float: left;
  width: 98%;
  border-bottom: 1px dashed #f1ecec;
}
.comment-color{
  color: #75b7e9;
}
.collect-color{
  color: #f90;
}
.like-color{
  color: #ec7b94;
}
#blog_body{
  min-height: 500px;
}
#blog_body>ul{
  width: 60%;
  min-height: 250px;
  overflow: auto;
}
.new-blog{
    float: right;
    margin-right: 10px;
    font-size: 15px;
    font-weight: 400;
    border: 1px solid #f1b5d3;
    border-radius: 4px;
    padding: 3px 5px;
    color: #f1b5d3;
}
.new-blog:hover{
  color: #f1a5a2;
}
.carrot{
  font-size: 21px;
  color: #f1a5a2;
  vertical-align: middle;
}
.blog-unit{
    margin-left: 24px;
    margin-right: 24px;
    border-bottom: 1px dashed #e9e9e9;
    padding-top: 16px;
    padding-bottom: 10px;
    float: left;
    width: 95%;
}
.blog-title{
    font-size: 20px;
    color: #4f4f4f;
    word-wrap: break-word;
}
.text{
    font-size: 14px;
    color: #999;
    word-break: break-all;
}
.unit-control{
  margin-bottom: 16px;
}
.unit-con-right{
  display: none;
}
.blog-unit:hover .unit-con-right{
  display: block;
}
.button-color{
  color: #75b7e9;
}
.button-del-color{
  color: #de7272;
}
.new_articles{
    width: 35%;
    margin-left: 2%;
    margin-bottom: 15px;
}
.new_articles .title{
  padding: 8px 10px;
  border-bottom: 1px dashed #ec5d80;
  font-size: 16px;
  color: #ec5d80;
}
.new_articles .article{
  padding: 10px 5px 0px 5px;
  width: 98%;
}
.article .time{
  color: #aaa;
}
.article .connection{
  margin-left: 10px;
  padding: 5px;
}
.article .t{
  font-size: 15px;
}
.article .qq{
  line-height: 30px;
  color: #999;
}
.article .wechat{
  width: 100px;
}
.letter_text{
  padding-left: 15px;
  float: left;
  line-height: 2;
}
.no_warm{
  margin: 20px;
  color: gray;
  float: left;
}
</style>
