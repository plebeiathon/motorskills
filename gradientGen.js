/**
 * @description DataPixels basic code example
 * 
 */
import DataPixels from "data-pixels";

const R = "255, 0, 0, 255";    //Red
const G = "0, 255, 0, 255";    //Green
const B = "0, 0, 255, 255";    //Blue
const _ = "0, 0, 0, 0";        //Transparent

const data = [[R, G],
              [B, _]];

const size = 100;

const image = new DataPixels(data, size).image;

document.body.appendChild(image);