export default {

  matches: function(source: any) {
    return (source instanceof File);
  },

  load: function(source: File, resolve: Function, reject: Function) {
    var reader = new FileReader();
    reader.onload = (event) => {
      resolve(reader.result);
    };
    reader.onerror = (event) => {
      reject({type: 'fileReadError'});
    };
    reader.readAsArrayBuffer(source);
  }

}