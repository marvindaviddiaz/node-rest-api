module.exports = class PostDTO {
    constructor(post) {
        if (post) {
            this._id = post.id;
            this.title = post.title;
            this.content = post.content;
            this.imageUrl = post.imageUrl;
            this.creator = {};
            this.creator.name = post.creatorName;
            this.createdAt = post.createdAt;
        }
    }


};
