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
.operation{
    position: absolute;
    top: 0px;
    right: 20px;
    z-index: 999;
}
.operation .ivu-btn:hover{
    color:#ed7c95;
    border-color: #ed7c95;
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
                            只言片语
                        </MenuItem>
                        <MenuItem name="4">
                            光影斑驳
                        </MenuItem>
                    </div>
                </Menu>
                <div class="operation">
                  <Button :style="{margin: '15px'}" @click="toLogin(1)">登录</Button>
                  <Button @click="toLogin(0)">注册</Button>
                </div>
            </Header>
            <Content :style="{padding: '20px 250px'}">
                <Card>
                    <router-view></router-view>
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
        return {}
    },
    methods: {
        toLogin:function(login){
            this.$router.push('/login/'+login);
        }
     }
  }
</script>
