import { sync as brotliSize } from 'brotli-size';
import type { OutputPlugin } from 'rollup';

export const size = (): OutputPlugin => ({
  name: 'size',
  renderChunk(code, chunk, options) {
    const fmtSize = (n: number) => (n / 1024).toFixed(3) + 'kB';
    console.log([
      '',
      chunk.fileName,
      `Raw:               ${ fmtSize(code.length) }`,
      `Minified & Brotli: ${ fmtSize(brotliSize(code)) }`
    ].join('\n'));
    return null;
  }
});