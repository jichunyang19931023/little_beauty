<template>
  <div id="blog_body">
    <h1>
      <Breadcrumb>
        <BreadcrumbItem to="/">Home</BreadcrumbItem>
        <BreadcrumbItem>我的博客</BreadcrumbItem>
      </Breadcrumb>
      <router-link to="/newBlog" class="new-blog">
        <Icon type="ios-nutrition" class="carrot"></Icon>&nbsp;写博客
      </router-link>
    </h1>
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
    <div class="new_articles floatL">
      <div class="title">
        <span><Icon type="heart" />&nbsp;最新文章</span>
      </div>
      <ul>
        <li class="article floatL" v-for="article in articleList">
          <router-link :to="{path:'/blogPage',query:{id:article.id}}" target="_blank">
            <span class="t">{{article.title}}</span>
            <span class="time">{{article.createTimeStr}}</span>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="new_articles floatL">
      <div class="title">
        <span><Icon type="heart" />&nbsp;联系我们</span>
      </div>
      <ul>
        <li class="article floatL">
          <img class="wechat floatL" src="../../assets/images/wechat.jpg">
          <div class="connection floatL">
            <span class="t">可扫描二维码联系开发人员</span></br>
            <span class="qq">QQ：878147364</span></br>
            <span class="qq">邮箱：878147364@qq.com</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
        name:'HelloWorld',
        data() {
            return {
                articleList: []
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
              this.$axios.get('/api/webapi/auth/article/list', {
                params: {
                  personId : personId
                }
              }).then((response) =>{
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
.blog-unit{
    margin-left: 24px;
    margin-right: 24px;
    border-bottom: 1px dashed #e9e9e9;
    padding-top: 16px;
    height: 140px;
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
    margin-bottom: 50px;
}
.new_articles .title{
  padding: 8px 10px;
  border-bottom: 1px dashed #ec5d80;
  font-size: 16px;
  color: #ec5d80;
}
.new_articles .article{
  padding: 7px 5px 0px 5px;
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
</style>
