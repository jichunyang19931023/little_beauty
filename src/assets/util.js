export default{  
  install(Vue,options){
    Vue.prototype.getCookie = function (cname) {
        var name = cname + "=";
        var cookie = decodeURIComponent(document.cookie);
        var ca = cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
        }
        return "";
    }
  }  
} 