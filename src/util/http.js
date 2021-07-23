import axios from "axios";
import router from "../router/index.js";

var HttpRequest = {
  getRequest({ url, data = {}, method = "GET" }) {
    return new Promise((resolve, reject) => {
      this._getRequest(url, resolve, reject, data, method);
    });
  },
  _getRequest: function(url, resolve, reject, data = {}, method = "GET") {
    let format = method.toLocaleLowerCase() ==='get'?'params':'data';
    axios({
      url: url,
      method: method,
      [format]: data,
      header: {
        "content-type": "application/json"
      }
    }).then(res => {
      if (res.status == 200) {
        resolve(res);
      }
    }).catch(err =>{
        //router.push("/login/1");
        reject(err);
    })
  }
};
export { HttpRequest };