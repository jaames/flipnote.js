// table1 - commonly occuring line offsets
export const KWZ_TABLE_1 = new Uint16Array([
  0x0000, 0x0CD0, 0x19A0, 0x02D9, 0x088B, 0x0051, 0x00F3, 0x0009,
  0x001B, 0x0001, 0x0003, 0x05B2, 0x1116, 0x00A2, 0x01E6, 0x0012,
  0x0036, 0x0002, 0x0006, 0x0B64, 0x08DC, 0x0144, 0x00FC, 0x0024,
  0x001C, 0x0004, 0x0334, 0x099C, 0x0668, 0x1338, 0x1004, 0x166C
]);

// table2 - commonly occuring line offsets, but the lines are shifted to the left by one pixel
export const KWZ_TABLE_2 = new Uint16Array([
  0x0000, 0x0CD0, 0x19A0, 0x0003, 0x02D9, 0x088B, 0x0051, 0x00F3, 
  0x0009, 0x001B, 0x0001, 0x0006, 0x05B2, 0x1116, 0x00A2, 0x01E6, 
  0x0012, 0x0036, 0x0002, 0x02DC, 0x0B64, 0x08DC, 0x0144, 0x00FC, 
  0x0024, 0x001C, 0x099C, 0x0334, 0x1338, 0x0668, 0x166C, 0x1004
]);

// table3 - line offsets, but the lines are shifted to the left by one pixel
export const KWZ_TABLE_3 = new Uint16Array(6561);
const table3Values = [0, 3, 7, 1, 4, 8, 2, 5, 6];
let index = 0;
for (let a = 0; a < 9; a++)
  for (let b = 0; b < 9; b++)
    for (let c = 0; c < 9; c++)
      for (let d = 0; d < 9; d++) {
        KWZ_TABLE_3[index] = ((table3Values[a] * 9 + table3Values[b]) * 9 + table3Values[c]) * 9 + table3Values[d];
        index++;
      }

// linetable - contains every possible sequence of pixels for each tile line
export const KWZ_LINE_TABLE = new Uint16Array(6561 * 8);
const pixelValues = [0x0000, 0xFF00, 0x00FF];
let offset = 0;
for (let a = 0; a < 3; a++)
  for (let b = 0; b < 3; b++)
    for (let c = 0; c < 3; c++)
      for (let d = 0; d < 3; d++)
        for (let e = 0; e < 3; e++)
          for (let f = 0; f < 3; f++)
            for (let g = 0; g < 3; g++)
              for (let h = 0; h < 3; h++) {
                KWZ_LINE_TABLE.set([
                  pixelValues[b], 
                  pixelValues[a], 
                  pixelValues[d], 
                  pixelValues[c], 
                  pixelValues[f], 
                  pixelValues[e], 
                  pixelValues[h], 
                  pixelValues[g]
                ], offset);
                offset += 8;
              }