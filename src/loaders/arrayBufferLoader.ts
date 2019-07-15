export default {

  matches: function(source: any): boolean {
    return (source instanceof ArrayBuffer);
  },

  load: function(source: ArrayBuffer, resolve: Function, reject: Function): void {
    resolve(source);
  }

}