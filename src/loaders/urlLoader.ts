export default {

  matches: function(source: any): boolean {
    return typeof source === 'string';
  },

  load: function(source: string, resolve: Function, reject: Function): void {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', source, true);
    xhr.responseType = 'arraybuffer'; 
    xhr.onreadystatechange = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject({
            type: 'httpError',
            status: xhr.status,
            statusText: xhr.statusText
          });
        }
      }
    };
    xhr.send(null);
  }

}