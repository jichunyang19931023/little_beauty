<template>
  <div id="blog_body">
    <h1>
      <Breadcrumb>
        <BreadcrumbItem to="/">Home</BreadcrumbItem>
        <BreadcrumbItem>博客详情</BreadcrumbItem>
      </Breadcrumb>
    </h1>
    <div class="article floatL">
        <span class="title">{{article.title}}</span>
        <div class="items">
          <span>{{article.createTimeStr}}</span>
          <router-link :to="{path:'/others',query:{id:article.userId}}" class="my-color">
            <span class="left-dis-24 writer">{{article.username}}</span>
          </router-link>
          <span class="left-dis-24">
            <Icon class="comment-color" type="chatbubble-working"></Icon>
            <span>{{article.commentCount}}</span>
          </span>
          <span class="left-dis-24">
            <Icon class="collect-color" type="star"></Icon>
            <span>{{article.collectCount}}</span>
          </span>
          <span class="floatR left-dis-24 cursor" @click="collectArticle(article.id)">
            <Icon :class="hasCollected? 'collect-color' : 'trash-color'" type="star"></Icon>
            <span v-show="hasCollected">已收藏</span>
            <span v-show="!hasCollected">收藏</span>
          </span>
          <span v-if="canEdit" class="floatR left-dis-24 cursor" @click="delArticle(article.id)">
            <Icon class="trash-color" type="trash-b"></Icon>
            <span>删除</span>
          </span>
          <span v-if="canEdit" class="floatR cursor"  @click="editArticle(article.id)">
            <Icon class="edit-color" type="edit"></Icon>
            <span>编辑</span>
          </span>
          <!-- <span class="floatR cursor"  @click="downloadArticle(article.id)">
            <Icon class="edit-color" type="edit"></Icon>
            <span>导出</span>
          </span> -->
        </div>
        <p ref="article" class="floatL content" v-html="article.content"></p>
        <div v-if="article.content == 0">等等我~我正在加载~</div>
    </div>
    <div class="comments floatL">
      <span class="commentTitie">评论</span>
      <ul v-if="comments.length > 0">
        <li v-for="com in comments" class="commentInfo">
          <p class="info">
            <img class="commentImg floatL" :src="com.image">
            <span class="floatL username">{{com.name}}</span>
            <span class="floatL commentTime">{{com.createTimeStr}}</span>
            <a @click="reply(com.id, com.name)" class="floatR commentReply">回复</a>
          </p>
          <p class="commentsMsg">{{com.comments}}</p>
          <ul  class="subList">
            <li v-for="subcom in com.subComment">
              <p>
                <img class="commentImg floatL" :src="subcom.image">
                <span class="floatL username">{{subcom.name}}</span>
                <span class="floatL re">回复</span>
                <span class="floatL username">{{com.name}}：</span>
                <span class="floatR commentTime">{{subcom.createTimeStr}}</span>
              </p>
              <p class="info commentsMsg">{{subcom.comments}}</p>
            </li>
          </ul>
          <div style="clear:both;"></div>
        </li>
      </ul>
      <p class="floatL replyPerson" v-if="commentor !=''">回复&nbsp;&nbsp;{{this.commentor}}：</p>
      <Input v-model="commentsContent" placeholder="在这里留下评论吧~" type="textarea" :autosize="{minRows: 6}" class="writeComments"></Input>
      <Button type="ghost" shape="circle" class="floatR commentButton" @click="addComment(article.id)">评论</Button>
    </div>
  </div>
</template>

<script>
import { saveAs } from 'file-saver';
import { Article } from "../../service/article.js";
import { Auth } from "../../service/auth.js";
export default {
        name:'HelloWorld',
        data() {
            return {
                article: {},
                hasCollected:false,
                user:{},
                comments:[],
                commentsContent:"",
                parentId:0,
                commentor:"",
                canEdit: false
            }
        },
        beforeMount: function() {
            this.loadArticle();
        },
        methods: {
            loadInfo: function(id) {
              var username = new Array();
              username = this.getCookie("userInfo").split("-");
              let personId = username[username.length-2];
              let data = {
                 userId: personId
              }
              Auth.getUserInfo(data).then(response => {
                  if (response.data.code == 200) {
                      this.user = response.data.info;
                      let data = {
                          userId: this.user.id*1,
                          relationId:id*1,
                          type:0
                      }
                      Article.checkCollection(data).then(response => {
                          if (response.data.code == 200) {
                              if (response.data.info & response.data.info * 1 > 0) {
                                  this.hasCollected = true;
                              }
                          } else {
                              this.$Message.error(response.data.msg);
                          }
                      });
                      let data2 = {
                        id: id
                      }
                      Article.getArticleById(data2).then(response => {
                          if (response.data.code == 200) {
                              this.article = response.data.info;
                              if (this.article.userId === this.user.id * 1) {
                                  this.canEdit = true;
                              }
                          } else {
                              this.$Message.error(response.data.msg);
                          }
                      });
                  }
              });
          },
            loadArticle: function() {
              var id = this.$route.query.id;
              this.loadInfo(id);
              this.loadComments(id);
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
            collectArticle: function(id) {
              var param = new URLSearchParams();
              if (this.hasCollected) {
                this.delCollection(id);
                return;
              }
              param.append('userId',this.user.id*1);
              param.append('relationId',id*1);
              param.append('type', 0);
              Article.addCollection(param).then(response => {
                  if (response.data.code == 200) {
                      this.hasCollected = true;
                      this.$Message.info("收藏成功！");
                      this.article.collectCount++;
                  } else {
                      this.$Message.error(response.data.msg);
                  }
              });
            },
            delCollection : function(id){
              var param = new URLSearchParams();
              param.append('userId',this.user.id*1);
              param.append('relationId',id*1);
              param.append('type', 0);
              Article.delCollection(param).then(response => {
                  if (response.data.code == 200) {
                      this.hasCollected = false;
                      this.$Message.info("取消收藏成功！");
                      this.article.collectCount--;
                  } else {
                      this.$Message.error(response.data.msg);
                  }
              });
            },
            loadComments: function(id) {
              let data = {
                articleId: id
              }
              Article.loadComments(data).then(response => {
                  if (response.data.code == 200) {
                        var comments = response.data.info;
                        comments.forEach(function(item){
                          if (item.parentId != 0) {
                            for(var i=0;i<comments.length;i++){
                              var it = comments[i];
                              if (!it.subComment) {
                                it.subComment = [];
                              }
                              if (item.parentId == it.id) {
                                it.subComment.push(item);
                              }
                            }
                          }
                        });
                        comments = comments.filter(function(ele,index,array){
                            if(ele.parentId == 0){
                                return true;
                            }
                            return false;
                        });
                        this.comments = [];
                        this.comments = comments;
                  } else {
                        this.$Message.error(response.data.msg);
                  }
              });
            },
            addComment : function(id){
              if (this.commentsContent == "") {
                this.$Message.error("评论内容不能为空！");
                return;
              }
              var param = new URLSearchParams();
              param.append('userId',this.user.id*1);
              param.append('articleId',id*1);
              param.append('comments',this.commentsContent);
              param.append('parentId',this.parentId);
              Article.addComments(param).then(response => {
                  if (response.data.code == 200) {
                        this.commentsContent = "";
                        this.parentId = 0;
                        this.commentor = "";
                        var comments = response.data.info;

                        comments.forEach(function(item){
                          if (item.parentId != 0) {
                            for(var i=0;i<comments.length;i++){
                              var it = comments[i];
                              if (!it.subComment) {
                                it.subComment = [];
                              }
                              if (item.parentId == it.id) {
                                it.subComment.push(item);
                              }
                            }
                          }
                        });
                        comments = comments.filter(function(ele,index,array){
                            if(ele.parentId == 0){
                                return true;
                            }
                            return false;
                        });
                        this.comments = [];
                        this.comments = comments;
                        this.article.commentCount++;
                  } else {
                        this.$Message.error(response.data.msg);
                  }
              });
            },
            reply : function(commentId, commentUser){
              this.parentId = commentId;
              this.commentor = commentUser;
            },
            downloadArticle: function(){
              var FileSaver = require('file-saver');
              var html = "<html>" + this.$refs.article.innerHTML + "</html>";
              var param = new URLSearchParams();
              param.append('html', html);
              this.$axios({
                method: 'post',
                url: '/api/webapi/article/html',
                data:param
              }).then((response) =>{
                  const _static = {
                    mhtml: {
                      top: "Mime-Version: 1.0\nContent-Base: " + location.href + "\nContent-Type: Multipart/related; boundary=\"NEXT.ITEM-BOUNDARY\";type=\"text/html\"\n\n--NEXT.ITEM-BOUNDARY\nContent-Type: text/html; charset=\"utf-8\"\nContent-Location: " + location.href + "\n\n<!DOCTYPE html>\n<html>\n_html_</html>",
                      head: "<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n<style>\n_styles_\n</style>\n</head>\n",
                      body: "<body>_body_</body>"
                    }
                  };
                  const dealhtml = response.data.html;
                  const img = response.data.pics;
                  let mhtmlBottom = "\n";
                  for (let i = 0; i < img.length; i++) {
                    const uri = img[i].src;
                    const index = img[i].index;
                    mhtmlBottom += "--NEXT.ITEM-BOUNDARY\n";
                    mhtmlBottom += "Content-Location: " + index + "\n";
                    mhtmlBottom += "Content-Type: " + uri.substring(uri.indexOf(":") + 1, uri.indexOf(";")) + "\n";
                    mhtmlBottom += "Content-Transfer-Encoding: " + uri.substring(uri.indexOf(";") + 1, uri.indexOf(",")) + "\n\n";
                    mhtmlBottom += uri.substring(uri.indexOf(",") + 1) + "\n\n";
                  }
                  mhtmlBottom += "--NEXT.ITEM-BOUNDARY--";
                  // 整合html代码片段
                  const fileContent = _static.mhtml.top.replace("_html_",  _static.mhtml.body.replace("_body_", dealhtml)) + mhtmlBottom;
                  // 导出
                  const blob = new Blob([fileContent], {type: "application/msword;charset=utf-8"});
                  saveAs(blob, `testImage.doc`);
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
<style scoped>
.article{
  width: 100%;
  padding-bottom: 25px;
  border-bottom: 1px solid #ccc;
}
.title{
  font-size: 20px;
  font-weight: 700;
  padding: 5px 0;
}
.operate{
  float: right;
  font-size: 19px;
}
.items{
  margin:10px 0 5px 0;
  border-bottom: 1px dotted #ccc;
  padding: 10px 0;
  color: #aaa;
}
.content{
  padding: 10px 10px 10px 0;
  font-size: 15px;
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
.edit-color,.trash-color{
  color: #bbb;
}
.cursor{
  cursor: pointer;
}
.comments{
  width: 100%;
  margin-top: 30px;
  border-radius: 5px;
  border-left: 2px solid #fcecf0;
  border-bottom: 2px solid #fcecf0;
  border-right: 2px solid #fcecf0;
}
.commentTitie{
  font-size: 16px;
  background: #fcecf0;
  padding: 5px 10px;
  width: 100%;
  color: #ed7f98;
  font-weight: 700;
  display: inline-block;
  border-radius: 5px 5px 0 0;
}
.writeComments{
  margin: 1.5%;
  width: 97%;
}
.commentButton{
  margin: 0px 20px 8px;
}
.commentImg{
  width: 30px;
  border-radius: 5px;
  margin: 10px;
}
.info{
  width: 100%;
  display: inline-block;
}
.username{
  margin-top: 15px;
  font-weight: 700;
}
.commentTime,.commentReply{
  margin: 15px;
}
.commentReply{
  color:#ed7f98;
}
.commentInfo{
  padding: 0px 0px 10px 10px;
  border-bottom: 1px solid #fcecf0;
}
.replyPerson{
  margin: 15px 15px 0 15px;
}
.re{
  margin: 15px 10px;
}
.commentsMsg{
  padding-left: 50px;
}
.subList{
  margin-top: 15px;
  margin-left: 40px;
}
.writer{
  color: #6cbb93;
}
</style>
