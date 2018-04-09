<template>
  <div>
    <div class="new_articles">
      <div class="title">
        <span><Icon type="heart" />&nbsp;最新文章</span>
        <span class="more">more</span>
      </div>
      <ul>
        <li class="article" v-for="article in articleList">
          <img src="../assets/warm_pic.jpg">
          <span class="t">{{article.title}}</span>
          <br><span class="abs">{{article.abs}}</span>
          <br><span class="writer">{{article.user.name}}</span>
          <span class="time">{{article.createTimeStr}}</span>
        </li>
      </ul>
    </div>

    <div class="hot_articles">
     <div class="title"><span><Icon type="bowtie" />&nbsp;热门文章</span></div>
     <ul>
        <li class="article" v-for="article in articleList">
          <img src="../assets/warm_pic.jpg">
          <span class="t">{{article.title}}</span>
          <br><span class="abs">{{article.abs}}</span>
          <br><span class="writer">{{article.user.name}}</span>
          <span class="time">{{article.createTimeStr}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export
default {
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
                this.$axios.get('/api/article/list', {}).then((response) =>{
                    if (response.data.code == 200) {
                        var articles = response.data.info;
                        articles.forEach(function(item){
                          item.title = item.title.substr(0,10);
                          item.abs = item.abs.substr(0,50)+"...";
                        });
                        this.articleList = articles;
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
  margin: 0 10px;
}
a {
  color: #42b983;
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
  color: #ec5d80;
}
.new_articles .article,.hot_articles .article{
  padding: 10px 5px;
  width: 98%;
}
.article .time,.title .more{
  float: right;
  color: #aaa;
}
.article .t{
  font-size: 16px;
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
  width: 110px;
  height: 110px;
}
.article span{
  float: left;
  max-width: 75%;
}
</style>
