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
          <span class="left-dis-24">{{article.user.name}}</span>
          <span class="left-dis-24">
            <Icon class="comment-color" type="chatbubble-working"></Icon>
            <span>1</span>
          </span>
          <span class="left-dis-24">
            <Icon class="collect-color" type="star"></Icon>
            <span>1</span>
          </span>
          <span class="left-dis-24">
            <Icon class="like-color" type="heart"></Icon>
            <span>1</span>
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
  </div>
</template>

<script>
export default {
        name:'HelloWorld',
        data() {
            return {
                article: {}
            }
        },
        beforeMount: function() {
            this.loadArticle();
        },
        methods: {
            loadArticle: function() {
              var id = this.$route.query.id;
              this.$axios.get('/api/article/getArticleById', {
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
              this.$axios.get('/api/article/delArticle', {
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

<style scoped>
.article{
  width: 100%;
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
</style>
