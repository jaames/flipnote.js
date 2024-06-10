import { assertNodeEnv, assertBrowserEnv } from '../utils';

export abstract class EncoderBase {

  mimeType: string;
  dataUrl: string = null;

  /**
   * Returns the file data as an {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer | ArrayBuffer}.
   */
  abstract getArrayBuffer(): ArrayBuffer;
  
  /**
   * Returns the file data as a NodeJS {@link https://nodejs.org/api/buffer.html | Buffer}.
   * 
   * > Note: This method does not work outside of NodeJS environments.
   */
  getBuffer(): Buffer {
    assertNodeEnv();
    return Buffer.from(this.getArrayBuffer());
  }

  /**
   * Returns the file data as a {@link https://developer.mozilla.org/en-US/docs/Web/API/Blob | Blob}.
   */
  getBlob(): Blob {
    assertBrowserEnv();;
    return new Blob([this.getArrayBuffer()], {
      type: this.mimeType
    });
  }

  /**
   * Returns the file data as an {@link https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL | Object URL}.
   * 
   * > Note: This method does not work outside of browser environments.
   */
  getUrl(): string {
    assertBrowserEnv();
    if (this.dataUrl)
      return this.dataUrl;
    return window.URL.createObjectURL(this.getBlob());
  }

  /**
   * Revokes this file's {@link https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL | Object URL} if one has been created, use this when the url created with {@link getUrl} is no longer needed, to preserve memory.
   * 
   * > Note: This method does not work outside of browser environments.
   */
  revokeUrl(): void {
    assertBrowserEnv();
    if (this.dataUrl)
      window.URL.revokeObjectURL(this.dataUrl);
  }


}