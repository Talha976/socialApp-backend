const mongoose = require('mongoose')

const createdPost = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
      },
      content: {
        type: String
      },
      image: {
        type: String
      },
      likes : [
       {
        type : mongoose.Schema.ObjectId,
        ref: 'User'
       }
      ],
      comments : [
        {
          user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required : true
          },
          comments: {
            type: String,
            required: true,
          }, 
          createdAt : {
            type : Date,
            default : Date.now
          }
        }, 
      ]
    }, { timestamps: true });

const CreatePost = mongoose.model('CreatePost',createdPost)
module.exports = CreatePost