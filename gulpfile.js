const { watch } = require('gulp');
const fs = require('fs');

function test(cb) {
    fs.writeFile('messages.txt', String(Date.now()), (err) => {
        if (err) {
            throw err;
        }

        cb();
    });
}

exports.default = function() {
    watch("gitlog.txt", test);
};