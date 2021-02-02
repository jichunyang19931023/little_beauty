<template>
  <div>
    <div class="new_articles">
      <div class="title">
        <span><Icon type="heart" />&nbsp;日常小温暖</span>
      </div>
      <ul>
          <li class="article" v-for="article in articleList">
            <router-link :to="{path:'/blogPage',query:{id:article.id}}" class="my-color">
              <img :src="article.imageThumb">
              <span class="t">{{article.title}}</span>
              <span class="abs">{{article.abs}}</span>
              <div class="bottom_line">
                <span class="time">{{article.createTimeStr}}</span>
                <span class="writer">{{article.username}}</span>
              </div>
            </router-link>
          </li>
          <div class="loading">
            <Spin v-if="articleLoading">
              <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
              <div>等等我·····</div>
            </Spin>
          </div>
      </ul>
    </div>
  </div>
</template>

<script>
import { Article } from "../service/article.js";
export default {
        name:'HelloWorld',
        data() {
            return {
                articleList: [],
                arr : [],
                articleLoading: true
            }
        },
        beforeMount: function() {
            var cookieMsg = this.getCookie("userInfo");
            var username = new Array();
            username = cookieMsg.split("-");
            var login = username[username.length-1];
            if (login != "") {
              this.loadArticles();
            }else{
              this.$router.push('/login/1');
            }
        },
        methods: {
            loadArticles: function() {
                let data = {
                  pageNum: 1,
                  pageSize: 10
                };
                Article.loadArticles(data).then(res => {
                  this.articleLoading = false;
                  if (res.data.code == 200) {
                        var articles = res.data.info.records;
                        articles.forEach(function(item){
                          item.title = item.title.substr(0,20);
                        });
                        this.articleList = articles;
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
  border-bottom: 1px solid #ece7e7;
}
a {
  color: #42b983 !important;
}
.bottom_line{
  float: left;
  width: 80%;
}
.new_articles,.movies{
    width: 100%;
    float: left;
    padding: 0 25px;
}
.new_articles .title,.movies .title{
  padding: 8px 10px;
  border-bottom: 1px dashed #ec5d80;
  font-size: 16px;
  color: #ec5d80 !important;
}
.new_articles .article,.movies .article{
  padding: 10px 5px;
  width: 100%;
}
.article .time{
  float: left;
  color: #aaa !important;
}
.article .t{
  margin-top: 10px;
  font-size: 16px;
  color: #48484c;
  font-weight: 700;
  width: 100%;
}
.article .abs{
  margin: 8px 0;
  line-height: 23px;
  height: 23px;
  overflow: hidden;
  width: 100%;
}

.article .writer{
  color: #ec5d80;
  float: left;
  margin-left: 10px;
}
.article img{
  float: left;
  width: 11%;
  height: 100px;
  margin: 2px 2% 2px 0;
}
.article span{
  float: left;
  max-width: 80%;
}
.my-color{
  color: #666 !important;
}
</style>
