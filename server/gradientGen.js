var fs = require('fs')
var gm = require('gm');

const path = "brandNewImg.jpg"

gm(200, 400, "#ddff99f3")
    .drawText(10, 50, "from scratch")
    .write(path, function (err) {

    });