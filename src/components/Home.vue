<template>
  <div>
    <div class="new_articles">
      <div class="title">
        <span><Icon type="heart" />&nbsp;最新文章</span>
        <span class="more">more</span>
      </div>
      <ul>
          <li class="article" v-for="article in articleList">
            <router-link :to="{path:'/blogPage',query:{id:article.id}}" class="my-color" target="_blank">
              <img :src="article.imageThumb">
              <span class="t">{{article.title}}</span>
              <br><span class="abs">{{article.abs}}</span>
              <br><span class="writer">{{article.username}}</span>
              <span class="time">{{article.createTimeStr}}</span>
            </router-link>
          </li>
      </ul>
    </div>

    <div class="movies">
     <div class="title">
      <span><Icon type="bowtie" />&nbsp;电影推荐</span>
      <span class="more">more</span>
    </div>
     
     <ul>
        <li class="article" v-for="movie in movieList">
          <router-link :to="{path:'/blogPage',query:{id:movie.id}}"  class="my-color" target="_blank">
            <img :src="movie.imagePath">
            <span class="t">{{movie.movieName}}</span>
            <br><span class="movie-abs">{{movie.introduction}}</span>
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
                articleList: [],
                movieList: [],
                arr : []
            }
        },
        beforeMount: function() {
            var cookieMsg = this.getCookie("userInfo");
            var username = new Array();
            username = cookieMsg.split("-");
            var login = username[username.length-1];
            if (login != "") {
              this.loadArticles();
              this.loadMovies();
            }else{
              this.$router.push('/login/1');
            }
        },
        methods: {
            loadArticles: function() {
                this.$axios.get('/api/article/list', {}).then((response) =>{
                    if (response.data.code == 200) {
                        var articles = response.data.info.records;
                        articles.forEach(function(item){
                          item.title = item.title.substr(0,20);
                        });
                        this.articleList = articles;
                    }
                });
            },
            loadMovies: function() {
                this.$axios.get('/api/movie/list', {
                  params: {
                    pageNum: 1
                }
              }).then((response) =>{
                    if (response.data.code == 200) {
                        var movies = response.data.info.records;
                        movies.forEach(function(item){
                          item.movieName = item.movieName.substr(0,22);
                          item.imagePath = "http://127.0.0.1:8080/api/article/downloadFile?fileUrl=" + item.imagePath;
                          item.introduction = item.introduction.substr(0,70) + "...";
                        });
                        this.movieList = movies;
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
.new_articles,.movies{
    width: 49%;
    float: left;
}
.movies{
  margin-left: 2%;
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
  height: 57px;
  overflow: hidden;
  width: 100%;
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
.movie-abs {
    margin: 8px 0;
    line-height: 23px;
    height: 70px;
    overflow: hidden;
    width: 100%;
}
</style>
