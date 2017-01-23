'use strict';

let lodash = require('lodash');
let ObjectID = require('mongodb').ObjectID;

class Article {
    constructor(title, content, authorName, authorId, date) {
        this.title = title;
        this.content = content;
        this.author = {
            id: authorId,
            name: authorName
        };   // author name
        this.date = date;
        this.comments = [];     // ObjectID
        this.hide = false;
        this.lastEditDate = date;
    }
}

class Comment {
    constructor(content, author, date) {
        this.content = content;
        this.author = author;
        this.date = date;
        this.hide = false;
        this.lastEditDate = date;
    }
}

class Articles {
    constructor(db) {
        this.db = db;
        this.arti = db.collection('articles');
        this.comm = db.collection('articles.comments');
    }

    async count() {
        return this.arti
                   .find()
                   .count();
    }

    async newArticle({title, content, author, date}) {
        let arti = new Article(title, content, author.name, author.id, date);
        return this.arti
                   .insertOne(arti)
                   .then(({insertedId}) => insertedId);
    }

    async newComment(articleId, {content, author, date}) {
        let comm = new Comment(content, author, date);
        let commId = await this.comm
                               .insertOne(comm)
                               .then(({insertedId}) => insertedId)
        await this.arti
                  .updateOne({_id: articleId}, {
                      $push: {
                          comments: commId
                      }
                  });
        return commId;
    }

    async editArticle(articleId, edit) {
        if (edit.content || edit.title)
            edit.lastEditDate = new Date().valueOf();
        await this.arti
                  .updateOne({_id: articleId}, {
                      $set: edit
                  });
    }

    async editComment(commId, edit) {
        if (edit.content)
            edit.lastEditDate = new Date().valueOf();
        await this.comm
                  .updateOne({_id: commId}, {
                      $set: edit
                  });
    }

    async removeArticle(articleId) {
        await this.arti
                  .removeOne({_id: articleId});
    }

    async removeComment(commId) {
        await this.comm
                  .removeOne({_id: commId});
    }

    async getArticle(articleId, keys) {
        let arr = await this.arti
                            .find({_id: new ObjectID(articleId)})
                            .limit(1)
                            .toArray();
        if (!arr[0]) return null;
        return lodash.pick(arr[0], keys);
    }

    async getArticles(param, keys, num, skip = 0) {
        let _param;
        if (param instanceof Array) {
            _param = {$or: []};
            param.forEach(articleId => _param.$or.push({_id: new ObjectID(articleId)}));
        } else _param = param;
        let param2 = {};
        keys.forEach(key => param2[key] = 1);
        let arr = await this.arti
                            .find(_param, param2)
                            .skip(skip)
                            .limit(num ? num : 100)
                            .toArray();
        return arr;
    }

    async getComments(commIds) {
        let arr = await this.comm
                            .find({$or: commIds.map(id => ({_id: id}))})
                            .toArray();
        return arr;
    }
}

module.exports = Articles;