export default {

  matches: function(source) {
    return typeof source === "string";
  },

  load: function(source, resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", source, true);
    xhr.responseType = "arraybuffer"; 
    xhr.onreadystatechange = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject({
            type: "httpError",
            status: xhr.status,
            statusText: xhr.statusText
          });
        }
      }
    };
    xhr.send(null);
  }

}