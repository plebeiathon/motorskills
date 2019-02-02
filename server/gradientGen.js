var fs = require('fs')
var gm = require('gm');

const path = "images/pixel"
var data = [];

for (var i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        data[j] = Math.random() * 255 + 1;
    }

    gm(1, 1, "rgb(" + data[0] + "," + data[0] + "," + data[0] + ")")
        .write("images/Outputs/output" + i + ".png", function (err) {
        });

    for (let j = 1; j < data.length; j++) {
        gm(1, 1, "rgb(" + data[j] + "," + data[j] + "," + data[j] + ")")
            .write(path + j + ".png", function (err) {
            });
        gm("images/Outputs/output" + i + ".png").append(path + i + ".png", true).write("images/Outputs/output" + i + ".png", function (err) { });
    }
}

