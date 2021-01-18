import { HttpRequest } from "../util/http";

let Movie = {
  // 查询电影详情
  getMovieById: function(data) {
    return HttpRequest.getRequest({
      method: "GET",
      url: "/api/webapi/auth/movie/getMovieById",
      data: data
    });
  },
  // 查询电影列表
  loadMovies: function(data) {
    return HttpRequest.getRequest({
      method: "GET",
      url: "/api/webapi/auth/movie/list",
      data: data
    });
  }
};
export {Movie};