<template>
  <div>
    <div class="new_articles">
      <div class="title">
        <span><Icon type="heart" />&nbsp;个人中心</span>
        <span class="floatR personInfo" @click="changeInfo()">修改资料</span>
        <Modal
              v-model="modal"
              title="修改资料"
              @on-ok="ok">
              <Form :model="formItem" :label-width="80">
                <FormItem label="用户名">
                    <Input v-model="formItem.name" placeholder="Enter something..."></Input>
                </FormItem>
                <FormItem label="邮箱">
                    <Input v-model="formItem.mail" placeholder="Enter something..."></Input>
                </FormItem>
                <FormItem label="性别">
                    <RadioGroup v-model="formItem.sex">
                        <Radio class="sex" label="girl">妹纸</Radio>
                        <Radio class="sex" label="boy">汉纸</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="个人签名">
                    <Input v-model="formItem.text" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
                </FormItem>
            </Form>
        </Modal>
      </div>
      <ul>
          <li class="article">
              <img :src="user.image" class="image">
              <div class="info">
                <span class="name">{{user.name}}</span>
                <br/><span class="mail">邮箱：{{user.mail}}</span>
                <span class="create_time">注册时间：{{user.createTime}}</span>
                <span class="create_time">性别：{{user.sex == 0?'妹纸':'汉纸'}}</span>
                <span class="msg">{{user.msg}}</span>
              </div>
              <div class="tabs">
                <Tabs value="name1">
                    <TabPane label="我的博客" name="name1">
                      <ul class="myblog floatL">
                        <li class="blog-unit"  v-for="article in articleList">
                          <router-link :to="{path:'/BlogPage',query:{id:article.id}}" target="_blank">
                            <h3 class="blog-title bottom-dis-8">{{article.title}}</h3>
                            <p class="text bottom-dis-8">{{article.abs}}</p>
                          </router-link>
                          <div class="unit-control clearfix bottom-dis-16">
                                <div class="unit-con-left clearfix floatL">
                                    <div class="floatL">{{article.createTimeStr}}</div>
                                    <div class=" floatL left-dis-24">
                                      <Icon class="comment-color" type="chatbubble-working"></Icon>
                                      <span>1</span>
                                    </div>
                                    <div class=" floatL left-dis-24">
                                      <Icon class="collect-color" type="star"></Icon>
                                      <span>0</span>
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
                    </TabPane>
                    <TabPane label="我的收藏" name="name2">
                      
                    </TabPane>
                    <TabPane label="我的评论" name="name3">
                      
                    </TabPane>
                    <TabPane label="我的点赞" name="name4">
                      
                    </TabPane>
                </Tabs>
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
                user: {},
                articleList:{},
                modal: false,
                formItem: {
                    name: '',
                    mail: '',
                    sex: 'girl',
                    text: ''
                }
            }
        },
        beforeMount: function() {
            var cookieMsg = this.getCookie("userInfo");
            var username = new Array();
            username = cookieMsg.split("-");
            var login = username[username.length-1];
            if (login != "") {
              this.loadInfo();
              this.loadArticles();
            }else{
              this.$router.push('/login/1');
            }
        },
        methods: {
            loadInfo: function() {
                this.$axios.get('/api/user/getUserInfo', {}).then((response) =>{
                    if (response.data.code == 200) {
                        this.user = response.data.info;
                    }
                });
            },
            loadArticles: function() {
              var cookieMsg = this.getCookie("userInfo");
              var username = new Array();
              username = cookieMsg.split("-");
              var personId = username[username.length-2];
              this.$axios.get('/api/article/list', {
                params: {
                  personId: personId
                }
              }).then((response) =>{
                    if (response.data.code == 200) {
                        var articles = response.data.info;
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
            },
            changeInfo:function(){
              this.loadInfo();
              this.modal = true;
              this.formItem.name = this.user.name;
              this.formItem.mail = this.user.mail;
              this.formItem.sex = this.user.sex==0?'girl':'boy';
              this.formItem.text = this.user.msg;
            },
            ok:function() {
              var param = new URLSearchParams()
              param.append('id',this.user.id);
              param.append('name',this.formItem.name);
              param.append('mail',this.formItem.mail);
              param.append('sex',this.formItem.sex=='girl'?0:1);
              param.append('msg',this.formItem.text);
              this.$axios({
                method: 'post',
                url: '/api/user/editUser',
                data:param
            }).then((response) =>{
                    if (response.data.code == 200) {
                        this.loadInfo();
                        this.$emit("userchange",this.formItem.name);
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
}
a {
  color: #42b983 !important;
}
.new_articles{
    width: 85%;
    margin: 0 auto;
}

.title{
  padding: 8px 10px;
  border-bottom: 1px dashed #ec5d80;
  font-size: 16px;
  color: #ec5d80 !important;
}
.article{
  padding: 10px 5px;
  width: 100%;
}
.info{
  float: left;
  margin-left: 10px;
}
.name{
  font-size: 22px;
  color: #48484c;
}
.mail,.create_time{
  font-size: 16px;
  float: left;
  margin-right: 50px;
  padding: 10px 0;
}
.msg{
  font-size: 16px;
  display: block;
  color: #949698;
}
.image{
  float: left;
  width: 100px;
  height: 100px;
  border-radius: 10px;
  margin: 2px 7px 2px 0;
}
.personInfo{
  color: #c3c0bb;
  font-size: 14px;
  cursor: pointer;
}
.sex{
  font-size: 15px !important;
}
.tabs{
  margin-top: 25px;
  display: block;
  width: 100%;
  float: left;
}
.tabs .nav-text{
  font-size: 15px !important;
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
.myblog{
  width: 100%;
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
    width: 100%;
    padding-left: 1%;
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
.new_articles .title{
  padding: 8px 10px;
  border-bottom: 1px dashed #ec5d80;
  font-size: 16px;
  color: #ec5d80;
}
.article .time{
  color: #aaa;
}
</style>
