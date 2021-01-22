<template>
  <div>
    <div class="new_movies">
      <div class="title">
        <span><Icon type="bowtie" />&nbsp;看个电影</span>
      </div>
      <ul>
          <li class="movie" v-for="movie in movieList">
            <router-link :to="{path:'/moviePage',query:{id:movie.id}}" class="my-color">
              <img :src="movie.imagePath">
              <span class="t">{{movie.movieName}}</span>
              <br><span class="movie-abs">{{movie.introduction}}</span>
            </router-link>
          </li>
          <div class="loading">
            <Spin v-if="movieLoading">
              <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
              <div>等等我·····</div>
            </Spin>
          </div>
      </ul>
    </div>
  </div>
</template>

<script>
import { Movie } from "../service/movie.js";
export default {
        name:'HelloWorld',
        data() {
            return {
                movieList: [],
                arr : [],
                movieLoading: true
            }
        },
        beforeMount: function() {
            var cookieMsg = this.getCookie("userInfo");
            var username = new Array();
            username = cookieMsg.split("-");
            var login = username[username.length-1];
            if (login != "") {
              this.loadMovies();
            }else{
              this.$router.push('/login/1');
            }
        },
        methods: {
            loadMovies: function() {
                let data = {
                  pageNum: 1,
                  pageSize: 10
                }
                Movie.loadMovies({data}).then(res => {
                  if (res.data.code == 200) {
                        var movies = res.data.info.records;
                        movies.forEach(function(item){
                          item.movieName = item.movieName.substr(0,22);
                          item.imagePath = "/api/webapi/article/downloadFile?fileUrl=" + item.imagePath;
                          item.introduction = item.introduction.substr(0,150) + "...";
                        });
                        this.movieList = movies;
                  }
                  this.movieLoading = false;
                });
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .common-content{
    margin: 20px 150px;
  }
</style>
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
.new_movies,.movies{
    width: 100%;
    float: left;
    padding: 0 25px;
}
.new_movies .title,.movies .title{
  padding: 8px 10px;
  border-bottom: 1px dashed #ec5d80;
  font-size: 16px;
  color: #ec5d80 !important;
}
.new_movies .movie,.movies .movie{
  padding: 10px 5px;
  width: 100%;
}
.movie .time,.title .more{
  float: right;
  color: #aaa !important;
}
.movie .t{
  font-size: 16px;
  color: #48484c;
  font-weight: 700;
}
.movie .abs{
  margin: 8px 0;
  line-height: 23px;
  height: 57px;
  overflow: hidden;
  width: 100%;
}

.movie .writer{
  color: #ec5d80;
}
.movie img{
  float: left;
  width: 15%;
  height: 120px;
  margin: 2px 2% 2px 0;
}
.movie span{
  float: left;
  max-width: 83%;
}
.my-color{
  color: #666 !important;
}
.movie-abs {
    margin: 8px 0;
    line-height: 23px;
    height: 87px;
    overflow: hidden;
    width: 100%;
}
</style>
