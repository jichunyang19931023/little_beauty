import { HttpRequest } from "../util/http";

let Auth = {
  // 查询用户名称重复
  checkUsername: function(data) {
    return HttpRequest.getRequest({
      method: "GET",
      url: "/api/webapi/user/checkUsername",
      data: data
    });
  },
  // 用户注册
  register: function(data) {
    return HttpRequest.getRequest({
      method: "GET",
      url: "/api/webapi/user/register",
      data: data
    });
  },
  // 获取用户信息
  getUserInfo: function(data) {
    return HttpRequest.getRequest({
      method: "GET",
      url: "/api/webapi/auth/user/getUserInfo",
      data: data
    });
  },
  // 编辑用户信息
  editUser: function(data) {
    return HttpRequest.getRequest({
      method: "POST",
      url: "/api/webapi/auth/user/editUser",
      data: data
    });
  }
};
export {Auth};