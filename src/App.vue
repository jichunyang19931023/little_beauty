<style scoped>
.layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}
.layout-logo{
    width: 100px;
    height: 30px;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 0px;
    left: 30px;
}
.layout-nav{
    margin: 0 auto;
    margin-left: 200px;
}
.layout-footer-center{
    text-align: center;
}
.operation,.username{
    position: absolute;
    top: 0px;
    right: 20px;
    z-index: 999;
}
.operation .ivu-btn:hover{
    color:#ed7c95;
    border-color: #ed7c95;
}
.username .namelink{
    font-size: 17px;
    color: #878d9a;
    margin-right: 15px;
}
.username img{
    width: 40px;
    height: 40px;
    margin: 10px;
    float: left;
    border-radius: 20px;
}
</style>
<style>
  .common-content{
    margin: 20px 150px;
  }
  .loading{
    margin-top: 20px;
  }
</style>
<template>
    <div class="layout">
        <Layout>
            <Header>
                <Menu mode="horizontal" theme="light" :active-name="$route.name">
                    <div class="layout-logo"><img src="./assets/images/logo.png"></div>
                    <div class="layout-nav">
                        <MenuItem name="Home">
                            <router-link to="/">首页</router-link>
                        </MenuItem>
                        <MenuItem name="ArticleList">
                            <router-link to="/articleList">日常小温暖</router-link>
                        </MenuItem>
                        <MenuItem name="MovieList">
                            <router-link to="/movieList">看个电影呗</router-link>
                        </MenuItem>
                        <MenuItem name="Personal">
                            <router-link to="/personal">我的小角落</router-link>
                        </MenuItem>
                        <MenuItem name="Heart">
                            <router-link to="/heart">心灵小驿站</router-link>
                        </MenuItem>
                    </div>
                </Menu>
                <div v-if="username" class="username">
                    <Dropdown>
                        <img class="image" :src="avatar">
                        <a class="namelink" href="">{{username}}</a>
                        <DropdownMenu slot="list">
                            <DropdownItem><router-link to="/personal">我的小角落</router-link></DropdownItem>
                            <DropdownItem><router-link to="/blogList">我的小温暖</router-link></DropdownItem>
                            <DropdownItem><router-link to="/chatWithMe">联系我呀</router-link></DropdownItem>
                            <DropdownItem>
                                <span @click="logout()">退出</span>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <div v-else class="operation">
                  <Button :style="{margin: '15px'}" @click="toLogin(1)">登录</Button>
                  <Button @click="toLogin(0)">注册</Button>
                </div>
            </Header>
            <Content class="common-content">
                <Card>
                    <router-view @userchange="initUsername"></router-view>
                </Card>
            </Content>
            <Footer class="layout-footer-center">在这里，记录生活中的小美好</Footer>
        </Layout>
    </div>
</template>
<script>
import { Auth } from "../src/service/auth.js";
export default {
    name: 'App',
    data(){
        return {
            username:"",
            avatar:""
        }
    },
    beforeMount: function () {
        var username = new Array();
        username = this.getCookie("userInfo").split("-");
        let personId = username[username.length-2];
        this.loadUser(personId);
    },
    methods: {
        toLogin:function(login){
            this.$router.push('/login/'+login);
        },
        logout:function(){
            Auth.logout({}).then(response => {
                if (response.data.state == 'ok') {
                    this.delCookie();
                    this.username = "";
                    this.$router.push('/login/1');
                } else {
                    this.$Message.error(response.data.msg);
                }
            });
        },
        initUsername:function(data){
            this.username = data.name;
            this.avatar = data.image;
        },
        loadUser : function(personId){
            let data = {
                userId: personId
            }
            Auth.getUserInfo(data).then(response => {
                if (response.data.code == 200) {
                    this.avatar = response.data.info.image;
                    this.username = response.data.info.name;
                }
            });
        },
        delCookie:function() {
          var keys = document.cookie.match(/[^ =;]+(?==)/g)
          if (keys) {
            for (var i = keys.length; i--;) {
              document.cookie=keys[i]+'=0;expires=' + new Date( 0).toUTCString();
            }
          }
        }
     }
  }
</script>
