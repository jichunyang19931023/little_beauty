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
          <span class="left-dis-24">{{article.username}}</span>
          <span class="left-dis-24">
            <Icon class="comment-color" type="chatbubble-working"></Icon>
            <span>{{article.commentCount}}</span>
          </span>
          <span class="left-dis-24">
            <Icon class="collect-color" type="star"></Icon>
            <span>{{article.collectCount}}</span>
          </span>
          <span class="left-dis-24">
            <Icon class="like-color" type="heart"></Icon>
            <span>1</span>
          </span>
          <span class="floatR left-dis-24 cursor" @click="collectArticle(article.id)">
            <Icon :class="hasCollected? 'collect-color' : 'trash-color'" type="star"></Icon>
            <span v-show="hasCollected">已收藏</span>
            <span v-show="!hasCollected">收藏</span>
          </span>
          <span class="floatR left-dis-24 cursor" @click="delArticle(article.id)">
            <Icon class="trash-color" type="trash-b"></Icon>
            <span>删除</span>
          </span>
          <span class="floatR cursor"  @click="editArticle(article.id)">
            <Icon class="edit-color" type="edit"></Icon>
            <span>编辑</span>
          </span>
        </div>
        <p class="floatL content" v-html="article.content"></p>
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
      <textarea class="writeComments" placeholder="在这里留下评论吧~" v-model="commentsContent"></textarea>
      <Button type="ghost" shape="circle" class="floatR commentButton" @click="addComment(article.id)">评论</Button>
    </div>
  </div>
</template>

<script>
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
                commentor:""
            }
        },
        beforeMount: function() {
            this.loadArticle();
        },
        methods: {
            loadInfo: function(id) {
                this.$axios.get('/api/webapi/user/getUserInfo', {}).then((response) =>{
                    if (response.data.code == 200) {
                        this.user = response.data.info;
                        this.$axios.get('/api/webapi/auth/collection/checkCollection', {
                          params: {
                            userId: this.user.id*1,
                            relationId:id*1,
                            type:0
                          }
                        }).then((response) =>{
                              if (response.data.code == 200) {
                                if (response.data.info & response.data.info*1 > 0) {
                                  this.hasCollected = true;
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
              this.$axios.get('/api/webapi/auth/article/getArticleById', {
                params: {
                  id: id
                }
              }).then((response) =>{
                    if (response.data.code == 200) {
                        this.article = response.data.info;

                    } else {
                        this.$Message.error(response.data.msg);
                    }
              });
            },
            editArticle: function(id) {
              this.$router.push('/newBlog?id='+id);
            },
            delArticle: function(id) {
              this.$axios.get('/api/webapi/auth/article/delArticle', {
                params: {
                  id: id
                }
              }).then((response) =>{
                    if (response.data.code == 200) {
                        this.$router.push('/blogList');
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
              this.$axios({
                method: 'post',
                url: '/api/webapi/auth/collection/addCollection',
                data:param
              }).then((response) =>{
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
              this.$axios({
                method: 'post',
                url: '/api/webapi/auth/collection/delCollection',
                data:param
              }).then((response) =>{
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
              this.$axios.get('/api/webapi/auth/comments/list', {
                params: {
                  articleId: id
                }
              }).then((response) =>{
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
              this.$axios({
                method: 'post',
                url: '/api/webapi/auth/comments/addComments',
                data:param
              }).then((response) =>{
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
            }
        }
    }
</script>

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
  width: 96%;
  height: 100px;
  margin: 10px 2% 5px 2%;
  padding: 5px;
  border:1px solid #f7b7c7;
  border-radius: 5px;
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
</style>
