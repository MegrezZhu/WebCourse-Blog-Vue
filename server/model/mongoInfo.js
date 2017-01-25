'use strict';

const host = 'www.megrez-says-hi.cn';
const port = 27017;
const dbName = 'blog';
const username = 'root';
const pw = 'toor';

let url = '';

if (process.argv[2] == 'remote') {
    url = `mongodb://${username}:${pw}@${host}:${port}/${dbName}?authSource=admin`;
} else {
    if (process.argv[2] == 'local') {
        url = `mongodb://localhost:27017/blog`;
    }
    else throw new Error(`required parameter 'remote' or 'local'`);
}

module.exports = {url};