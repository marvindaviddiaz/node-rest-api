const db = require('../util/database');

module.exports = class Post {

    constructor(id, title, content, imageUrl, creatorName, createdAt) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.imageUrl = imageUrl;
        this.creatorName = creatorName;
        this.createdAt = createdAt;
    }

    static find() {
        return db.execute('' +
            'select id, ' +
            'title, ' +
            'content, ' +
            'image_url imageUrl, ' +
            'creator_name creatorName, ' +
            'created_at createdAt ' +
            'from post');
    }

    static findById(id) {
        return db.execute('select id, title, content, image_url imageUrl, creator_name creatorName, created_at createdAt from post where id = ?', [id]);
    }

    save() {
        return db.execute('insert into post(id, title, content, image_url, creator_name, created_at) values (?, ? ,? ,?, ?, ?)',
            [this.id, this.title, this.content, this.imageUrl, this.creatorName, this.createdAt]);
    }

    update() {
        return db.execute('update post set title =?, content =?, image_url=? where id = ?',
            [this.title, this.content, this.imageUrl, this.id]);
    }

    delete() {
        return db.execute('delete from post where id = ?',
            [this.id]);
    }

};
