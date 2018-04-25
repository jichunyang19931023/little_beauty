<template>
  <div>
    <div class="new_articles">
      <div class="title">
        <span><Icon type="heart" />&nbsp;最新文章</span>
        <span class="more">more</span>
      </div>
      <ul>
          <li class="article" v-for="article in articleList">
            <router-link :to="{path:'/BlogPage',query:{id:article.id}}" class="my-color" target="_blank">
              <img :src="article.imageThumb">
              <span class="t">{{article.title}}</span>
              <br><span class="abs">{{article.abs}}</span>
              <br><span class="writer">{{article.user.name}}</span>
              <span class="time">{{article.createTimeStr}}</span>
            </router-link>
          </li>
      </ul>
    </div>

    <div class="hot_articles">
     <div class="title"><span><Icon type="bowtie" />&nbsp;热门文章</span></div>
     <ul>
        <li class="article" v-for="article in articleList">
          <router-link :to="{path:'/BlogPage',query:{id:article.id}}"  class="my-color" target="_blank">
            <img :src="article.imageThumb">
            <span class="t">{{article.title}}</span>
            <br><span class="abs">{{article.abs}}</span>
            <br><span class="writer">{{article.user.name}}</span>
            <span class="time">{{article.createTimeStr}}</span>
          </router-link>
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
                this.$axios.get('/api/article/list', {}).then((response) =>{
                    if (response.data.code == 200) {
                        var articles = response.data.info;
                        articles.forEach(function(item){
                          item.title = item.title.substr(0,20);
                          if (!item.imageThumb) {
                            item.imageThumb = "";
                          }
                        });
                        this.articleList = articles;
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
.new_articles,.hot_articles{
    width: 49%;
    float: left;
}
.hot_articles{
  margin-left: 2%;
}
.new_articles .title,.hot_articles .title{
  padding: 8px 10px;
  border-bottom: 1px dashed #ec5d80;
  font-size: 16px;
  color: #ec5d80 !important;
}
.new_articles .article,.hot_articles .article{
  padding: 10px 5px;
  width: 100%;
}
.article .time,.title .more{
  float: right;
  color: #aaa !important;
}
.article .t{
  font-size: 16px;
  color: #48484c;
  font-weight: 700;
}
.article .abs{
  margin: 8px 0;
  line-height: 23px;
}
.article .writer{
  color: #ec5d80;
}
.article img{
  float: left;
  width: 25%;
  height: 120px;
  margin: 2px 7px 2px 0;
}
.article span{
  float: left;
  max-width: 73%;
}
.my-color{
  color: #666 !important;
}
</style>
