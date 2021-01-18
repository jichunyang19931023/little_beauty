import { HttpRequest } from "../util/http";

let Article = {
  // 上传图片
  uploadImg: function(data) {
    return HttpRequest.getRequest({
      method: "POST",
      url: "/api/webapi/article/uploadImg",
      data: data
    });
  },
  // 查询文章列表
  loadArticles: function(data) {
    return HttpRequest.getRequest({
      method: "GET",
      url: "/api/webapi/auth/article/list",
      data: data
    });
  },
  // 查询评论列表
  loadComments: function(data) {
    return HttpRequest.getRequest({
      method: "GET",
      url: "/api/webapi/auth/comments/list",
      data: data
    });
  },
  // 添加评论
  addComments: function(data) {
    return HttpRequest.getRequest({
      method: "POST",
      url: "/api/webapi/auth/comments/addComments",
      data: data
    });
  },
  // 查询文章详情
  getArticleById: function(data) {
    return HttpRequest.getRequest({
      method: "GET",
      url: "/api/webapi/auth/article/getArticleById",
      data: data
    });
  },
  // 检查文章是否收藏
  checkCollection: function(data) {
    return HttpRequest.getRequest({
      method: "GET",
      url: "/api/webapi/auth/collection/checkCollection",
      data: data
    });
  },
  // 添加收藏
  addCollection: function(data) {
    return HttpRequest.getRequest({
      method: "POST",
      url: "/api/webapi/auth/collection/addCollection",
      data: data
    });
  },
  // 收藏列表
  collectionList: function(data) {
    return HttpRequest.getRequest({
      method: "GET",
      url: "/api/webapi/auth/collection/collectionList",
      data: data
    });
  },
  // 取消收藏
  delCollection: function(data) {
    return HttpRequest.getRequest({
      method: "POST",
      url: "/api/webapi/auth/collection/delCollection",
      data: data
    });
  },
  // 添加文章
  addArticle: function(data) {
    return HttpRequest.getRequest({
      method: "POST",
      url: "/api/webapi/auth/article/addArticle",
      data: data
    });
  },
  // 删除文章
  delArticle: function(data) {
    return HttpRequest.getRequest({
      method: "POST",
      url: "/api/webapi/auth/article/delArticle",
      data: data
    });
  }
};
export {Article};