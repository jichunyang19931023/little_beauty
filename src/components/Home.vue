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
                this.arr = new Array();
                var vm = this;
                this.arr.push("http://p748wa0e8.bkt.clouddn.com/%E4%B8%8B%E8%BD%BD.jpg");
                this.arr.push("http://p748wa0e8.bkt.clouddn.com/%E4%B8%8B%E8%BD%BD%20%281%29.jpg");
                this.arr.push("http://p748wa0e8.bkt.clouddn.com/u=407254884,898597993&fm=27&gp=0.jpg");
                this.arr.push("http://p748wa0e8.bkt.clouddn.com/u=28090977,4239975763&fm=27&gp=0.jpg");
                this.arr.push("http://p748wa0e8.bkt.clouddn.com/u=2757138095,1739115349&fm=27&gp=0.jpg");
                this.arr.push("http://p748wa0e8.bkt.clouddn.com/u=1394993395,3497243879&fm=27&gp=0.jpg");

                this.$axios.get('/api/article/list', {}).then((response) =>{
                    if (response.data.code == 200) {
                        var articles = response.data.info;
                        articles.forEach(function(item){
                          item.title = item.title.substr(0,20);
                          if (!item.imageThumb) {
                            item.imageThumb = vm.randomImage();
                          }
                        });
                        this.articleList = articles;
                    }
                });
            },
            randomImage : function(){
                var temp = "";    //temp存放生成的随机数组
            　  var count=this.arr.length;    
                for (var i=0;i<count;i++){ 
                    var num=Math.floor(Math.random()*count); //生成随机数num
                    console.log(num);
                    temp = this.arr[num];    //获取arr[num]并放入temp
                    this.arr.splice(num,1); 
                    return temp;   
                }
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
