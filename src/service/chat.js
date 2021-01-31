import { HttpRequest } from "../util/http";

let Chat = {
  // 写信
  sendLetter: function(data) {
    return HttpRequest.getRequest({
      method: "POST",
      url: "/api/webapi/auth/letter/sendLetter",
      data: data
    });
  },
  // 获取回信列表
  getLetters: function(data) {
    return HttpRequest.getRequest({
      method: "GET",
      url: "/api/webapi/auth/letter/getLetters",
      data: data
    });
  },
  // 获取回信
  getLetterById: function(data) {
    return HttpRequest.getRequest({
      method: "GET",
      url: "/api/webapi/auth/letter/getLetterById",
      data: data
    });
  }
};
export {Chat};