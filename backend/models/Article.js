import mongoose from 'mongoose';
const { Schema, SchemaTypes, model } = mongoose;

const Article = model('Article', new Schema({
  title:  {
    type: String,
    required: [true, "Title is required"],
    unique: true,
    minlength: [10, 'Title must be at least 10 characters long']
  },
  author: {
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: [true, "Author is required"],
    minlength: 3
  },
  category: { 
    type: String,
    enum: ['politics', 'extern', 'finance', 'sports', 'tech', 'lifestyle'],
    required: true },
  tags: { 
    type: [String],
    default: [] 
    },
  backgroundUrl: String,
  articleContent: [{
    _id: false,
    content: String,
    contentType: {
      type: String,
      enum: ['p', 'h2', 'Image'], // others to come
      default: 'p'
    }
  }],
  background: { type: String, required: true },
  likes: {
    type: [SchemaTypes.ObjectId],
    ref: 'User', 
    default: []
  },
  saves: {
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
          responseTo: { type: Number, default: null }   
          // I will search in this array for the position of the comment it responses to
      }],
      default: [] 
  }
}, { timestamps: true }));

export default Article;