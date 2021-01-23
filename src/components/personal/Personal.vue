<template>
  <div>
    <div class="new_articles">
      <div class="title">
        <span><Icon type="heart" />&nbsp;个人中心</span>
        <span class="floatR personInfo" @click="changeInfo()">修改资料</span>
        <Modal
              v-model="modal"
              title="修改资料"
              @on-ok="ok">
              <Form :model="formItem" :label-width="80">
                <FormItem label="头像">
                  <img :src="formItem.image" class="image">
                  <Button type="ghost" shape="circle" class="upload-button">修改头像</Button>
                  <input type="file" v-on:change="upload" class="upload-image" />
                </FormItem>
                <FormItem label="用户名">
                    <Input v-model="formItem.name" readonly></Input>
                </FormItem>
                <FormItem label="邮箱">
                    <Input v-model="formItem.mail" placeholder="Enter something..."></Input>
                </FormItem>
                <FormItem label="性别">
                    <RadioGroup v-model="formItem.sex">
                        <Radio class="sex" label="girl">女</Radio>
                        <Radio class="sex" label="boy">男</Radio>
                        <Radio class="sex" label="secret">保密</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="个人签名">
                    <Input v-model="formItem.text" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="输入个人签名..."></Input>
                </FormItem>
            </Form>
        </Modal>
      </div>
      <ul>
          <li class="article">
              <img :src="user.image" class="image">
              <div class="info">
                <span class="name">{{user.name}}</span>
                <br/><span class="mail">邮箱：{{user.mail}}</span>
                <span class="create_time">注册时间：{{user.createTime}}</span>
                <span class="create_time">性别：{{user.sexStr}}</span>
              </div>
              <div class="msg-info">
                <span class="msg">个人签名：{{user.msg?user.msg:'这个小朋友还没来得及写个人签名呢~'}}</span>
              </div>
              <div class="tabs">
                <Tabs @on-click="loadTabList">
                    <TabPane label="我的日常" name="blogs">
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
                                    <div class=" floatL left-dis-24">
                                      <Icon class="like-color" type="heart"></Icon>
                                      <span>0</span>
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
                      </ul>
                    </TabPane>
                    <TabPane label="日常收藏" name="collections">
                        <ul class="myblog floatL">
                        <li class="blog-unit2" v-for="collection in collectionList">
                          <router-link :to="{path:'/blogPage',query:{id:collection.relationId}}" target="_blank">
                            <h3 class="blog-title bottom-dis-8">{{collection.title}}</h3>
                            <p class="text bottom-dis-8">{{collection.abs}}</p>
                          </router-link>
                        </li>
                      </ul>
                    </TabPane>
                    <TabPane label="电影收藏" name="movieCollections">
                        <ul class="myblog floatL">
                        <li class="blog-unit2"  v-for="movieCollection in movieCollectionList">
                          <router-link :to="{path:'/moviePage',query:{id:movieCollection.relationId}}" target="_blank">
                            <h3 class="blog-title bottom-dis-8">{{movieCollection.movieName}}</h3>
                            <p class="text bottom-dis-8">{{movieCollection.introduction}}</p>
                          </router-link>
                        </li>
                      </ul>
                    </TabPane>
                    <TabPane label="我的评论" name="comments">
                        <ul class="myblog floatL">
                        <li class="blog-unit3"  v-for="comment in commentsList">
                          <span class="username">{{comment.name}}</span>&nbsp;{{comment.commentMsg}}
                          <router-link class="floatR" :to="{path:'/blogPage',query:{id:comment.relationId}}" target="_blank">
                            查看详情
                          </router-link>
                          <span class="floatR time">{{comment.createTimeStr}}</span>

                          <p class="commentMsg">{{comment.comments}}</p>
                        </li>
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
                articleList:{},
                modal: false,
                formItem: {
                    name: '',
                    mail: '',
                    sex: 'girl',
                    text: '',
                    image:"",
                    config:config
                },
                collectionList:[],
                movieCollectionList: [],
                commentsList:[]
            }
        },
        beforeMount: function() {
            var cookieMsg = this.getCookie("userInfo");
            var username = new Array();
            username = cookieMsg.split("-");
            var login = username[username.length-1];
            if (login != "") {
              this.loadInfo();
              this.loadArticles();
            }else{
              this.$router.push('/login/1');
            }
        },
        methods: {
            loadInfo: function() {
                Auth.getUserInfo({}).then(response => {
                    if (response.data.code == 200) {
                        this.user = response.data.info;
                    }
                });
            },
            loadArticles: function() {
              var cookieMsg = this.getCookie("userInfo");
              var username = new Array();
              username = cookieMsg.split("-");
              var personId = username[username.length-2];
              let data = {
                  personId: personId
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
            loadComments: function() {
              let data = {
                articleUserId: this.user.id
              }
              Article.loadComments(data).then(response => {
                  if (response.data.code == 200) {
                        this.commentsList = response.data.info;
                        this.commentsList.forEach(function(item){
                          item.commentMsg = "评论了我的博客：" + item.title;
                          if (item.parentId != 0) {
                            item.commentMsg = "回复了我：";
                          }
                        });
                  } else {
                        this.$Message.error(response.data.msg);
                  }
              });
            },
            editArticle: function(id) {
              this.$router.push('/newBlog?id='+id);
            },
            delArticle: function(id) {
              let data = {
                id: id
              }
              Article.delArticle(data).then(response => {
                  if (response.data.code == 200) {
                      this.$router.push('/blogList');
                  } else {
                      this.$Message.error(response.data.msg);
                  }
              });
            },
            changeInfo:function(){
              this.loadInfo();
              this.modal = true;
              this.formItem.name = this.user.name;
              this.formItem.mail = this.user.mail;
              this.formItem.sex = 'secret';
              if(this.user.sex == 0){
                this.formItem.sex = 'girl';
              }else if(this.user.sex == 1){
                this.formItem.sex = 'boy';
              }
              this.formItem.text = this.user.msg;
              this.formItem.image = this.user.image;
            },
            changeImage:function(){

            },
            upload(e){
              var files = e.target.files;
              if (files.length > 0) {
                this.loadImage = true;
                var formData = new FormData();
                formData.append("image",files[0]);
                formData.append("isAvatar",true);
                Article.uploadImg(formData).then(response => {
                  if (response.data.code == 200) {
                      this.formItem.image = config.base_path + "/api/webapi/article/downloadFile?fileUrl=" + response.data.info.filePath;
                  }
                });
              }
            },
            ok:function() {
              var param = new URLSearchParams()
              param.append('id',this.user.id);
              param.append('image',this.formItem.image);
              param.append('name',this.formItem.name);
              param.append('mail',this.formItem.mail? this.formItem.mail:"");
              var sex = 2;
              if(this.formItem.sex=='girl'){
                sex = 0;
              }else if(this.formItem.sex=='boy'){
                sex = 1;
              }
              param.append('sex',sex);
              param.append('msg',this.formItem.text?this.formItem.text:"");
              Auth.editUser(param).then(response => {
                  if (response.data.code == 200) {
                        this.loadInfo();
                        this.$emit("userchange",this.formItem);
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
              }else if (name == "comments") {
                this.loadComments();
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
    width: 85%;
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
  width: 80px;
  height: 80px;
  border-radius: 10px;
  margin: 2px 7px 2px 0;
}
.personInfo{
  color: #c3c0bb;
  font-size: 14px;
  cursor: pointer;
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
.upload-image{
  position: absolute;
  left: 100px;
  top: 32px;
  width: 100px;
  opacity: 0;
}
.upload-button{
  margin-top: 32px;
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
}
</style>
