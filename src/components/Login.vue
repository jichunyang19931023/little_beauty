<style>
.login{
  min-height: 400px;
  margin:0 80px;
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
.thumb-image{
  height: 100px;
  width: 100px;
  border: 1px solid #ccc;
  background: #fdfafa;
}
.upload-image{
  position: absolute;
  left: 0;
  top: 0;
  width: 100px;
  height: 100px;
  opacity: 0;
}
.no-image{
    font-size: 23px;
    padding-top: 38px;
}

.demo-spin-icon-load{
   animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from { transform: rotate(0deg);}
  50%  { transform: rotate(180deg);}
  to   { transform: rotate(360deg);}
}
.demo-spin-col{
  position: relative;
  margin-left: 32px;
}
.common-content{
  margin: 20px 150px;
}
.image-upload{
  width: 100px;
  height: 100px;
  position: absolute;
  left: 0;
  top:0;
}
</style>
<template>
      <div class="login">
        <div class="warmPic">
          <img v-show="isLogin==0" src="../assets/images/warm_pic.jpg" style="width:100%;"/>
          <img v-show="isLogin==1" src="../assets/images/warm_pic1.jpg" style="width:100%;"/>
        </div>
        <div class="formdata">
          <span class="text" v-show="isLogin==0">注册</span>
          <span class="text" v-show="isLogin==1">登录</span>

          <!-- 注册模块 -->
          <Form  v-show="isLogin==0" ref="formRegister" :model="formRegister" :rules="ruleRegister" :label-width="80">
              <!-- <FormItem label="头像" prop="image">
                  <input type="file" v-on:change="upload" class="upload-image" />
                  <div class="thumb-image">
                    <Icon class="no-image" v-show="noImage" type="image"></Icon>
                    <Row v-show="loadImage">
                      <Col class="demo-spin-col" span="8">
                          <Spin fix>
                              <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                              <div>&nbsp;</div>
                          </Spin>
                      </Col>
                  </Row>
                    <img :src="imageurl" class="image-upload" v-show="!noImage">
                  </div>
              </FormItem> -->
              <FormItem label="用户名" prop="username">
                  <Input type="text" v-model="formRegister.username"></Input>
              </FormItem>
              <FormItem label="密码" prop="passwd">
                  <Input type="password" v-model="formRegister.passwd"></Input>
              </FormItem>
              <FormItem label="重复密码" prop="passwdCheck">
                  <Input type="password" v-model="formRegister.passwdCheck"></Input>
              </FormItem>
              <!-- <FormItem label="邮箱" prop="mail">
                  <Input type="text" v-model="formRegister.mail"></Input>
              </FormItem> -->
              <FormItem class="but">
                  <Button @click="registerSubmit('formRegister')" :loading="registerLoading">提交</Button>
                  <Button @click="handleReset('formRegister')" style="margin-left: 8px" :disabled="registerLoading">重置</Button>
              </FormItem>
          </Form>

          <!-- 登录模块 -->
          <Form v-show="isLogin==1" ref="formLogin" :model="formLogin" :rules="ruleLogin" :label-width="80">
              <FormItem label="用户名" prop="username">
                  <Input type="text" v-model="formLogin.username"></Input>
              </FormItem>
              <FormItem label="密码" prop="passwd">
                  <Input type="password" v-model="formLogin.passwd"></Input>
              </FormItem>
              <FormItem class="but">
                  <Button @click="loginSubmit('formLogin')":loading="loginLoading">提交</Button>
                  <Button @click="handleReset('formLogin')" style="margin-left: 8px" :disabled="loginLoading">重置</Button>
              </FormItem>
          </Form>
      </div>
    </div>
</template>
<script>
import { Auth } from "../service/auth.js";
import { Article } from "../service/article.js";

export default {
        data() {
            //注册参数验证
            const validateUsername = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('用户名不能为空'));
                }
                if (value.length > 25) {
                    return callback(new Error('用户名不能大于25个字符'));
                }
                // 模拟异步验证效果
                let data = {
                  username: this.formRegister.username
                };
                Auth.checkUsername(data).then(response => {
                  if (response.data.info.repeat) {
                      return callback(new Error('用户名重复啦，换一个~'));
                  } else {
                      callback();
                  }
                });
            };
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('密码不能为空'));
                }else if (value.length > 20 || value.length < 6) {
                    callback(new Error('密码需要在6-20位之间'));
                }else if (this.formRegister.passwdCheck !== '') {
                    // 对第二个密码框单独验证
                    this.$refs.formRegister.validateField('passwdCheck');
                    callback();
                }
            };
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('重复密码不能为空'));
                } else if (value !== this.formRegister.passwd) {
                    callback(new Error('两次密码输入不一致'));
                } else {
                    callback();
                }
            };

            // 登录参数验证
            const validateUsername2 = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('用户名不能为空'));
                }
                if (value.length > 25) {
                    return callback(new Error('用户名不能大于25个字符'));
                }
                callback();
            };

            const validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('密码不能为空'));
                }else if (value.length > 20 || value.length < 6) {
                    callback(new Error('密码需要在6-20位之间'));
                } else {
                    callback();
                }
            };
            return {
                formRegister: {
                    passwd: '',
                    passwdCheck: '',
                    username: ''
                },
                ruleRegister: {
                    username: [{
                        validator: validateUsername,
                        trigger: 'blur'
                    }],
                    passwd: [{
                        validator: validatePass,
                        trigger: 'blur'
                    }],
                    passwdCheck: [{
                        validator: validatePassCheck,
                        trigger: 'blur'
                    }]
                },
                formLogin: {
                    passwd: '',
                    username: ''
                },
                ruleLogin: {
                    username: [{
                        validator: validateUsername2,
                        trigger: 'blur'
                    }],
                    passwd: [{
                        validator: validatePass2,
                        trigger: 'blur'
                    }]
                },
                isLogin: 0,
                imageurl:"",
                loadImage:false,
                noImage:true,
                registerLoading: false,
                loginLoading: false
            }
        },
        methods: {
            getParams() {
                // 取到路由带过来的参数 
                let routerParams = this.$route.params.isLogin * 1;
                // 将数据放在当前组件的数据内
                this.isLogin = routerParams;
                this.handleReset('formRegister');
                if (this.isLogin == 0) {
                  this.imageurl = "";
                  this.formRegister.username = "";
                  this.formRegister.passwd = "";
                  this.formRegister.passwdCheck = "";
                };
            },
            // 注册
            registerSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        var username = this.formRegister.username;
                        var param = new URLSearchParams();
                        // param.append('image',this.imageurl?this.imageurl.replaceAll("/api/webapi/article/downloadFile?fileUrl=", ""):"");
                        param.append('username',this.formRegister.username);
                        param.append('password',this.formRegister.passwd);
                        //param.append('mail',this.formRegister.mail? this.formRegister.mail:"");
                        this.registerLoading = true;
                        Auth.register(param).then(response => {
                            if (response.data.code == 200) {
                                this.$Message.success('注册成功,请登录！');
                                setTimeout(() => {
                                    this.$router.push('/login/1');
                                    this.formLogin.username = username;
                                },
                                1000);
                            }else{
                                this.$Message.error(response.data.msg);
                            }
                            this.registerLoading = false;
                        });
                    }
                })
            },
            // 登录
            loginSubmit(name) {
                this.$refs.formLogin.validate((valid) => {
                    if (valid) {
                        this.loginLoading = true;
                        this.$axios.post('/api/webapi/user/login', 
							             {
                                  username: this.formLogin.username,
                                  password: this.formLogin.passwd
                            }
						            ).then((response) => {
                            if (response.data.code == 200) {
                                this.$Message.success('登录成功！');
                                setTimeout(() => {
                                    this.$router.push('/');
                                    this.$emit("userchange",response.data.info);
                                },
                                1000);
                            }else{
                                this.$Message.error(response.data.msg);
                            }
                            this.loginLoading = false;
                        });
                    }
                })
            },
            handleReset(name) {
                this.$refs[name].resetFields();
            },
            // 上传图片
            upload(e){
              var files = e.target.files;
              if (files.length > 0) {
                this.loadImage = true;
                var formData = new FormData();
                formData.append("image",files[0]);
                formData.append("isAvatar",true);
                Article.uploadImg(formData).then(response => {
                  if (response.data.code == 200) {
                        this.loadImage = false;
                        var url = response.data.info.filePath;
                        if (url != null && url.length > 0) {
                            this.imageurl = "/api/webapi/article/downloadFile?fileUrl=" + url;
                            this.noImage = false;
                        }
                  }
                });
              }
            }
        },
        beforeMount: function() {
            //接收参数
            this.isLogin = this.$route.params.isLogin;
        },
        watch: {
            // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
            '$route': 'getParams'
        }
    }
</script>
