<template>
  <div id="blog_body">
    <img class="movie-image" src="../../static/img/movie_back.jpg">
    <div style="min-height: 230px;">
      
    </div>
    <div class="movie floatL">
        <img class="movie-path floatL" :src="movie.imagePath">
        <span class="title floatL">{{movie.movieTitle}}</span>
        <span class="sub-title floatL">{{movie.movieName}}</span>
        <div class="items floatL">
          <span class="item">{{movie.movieAge?movie.movieAge:movie.releaseDate}}</span>
          <span class="item">{{movie.category}}</span>
          <span class="item">{{movie.fileLength}}</span>
          <span class="item-last">{{movie.language}}</span>
          <!-- <span class="left-dis-24">
            <Icon class="collect-color" type="star"></Icon>
            <span>{{movie.collectCount}}</span>
          </span> -->
          <span class="floatR left-dis-24 cursor" @click="collectMovie(movie.id)">
            <Icon :class="hasCollected? 'collect-color' : 'trash-color'" type="star"></Icon>
            <span v-show="hasCollected">已收藏</span>
            <span v-show="!hasCollected">收藏</span>
          </span>
        </div>
        <div class="floatL content">{{movie.introduction}}</div>
    </div>
    <div class="movie-detail">
        <span>影片主演：{{movie.stars}}</span>
        <span>影片导演：{{movie.director}}</span>
        <span>
          原始链接：<a style="color:#ea6187;" :href="movie.movieUrl">{{movie.movieUrl}}</a>
        </span>
        <span>电影评分：
          <span class="movie-stars">{{movie.doubanScore}}</span>
        </span>
        
    </div>
  </div>
</template>

<script>
import { Auth } from "../service/auth.js";
import { Article } from "../service/article.js";
import { Movie } from "../service/movie.js";
export default {
        name:'HelloWorld',
        data() {
            return {
                movie: {},
                hasCollected:false,
                user:{},
                parentId:0
            }
        },
        beforeMount: function() {
            this.loadMovie();
        },
        methods: {
            loadInfo: function(id) {
                Auth.getUserInfo({}).then(res => {
                  if (res.data.code == 200) {
                        this.user = res.data.info;
                        let data = {
                          userId: this.user.id*1,
                          relationId:id*1,
                          type:1
                        }
                        Article.checkCollection({data}).then(response => {
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
            loadMovie: function() {
              var id = this.$route.query.id;
              this.loadInfo(id);
              let data = {
                id: id
              };
              Movie.getMovieById(data).then(response => {
                  if (response.data.code == 200) {
                      this.movie = response.data.info;
                  } else {
                      this.$Message.error(response.data.msg);
                  }
              });
            },
            collectMovie: function(id) {
              var param = new URLSearchParams();
              if (this.hasCollected) {
                this.delCollection(id);
                return;
              }
              param.append('userId',this.user.id*1);
              param.append('relationId',id*1);
              param.append('type', 1);
              Article.addCollection(param).then(response => {
                  if (response.data.code == 200) {
                      this.hasCollected = true;
                      this.$Message.info("收藏成功！");
                  } else {
                      this.$Message.error(response.data.msg);
                  }
              });
            },
            delCollection : function(id){
              var param = new URLSearchParams();
              param.append('userId',this.user.id*1);
              param.append('relationId',id*1);
              param.append('type', 1);
              Article.delCollection(param).then(response => {
                  if (response.data.code == 200) {
                      this.hasCollected = false;
                      this.$Message.info("取消收藏成功！");
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
.movie-image{
    width: 100%;
    margin-bottom: 10px;
    height: 200px;
}
.movie{
  position: absolute;
  top: 130px;
  left: 6.5%;
  width: 91%;
  padding-bottom: 10px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 100px;
}
.movie-path{
  width: 215px;
  height: 309px;
  margin-top: 5px;
}
.title{
  margin-left: 20px;
  font-size: 30px;
  color: #ea6187;
  padding: 5px 0;
}
.sub-title{
  margin-left: 20px;
  font-size: 20px;
  color: #443f40;
  padding: 5px 0;
  display: block;
  width: 73%;
}
.item, .item-last{
  font-size: 16px;
  color: gray;
  padding: 0 12px;
}
.item{
  border-right: 1px solid gray;
}
.movie-detail{
  padding: 20px 45px;
  font-size: 16px;
  color: gray;
}
.movie-detail>span{
  display: block;
  margin-bottom: 10px;
}
.movie-stars{
  color: #d4ac1d;
}
.operate{
  float: right;
  font-size: 19px;
}
.items{
  margin:10px 0 5px 0;
  width: 77%;
  border-bottom: 1px dotted #ccc;
  padding: 10px 8px;
  color: #aaa;
}
.left-distance{
  margin-left: 20px;
}
.content {
  font-size: 16px;
  line-height: 24px;
  width: 77%;
  padding: 10px 20px;
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
</style>
