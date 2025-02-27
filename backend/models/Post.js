import mongoose from "mongoose";
const {Schema, SchemaTypes, model} = mongoose;

const Post = model('Post', new Schema({
    article: { 
        type: SchemaTypes.ObjectId, 
        ref: 'Article', 
        required: true 
    },
    likes: {
        type: [SchemaTypes.ObjectId],
        ref: 'User', 
        default: []
    },
    shares: {
        type: [SchemaTypes.ObjectId],
        ref: 'User', 
        default: []
    },
    comments: {
        type: [{
            _id: false,
            content: String,
            user: {
                type: SchemaTypes.ObjectId,
                ref: 'User', 
            },
            response: { type: Number, default: null }   
            // I will search in this array for the position of the comment it responses to
        }],
        default: [] }
}, { timestamps: true }));

export default Post;