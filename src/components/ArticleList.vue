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
              <br><span class="abs">{{article.abs}}</span>
              <br><span class="writer">{{article.username}}</span>
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
                articleList: [],
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
            }else{
              this.$router.push('/login/1');
            }
        },
        methods: {
            loadArticles: function() {
                this.$axios.get('/api/webapi/auth/article/list', {
                    params: {
                      pageNum: 1,
                      pageSize: 10
                  }
                }).then((response) =>{
                    if (response.data.code == 200) {
                        var articles = response.data.info.records;
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
.article .time,.title .more{
  float: right;
  color: #aaa !important;
}
.article .t{
  margin-top: 10px;
  font-size: 16px;
  color: #48484c;
  font-weight: 700;
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
