/**
 * @description DataPixels basic code example
 * 
 */
import DataPixels from "data-pixels";

var input = [/*Data*/];
var colors = [];
var data = [];

for(let i = 0; i < input.length; i++){
    colors.push(input[i] + ", " + input[i] + ", " + input[i] + ";");
    data.push(colors[i] + ", ");
}

const size = 10;

const image = new DataPixels(data, size).image;

//Send this data to the model or something.