<template>
  <div id="blog_body">
    <Input v-model="title" placeholder="标题" class="title"></Input>
    <button class="publish" @click="publish()">发表博客</button>
    <quill-editor v-model="content" id="editor" ref="myQuillEditor" :options="editorOption"></quill-editor>
    <form action="" method="post" enctype="multipart/form-data" id="uploadFormMulti">
      <input style="display: none" id="uniqueId" type="file" multiple accept="image/jpg,image/jpeg,image/png,image/gif" @change="uploadImg('uploadFormMulti')">
    </form>
  </div>
</template>

<script>
import {quillEditor} from 'vue-quill-editor'
import config from "../../../config/global"
import { Article } from "../../service/article.js";
export default {
        name:'editor',
        components: {
            "quill-editor": quillEditor
        },
        data() {
            return {
                id:"",
                title: "",
                content: '',
                editorOption: {},
                config:config
            }
        },
        mounted() {
            this.id = this.$route.query.id;
            if (this.id) {
              this.loadArticle();
            }
            var vm = this;
            var imgHandler = async function(image) {
               vm.addImgRange = vm.$refs.myQuillEditor.quill.getSelection();
               if (image) {
                var fileInput = document.getElementById("uniqueId"); //隐藏的file文本ID
                fileInput.click(); //加一个触发事件
               }
             }
             vm.$refs.myQuillEditor.quill.getModule("toolbar").addHandler("image", imgHandler);
        },
        methods: {
            loadArticle: function() {
              let data = {
                id: this.id
              }
              Article.getArticleById(data).then(response => {
                  if (response.data.code == 200) {
                        var article = response.data.info;
                        this.title = article.title;
                        this.content = article.content;
                  } else {
                        this.$Message.error(response.data.msg);
                  }
              });
            },
            publish: function() {
                if (this.title == "" || this.content == "") {
                    this.$Message.error('标题或正文不得为空！');
                    return;
                }
                var cookieMsg = this.getCookie("userInfo");
                var username = new Array();
                username = cookieMsg.split("-");
                var userId = username[username.length - 2];
                //如果是编辑文章
                if (this.id) {
                    this.$axios({
                      method: "post",
                      url: '/api/webapi/auth/article/editArticle',
                      data: {
                          id:this.id,
                          title: this.title,
                          content: this.content
                      },
                      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                      transformRequest: function(obj) {
                          var str=[];
                          for(var item in obj){
                              str.push(encodeURIComponent(item)+"="+encodeURIComponent(obj[item]));
                          }
                          return str.join("&");
                      }
                  }).then((response) => {
                      if (response.data.code == 200) {
                          this.$router.push('/BlogPage?id='+this.id);
                      }
                  });
                  return;
                }
                var param = new URLSearchParams();
                param.append('title', this.title);
                param.append('content', this.content);
                param.append('userId', userId);
                Article.addArticle(param).then(response => {
                    if (response.data.code == 200) {
                        this.$router.push('/blogList');
                    } else {
                        this.$Message.error(response.data.msg);
                    }
                });
            },
            uploadImg: async function(id) {
                var vm = this;
                var fileInput = document.getElementById("uniqueId");
                var formData = new FormData();
                formData.append("image",fileInput.files[0]);
                Article.uploadImg(formData).then(response => {
                    if (response.data.code == 200) {
                        var filePath = response.data.info.filePath;
                        console.log(config);
                        var url = this.config.base_path + "/api/webapi/article/downloadFile?fileUrl=" + filePath;
                        if (url != null && url.length > 0) {
                           vm.addImgRange = vm.$refs.myQuillEditor.quill.getSelection();
                           var index = vm.addImgRange != null?vm.addImgRange.index:0;
                           vm.$refs.myQuillEditor.quill.insertEmbed(index, 'image', url);
                        } else {
                           this.$Message.error("图片添加失败！");
                        }
                    } else {
                        this.$Message.error(response.data.msg);
                    }
                });
             },
        }
    }
</script>

<style scoped>
#blog_body{
  height: 525px;
  font-size: 15px !important;
}
.title{
  width: 85%;
}
.publish{
  width: 13.5%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #d87474;
  color: #fff;
  margin-left: 1%;
}
#editor {
    margin: auto;
    width: 100%;
    height: 400px;
    margin-top: 15px;
}
</style>
