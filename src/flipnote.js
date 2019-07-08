import player from "./player";
import parser from "./parser";
import ppmParser from "./parser/ppm";
import kwzParser from "./parser/kwz";
import bitmapEncoder from "./encoders/bmp";
import wavEncoder from "./encoders/wav";
import gifEncoder from "./encoders/gif";
import dataStream from "./utils/dataStream";

const module = {
  version: VERSION,
  player,
  parser,
  ppmParser,
  kwzParser,
};

export {
  module as default,
  parser,
  ppmParser,
  kwzParser,
  bitmapEncoder,
  gifEncoder,
  wavEncoder,
  dataStream,
}

