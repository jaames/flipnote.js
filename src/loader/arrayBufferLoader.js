export default {

  matches: function(source) {
    return (source instanceof ArrayBuffer);
  },

  load: function(source, resolve, reject) {
    resolve(source);
  }

}