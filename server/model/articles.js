'use strict';

class Article {

}

class Comment {

}

class Articles {
    constructor(db) {
        this.db = db;
        this.col = db.collection('articles');
    }

    count() {
        return this.col
                   .find()
                   .count();
    }
}

module.exports = Articles;