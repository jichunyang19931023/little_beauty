<style>
.login{
  min-height: 400px;
  padding: 30px;
}
.login .warmPic,.login .formdata{
  float: left;
  margin-left: 3%;
}
.login .warmPic{
    width: 30%;
}
.login .formdata{
    width: 60%;
    text-align: center;
}
.login .text{
  margin: 0px 32px 30px 32px;
  font-size: 20px;
  color: #f15f83;
  display: inline-block;
}
.login .but{
  float: right;
}
</style>
<template>
      <div class="login">
        <div class="warmPic">
          <img  v-show="isLogin==0" src="../assets/warm_pic.jpg" style="width:100%;"/>
          <img  v-show="isLogin==1" src="../assets/warm_pic1.jpg" style="width:100%;"/>
        </div>
        <div class="formdata">
          <span class="text" v-if="isLogin==1">登录</span>
          <span class="text" v-if="isLogin==0">注册新会员</span>
          <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
              <FormItem label="用户名" prop="username">
                  <Input type="text" v-model="formCustom.username"></Input>
              </FormItem>
              <FormItem label="密码" prop="passwd">
                  <Input type="password" v-model="formCustom.passwd"></Input>
              </FormItem>
              <FormItem v-show="isLogin==0" label="重复密码" prop="passwdCheck">
                  <Input type="password" v-model="formCustom.passwdCheck"></Input>
              </FormItem>
              <FormItem v-show="isLogin==0" label="邮箱" prop="mail">
                  <Input type="text" v-model="formCustom.mail"></Input>
              </FormItem>
              <FormItem class="but">
                  <Button  v-show="isLogin==0" @click="registerSubmit('formCustom')">提交</Button>
                  <Button  v-show="isLogin==1" @click="loginSubmit('formCustom')">提交</Button>
                  <Button @click="handleReset('formCustom')" style="margin-left: 8px">重置</Button>
              </FormItem>
          </Form>
      </div>
    </div>
</template>
<script>
    export default {
        data () {
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('密码不能为空'));
                } else {
                    if (this.formCustom.passwdCheck !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.formCustom.validateField('passwdCheck');
                    }
                    callback();
                }
            };
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('重复密码不能为空'));
                } else if (value !== this.formCustom.passwd) {
                    callback(new Error('两次密码输入不一致'));
                } else {
                    callback();
                }
            };
            const validateUsername = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('用户名不能为空'));
                }
                debugger;
                // 模拟异步验证效果
                this.$axios.get('/api/user/checkUsername', {
                    params:{
                      username:this.formCustom.username
                    }
                }).then((response) => {
                  if(response.data.info.repeat){
                    return callback(new Error('用户名重复啦，换一个呗~'));
                  }else{
                    callback();
                  }
                });
            };
            
            return {
                formCustom: {
                    passwd: '',
                    passwdCheck: '',
                    username: ''
                },
                ruleCustom: {
                    username: [
                        { validator: validateUsername, trigger: 'blur' }
                    ],
                    passwd: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    passwdCheck: [
                        { validator: validatePassCheck, trigger: 'blur' }
                    ]
                },
                isLogin:0
            }
        },
        methods: {
            getParams () {
              // 取到路由带过来的参数 
              let routerParams = this.$route.params.isLogin*1;
              // 将数据放在当前组件的数据内
              this.isLogin = routerParams;
              this.handleReset('formCustom');
            },
            registerSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                      this.$axios.get('/api/user/addUser', {
                        params:{
                          username:this.formCustom.username,
                          password:this.formCustom.passwd,
                          mail:this.formCustom.mail
                        }
                      }).then((response) => {
                          this.$Message.success('注册成功！');
                          setTimeout(() => {
                            this.$router.push('/login/1');
                        }, 1000);
                      });
                    }
                })
            },
            loginSubmit (name) {
                
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            }
        },
        beforeMount:function(){
          //接收参数
          this.isLogin = this.$route.params.isLogin;
        },
        watch: {
          // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
          '$route': 'getParams'
        }
    }
</script>
