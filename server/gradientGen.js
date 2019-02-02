var fs = require('fs')
var gm = require('gm');

const path = "images/pixel"

var data = [0, 150, 255, 24, 100, 239, 1, 240, 0, 200];

gm(1, 1, "rgb(" + data[0] + "," + data[0] + "," + data[0] + ")")
.write("images/test.png", function (err) {
});

for (let i = 1; i < data.length; i++) {
    gm(1, 1, "rgb(" + data[i] + "," + data[i] + "," + data[i] + ")")
        .write(path + i + ".png", function (err) {
        });
    gm("images/test.png").append(path + i + ".png", true).write("images/output.png", function (err) { });
}


