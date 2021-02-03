<template>
  <div>
    <div class="new_articles">
      <div class="title">
        <span><Icon type="heart" />&nbsp;Ta 的小角落</span>
      </div>
      <ul>
          <li class="article">
              <img :src="user.image" class="image">
              <div class="info">
                <span class="name">{{user.name}}</span>
                <br/><span class="mail">邮箱：{{user.mail?user.mail:"暂无"}}</span>
                <span class="create_time">注册时间：{{user.createTime}}</span>
                <span class="create_time">性别：{{user.sexStr}}</span>
              </div>
              <div class="msg-info">
                <span class="msg">签名：{{user.msg?user.msg:"这个小朋友还没来得及写签名呢~"}}</span>
              </div>
              <div class="tabs">
                <Tabs @on-click="loadTabList">
                    <TabPane label="Ta 的小温暖" name="blogs">
                      <ul class="myblog floatL">
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
                        </li>
                        <div v-if="articleList.length == 0" class="no_data">暂无数据</div>
                      </ul>
                    </TabPane>
                    <TabPane label="Ta 收藏的小温暖" name="collections">
                        <ul class="myblog floatL">
                        <li class="blog-unit2" v-for="collection in collectionList">
                          <router-link :to="{path:'/blogPage',query:{id:collection.relationId}}" target="_blank">
                            <h3 class="blog-title bottom-dis-8">{{collection.title}}</h3>
                            <p class="text bottom-dis-8">{{collection.abs}}</p>
                          </router-link>
                        </li>
                        <div v-if="collectionList.length == 0" class="no_data">暂无数据</div>
                      </ul>
                    </TabPane>
                    <TabPane label="Ta 喜欢的电影" name="movieCollections">
                        <ul class="myblog floatL">
                        <li class="blog-unit2"  v-for="movieCollection in movieCollectionList">
                          <router-link :to="{path:'/moviePage',query:{id:movieCollection.relationId}}" target="_blank">
                            <h3 class="blog-title bottom-dis-8">{{movieCollection.movieName}}</h3>
                            <p class="text bottom-dis-8">{{movieCollection.introduction}}</p>
                          </router-link>
                        </li>
                        <div v-if="movieCollectionList.length == 0" class="no_data">暂无数据</div>
                      </ul>
                    </TabPane>
                </Tabs>
              </div>
          </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Auth } from "../../service/auth.js";
import { Article } from "../../service/article.js";
import config from "../../../config/global"
export default {
        name:'HelloWorld',
        data() {
            return {
                user: {},
                personId:"",
                articleList:{},
                collectionList:[],
                movieCollectionList: []
            }
        },
        beforeMount: function() {
            this.personId = this.$route.query.id;
            this.loadInfo();
            this.loadArticles();
        },
        methods: {
            loadInfo: function() {
                let data = {
                  userId: this.personId
                }
                Auth.getUserInfo(data).then(response => {
                    if (response.data.code == 200) {
                        this.user = response.data.info;
                    }
                });
            },
            loadArticles: function() {
              let data = {
                  personId: this.personId
              };
              Article.loadArticles(data).then(response => {
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
            loadTabList:function(name){
              console.log(name);
              if (name == "blogs") {
                this.loadArticles();
              }else if (name == "collections") {
                this.getCollections();
              }else if(name == "movieCollections"){
                this.getMovieCollection();
              }
            },
            getCollections:function(){
              let data = {
                userId: this.user.id,
                type: 0
              }
              Article.collectionList(data).then(response => {
                 if (response.data.code == 200) {
                    this.collectionList = response.data.info;
                 } else {
                    this.$Message.error(response.data.msg);
                 }
              });
            },
            getMovieCollection:function(){
              let data = {
                userId: this.user.id,
                type: 1
              }
              Article.collectionList(data).then(response => {
                 if (response.data.code == 200) {
                    this.movieCollectionList = response.data.info;
                 } else {
                    this.$Message.error(response.data.msg);
                 }
              });
            }
        }
    }
</script>
<style>
  .common-content{
    margin: 20px 150px;
  }
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
}
a {
  color: #42b983 !important;
}
.new_articles{
    width: 95%;
    margin: 0 auto;
}

.title{
  padding: 8px 10px;
  border-bottom: 1px dashed #ec5d80;
  font-size: 16px;
  color: #ec5d80 !important;
}
.article{
  padding: 10px 5px;
  width: 100%;
}
.info{
  float: left;
  margin-left: 10px;
}
.name{
  font-size: 22px;
  color: #48484c;
}
.mail,.create_time{
  font-size: 16px;
  float: left;
  margin-right: 50px;
  padding: 10px 0;
}
.msg{
  font-size: 16px;
  display: block;
  color: #949698;
}
.image{
  float: left;
  width: 70px;
  height: 70px;
  border-radius: 10px;
  margin: 2px 7px 2px 0;
}
.personInfo{
  color: #c3c0bb;
  font-size: 14px;
  cursor: pointer;
  margin-left: 10px;
}
.sex{
  font-size: 15px !important;
}
.tabs{
  margin-top: 25px;
  display: block;
  width: 100%;
  float: left;
}
.tabs .nav-text{
  font-size: 15px !important;
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
.myblog{
  width: 100%;
  min-height: 150px;
  overflow: auto;
}
.new-blog{
    float: right;
    margin-right: 30px;
    font-size: 16px;
    font-weight: 200;
    background: #f1b5d3;
    border: 1px solid #fff;
    border-radius: 4px;
    padding: 3px 5px;
    color: #fff;
}
.new-blog:hover{
  color: #fff;
}
.carrot{
  font-size: 20px;
  color: #fff;
}
.blog-unit,.blog-unit2,.blog-unit3{
    width: 100%;
    padding-left: 1%;
    border-bottom: 1px dashed #e9e9e9;
    padding-top: 16px;
}
.blog-unit{
  height: 125px;
}
.blog-unit3{
    height: 80px;
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
.new_articles .title{
  padding: 8px 10px;
  border-bottom: 1px dashed #ec5d80;
  font-size: 16px;
  color: #ec5d80;
}
.article .time{
  color: #aaa;
}
.username{
  font-weight: 600;
}
.commentMsg{
  padding: 5px;
  color: #9b9ea5;
}
.time{
  margin-right: 20px;
}
.msg-info{
    float: left;
    margin-top: 10px;
    width: 100%;
}
.no_data{
    margin-top: 30px;
    text-align: center;
}
</style>
