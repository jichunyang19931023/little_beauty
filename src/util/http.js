import axios from "axios";
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
      } else if (res.code == 403) {
        this.$router.push('/login/1');
      }
    }).catch(() => {
      reject();
    })
  }
};
export { HttpRequest };