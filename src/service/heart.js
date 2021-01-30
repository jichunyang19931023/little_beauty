import { HttpRequest } from "../util/http";

let Heart = {
  // 获取回复
  getReply: function(data) {
    return HttpRequest.getRequest({
      method: "GET",
      url: "/api/webapi/auth/heart/getReply",
      data: data
    });
  }
};
export {Heart};