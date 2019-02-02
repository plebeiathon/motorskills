const DataPixels = require('data-pixels');

const input = [0, 3, 213, 123, 32, 123, 321, 123];
const colors = [];
const data = [];

for (let i = 0; i < input.length; i++) {
    colors.push(input[i] + ", " + input[i] + ", " + input[i] + ";");
    data.push(colors[i] + ", ");
    console.log(data);
}

const size = 10;

const image = new DataPixels(data, size).image;

//Send this data to the model or something.