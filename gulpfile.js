const { watch } = require('gulp');
const fs = require('fs');

async function test() {
    console.log('updated.');
}

exports.default = function() {
    watch("gitlog.txt", test);
};