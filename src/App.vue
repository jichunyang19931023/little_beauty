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
.username a{
    font-size: 17px;
    color: #878d9a;
    margin-right: 15px;
}
.username a:hover{
    color: #ec5d80;
}
.username img{
    width: 40px;
    margin: 10px;
    float: left;
}
</style>
<template>
    <div class="layout">
        <Layout>
            <Header>
                <Menu mode="horizontal" theme="light" active-name="1">
                    <div class="layout-logo"><img src="./assets/logo.png"></div>
                    <div class="layout-nav">
                        <MenuItem name="1">
                            首页
                        </MenuItem>
                        <MenuItem name="2">
                            文章感悟
                        </MenuItem>
                        <MenuItem name="3">
                            电影推荐
                        </MenuItem>
                        <MenuItem name="4">
                            光影斑驳
                        </MenuItem>
                    </div>
                </Menu>
                <div v-if="username" class="username">
                    <Dropdown>
                        <img class="image" src="./assets/default.png">
                        <a href="">{{username}}</a>
                        <DropdownMenu slot="list">
                            <DropdownItem>我的资料</DropdownItem>
                            <DropdownItem>我的博客</DropdownItem>
                            <DropdownItem>我的评论</DropdownItem>
                            <DropdownItem>我的收藏</DropdownItem>
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
                    <router-view @login="initUsername"></router-view>
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
            username:""
        }
    },
    beforeMount: function () {
        var cookieMsg = this.getCookie("userInfo");
        var username = new Array();
        username = cookieMsg.split("-");
        this.username = username[username.length-1];
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
        getCookie: function (cname) {
                var name = cname + "=";
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') c = c.substring(1);
                    if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
                }
                return "";
        }
     }
  }
</script>
