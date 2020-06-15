const { watch } = require('gulp');
const fs = require('fs');

function test(cb) {
    console.log('updated.');
    cb();
}

exports.default = function() {
    watch("test.txt", test);
};