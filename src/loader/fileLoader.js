export default {

  matches: function(source) {
    return (source instanceof File);
  },

  load: function(source, resolve, reject) {
    var reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result)
    };
    reader.onerror = (event) => {
      reject({type: "fileReadError"});
    };
    reader.readAsArrayBuffer(source);
  }

}