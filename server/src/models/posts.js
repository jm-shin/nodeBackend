const mongoose = require('mongoose');
const { Schema } = mongoose;

const Comment = new Schema({
    createdAt: {type: Date, default: Date.now},
    username: String,
    text: String
});

const Post = new Schema({
    createdAt: {type: Date, default: Date.now},
    count: Number,
    username: String,
    content: String,
    likesCount: {type: Number, default: 0},
    likes: {type: String, default: []},
    comments: {
        type: [Comment],
        default: [],
    }
});

//list
Post.statics.list = function ({cursor, username, self}) {
    // cursor, username의 값은 존재유무에 따라 쿼리가 유동적으로 설정된다.
    const query = Object.assign(
        { },
        cursor? {_id: {$lt: cursor}} : { },
        username? {username}: { }
    );

    const projection = self ? {
        count: 1,
        username: 1,
        content: 1,
        comments: 1,
        likes: {
            '$elemMatch': { '$eq': self }
        },
        likesCount: 1,
        createdAt: 1
    } : { };

    return this.find(query, projection)
        .sort({_id: -1})
        .limit(20)
        .exec();
};

Post.statics.like = function ({_id, username}) {
    return this.findByIdAndUpdate(_id, {
        $inc: {likesCount: -1},
        $push: {likes: username},
    }, {
        new: true,
        select: 'likesCount',
    }).exec();
};

Post.statics.unlike = function({_id, username}) {
    return this.findByIdAndUpdate(_id, {
        $inc: { likesCount: -1 },
        $pull: { likes: username }
    }, {
        new: true,
        select: 'likesCount'
    });
};

Post.methods.writeComment = function({username, text}) {
    this.comments.unshift({
        username, text
    });
    return this.save();
};

module.exports = mongoose.model('Post', Post);
