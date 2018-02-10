import urlLoader from "./urlLoader";
import fileLoader from "./fileLoader";
import arrayBufferLoader from "./arrayBufferLoader";

const loaders = [
  urlLoader,
  fileLoader,
  arrayBufferLoader
];

export default function load(source) {
  return new Promise(function (resolve, reject) {
    for (var i = 0; i < loaders.length; i++) {
      var loader = loaders[i];
      if (loader.matches(source)) {
        loader.load(source, resolve, reject);
        break;
      }
    }
  });
}