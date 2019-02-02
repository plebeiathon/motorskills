var gm = require('gm');

const path = "images/pixel"
var data = [];
let time = (new Date).getTime();

for (var i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        data[j] = Math.random() * 255 + 1;
    }
    gm(1, 1, "rgb(" + data[0] + "," + data[0] + "," + data[0] + ")")
        .write("images/Outputs/output-" + time + ".png", function (err) {
        });

    for (let j = 1; j < data.length; j++) {
        gm(1, 1, "rgb(" + data[j] + "," + data[j] + "," + data[j] + ")")
            .write(path + j + ".png", function (err) {
            });
        gm("images/Outputs/output-" + time + ".png").append(path + j + ".png", true).write("images/Outputs/output-" + time + ".png", function (err) { });
    }
}

