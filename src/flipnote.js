import player from "./player";
import parser from "./parser";
import ppmParser from "./parser/ppm";
import kwzParser from "./parser/kwz";

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
  kwzParser
}

