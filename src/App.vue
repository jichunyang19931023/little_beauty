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
    margin: 10px;
    float: left;
    border-radius: 20px;
}
</style>
<template>
    <div class="layout">
        <Layout>
            <Header>
                <Menu mode="horizontal" theme="light" active-name="1">
                    <div class="layout-logo"><img src="./assets/images/logo.png"></div>
                    <div class="layout-nav">
                        <MenuItem name="1">
                            <router-link to="/">首页</router-link>
                        </MenuItem>
                        <MenuItem name="2">
                            <router-link to="/articleList">文章感悟</router-link>
                        </MenuItem>
                        <MenuItem name="3">
                            <router-link to="/movieList">电影推荐</router-link>
                        </MenuItem>
                        <MenuItem name="4">
                            花花草草
                        </MenuItem>
                    </div>
                </Menu>
                <div v-if="username" class="username">
                    <Dropdown>
                        <img class="image" :src="avatar">
                        <a class="namelink" href="">{{username}}</a>
                        <DropdownMenu slot="list">
                            <DropdownItem><router-link to="/personal">个人中心</router-link></DropdownItem>
                            <DropdownItem><router-link to="/blogList">我的博客</router-link></DropdownItem>
                            <DropdownItem>联系我们</DropdownItem>
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
            <Content :style="{margin: '20px 150px'}">
                <Card>
                    <router-view @userchange="initUsername"></router-view>
                </Card>
            </Content>
            <Footer class="layout-footer-center">在这里，记录生活中的小美好</Footer>
        </Layout>
    </div>
</template>
<script>
  export default {
    name: 'App',
    data(){
        return {
            username:"",
            avatar:""
        }
    },
    beforeMount: function () {
        this.loadUser();
    },
    methods: {
        toLogin:function(login){
            this.$router.push('/login/'+login);
        },
        logout:function(){
            this.$axios.get('/api/user/loginout', {}).then((response) => {

                    if (response.data.code == 200) {
                        this.username = "";
                        this.$router.push('/login/1');
                    } else {
                        this.$Message.error(response.data.msg);
                    }
             });
        },
        initUsername:function(data){
            this.username = data;
        },
        loadUser : function(){
            this.$axios.get('/api/user/getUserInfo', {}).then((response) =>{
                if (response.data.code == 200) {
                    this.avatar = response.data.info.image;
                    this.username = response.data.info.name;
                }
            });
        }
     }
  }
</script>
