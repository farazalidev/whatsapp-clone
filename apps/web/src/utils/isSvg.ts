import { parse } from 'svg-parser';

export const isSVG = (buffer: Buffer) => {
  try {
    parse(buffer.toString());
    // If parsing is successful, it's likely an SVG file
    return true;
  } catch (error) {
    // Parsing failed, not an SVG file
    return false;
  }
};
