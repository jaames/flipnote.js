export default {

  matches: function(source: any): boolean {
    return (source instanceof File);
  },

  load: function(source: File, resolve: Function, reject: Function): void {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(reader.result);
    };
    reader.onerror = (event) => {
      reject({type: 'fileReadError'});
    };
    reader.readAsArrayBuffer(source);
  }

}