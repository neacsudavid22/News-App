import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const Article = model('Article', new Schema({
  title:  {
    type: String,
    required: [true, "Title is required"],
    unique: true,
    minlength: [10, 'Title must be at least 10 characters long']
  },
  author: {
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: [true, "Author is required"],
  },
  main: { type: Boolean, default: false },
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
      enum: ['p', 'h2', 'Image'], 
      default: 'p'
    }
  }],
  background: { type: String, required: true },
  likes: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    default: []
  },
  saves: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
      default: []
  },
  shares: {
      type: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
      }], 
      default: []
  },
  comments: {
      type: [{
          content: String,
          removed: {type: Boolean, default: false }, 
          userId: {
              type: Schema.Types.ObjectId,
              ref: 'User', 
          },
          responseTo: { 
            type: Schema.Types.Mixed,
            default: null,
            validate: {
                validator: function(value) {
                return value === null || mongoose.isValidObjectId(value);
              }
            } 
          }   
      }],
      default: [] 
  }
}, { timestamps: true }));

export default Article;