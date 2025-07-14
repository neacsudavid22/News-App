import Article from "../models/Article.js";
import User from "../models/User.js";
import mongoose from 'mongoose';

const getArticles = async (category, tag = "", page = 0, authorId = '') => {
    try {
      const searchObject = {};
  
      if (category) searchObject.category = category;
      if (tag) searchObject.tags = { $in: [tag] };
  
      if (authorId) {
        if (!mongoose.Types.ObjectId.isValid(authorId)) {
          return { error: true, message: "Must provide a valid id for author!" };
        }
  
        const author = await User.findById(authorId);
        if (!author || (author.account !== "author" && author.account !== "admin")) {
          return { error: true, message: "Author not found or not valid!" };
        }
  
        searchObject.author = authorId;
      }
  
      return await Article.find(searchObject)
                          .skip((page) * 20) .limit(20)
                          .sort({ updatedAt: -1 }).exec();  
    } catch (err) {
      console.error(`getArticles Error: ${err.message}`);
      return { error: true, message: "Internal Server Error" };
    }
  };

  const getArticlesForHomepage = async (category, tag = "", page = 0, authorId = '') => {
    try {
      const searchObject = {};
  
      if (category) searchObject.category = category;
      if (tag) searchObject.tags = { $in: [tag] };
  
      if (authorId) {
        if (!mongoose.Types.ObjectId.isValid(authorId)) {
          return { error: true, message: "Must provide a valid id for author!" };
        }
  
        const author = await User.findById(authorId);
        if (!author || (author.account !== "author" && author.account !== "admin")) {
          return { error: true, message: "Author not found or not valid!" };
        }
  
        searchObject.author = authorId;
      }
  
      return await Article.find(searchObject).select("-likes -shares -saves -comments")
                          .skip((page) * 20) .limit(20)
                          .sort({ updatedAt: -1 }).exec();  
    } catch (err) {
      console.error(`getArticles Error: ${err.message}`);
      return { error: true, message: "Internal Server Error" };
    }
  };

const getArticleById = async (id, comments = false) => {
    try {
        const populateArray = [
            { path: 'author', select: 'username name' }
        ];
        if (comments) {
            populateArray.push({ path: 'comments.userId', select: 'username' });
        }

        const article = await Article.findById(id)
            .populate(populateArray)
            .lean();

        if (!article) {
            return { error: true, message: "Article not found" };
        }
        return article;
    } catch (err) {
        console.error(`getArticleById Error: ${err.message}`);
        return { error: true, message: "Internal Server Error" };
    }
}

const getSavedArticles = async (userId, page = 0) => {
    try {
        const response = await User.find({_id: userId}).select('savedArticles').exec();
        const { savedArticles } = response[0];
        return await Article.find({ _id: { $in: savedArticles } })
            .sort({ updatedAt: -1 }) 
            .skip(page * 20)
            .limit(20);
    } catch (err) {
        console.error(`getSavedArticles Error: ${err.message}`);
        return { error: true, message: "Internal Server Error" };
    }
};

const createArticle = async (article) => {
    try{
        const newArticle = await Article.create(article)
        if(!newArticle){
            return { error: true, message: "Error creating article" };
        }
        return newArticle;
    }
    catch (err) {
        console.error(`createArticle Error: ${err.message}`);
        return { error: true, message: err.message };
    }
}

const deleteArticle = async (id) => {
    try{
        const deletedArticle = await Article.findOneAndDelete({_id: id})
        if(!deletedArticle){
            return { error: true, message: "Error deleting article" };
        }
        return deletedArticle;
    }
    catch (err) {
        console.error(`deleteArticle Error: ${err.message}`);
        return { error: true, message: "Internal Server Error" };
    }
}

const updateArticle = async (id, article) => {
    try{
        const updatedArticle = await  Article.updateOne({_id: id}, article)
        if(!updatedArticle){
            return { error: true, message: "Error updating article" };
        }
        return updatedArticle;
    }
    catch (err) {
        console.error(`updateArticle Error: ${err.message}`);
        return { error: true, message: "Internal Server Error" };
    }
}

const interactOnArticle = async (articleId, user, interaction = 'likes') => {
    try {
      if (interaction !== "likes" && interaction !== "saves") {
        return { error: true, message: "Invalid operation: " + interaction };
      }
  
      const article = await Article.findById(articleId).select("likes saves").exec();
      if (!article) {
        return { error: true, message: "Article not found" };
      }
  
      let userResult = null;
     
      const alreadyInteracted = article[interaction].some(id => 
        id.toString() === user._id.toString()
      );
  
      const articleUpdate = alreadyInteracted
        ? { $pull: { [interaction]: user._id } }
        : { $addToSet: { [interaction]: user._id } };
  
      const articleResult = await Article.updateOne(
        { _id: articleId },
        articleUpdate,
        { new: true, timestamps: false }
      );

      if (interaction === "saves") {
  
        userResult = await User.updateOne(
          { _id: user._id },
          alreadyInteracted
            ? { $pull: { savedArticles: article._id } }
            : { $addToSet: { savedArticles: article._id } },
          { new: true, timestamps: false }
        );
      }
  
      return { articleResult, userResult };
  
    } catch (err) {
      console.error(`${interaction}Post Error: ${err.message}`);
      return { error: true, message: "Internal Server Error" };
    }
  };

const postComment = async (articleId, userId, content, responseTo) => {
  try {
    const article = await Article.findById(articleId).select('comments');
    if (!article) {
      return { error: true, message: "Article not found" };
    }

    article.comments.push({ userId, content, responseTo });

    const result = await Article.updateOne(
      { _id: articleId },
      { $set: { comments: article.comments } },
      { timestamps: false }
    );

    if (!result.acknowledged || result.modifiedCount === 0) {
      return { error: true, message: "Error updating comments on article post" };
    }

    const newComment = article.comments[article.comments.length - 1];

    return newComment;
  } catch (err) {
    console.error(`postComment Error: ${err.message}`);
    return { error: true, message: "Internal Server Error" };
  }
};


const deleteComment = async (articleId, commentId, isLastNode, account) => {
    try {
        let updatedArticlePost;

        if (isLastNode === true) {
            // Remove the entire comment from the comments array
            updatedArticlePost = await Article.findByIdAndUpdate(
                { _id: articleId},
                { $pull: { comments: { _id: commentId } } },
                { new: true, timestamps: false }
            );
        } else {
            // If it got replies, mark it as deleted instead of removing
            updatedArticlePost = await Article.findOneAndUpdate(
                { _id: articleId, "comments._id": commentId },
                { 
                    $set: { 
                        "comments.$.content": account === 'admin' ? "removed by admin" : "deleted", 
                        "comments.$.removed": true 
                    }
                },
                { new: true, timestamps: false }
            );
        }

        if (!updatedArticlePost) {
            return { error: true, message: "Error deleting comment on article post" };
        }

        return updatedArticlePost.comments; 
    } 
    catch (err) {
        console.error(`deleteComment Error: ${err.message}`);
        return { error: true, message: "Internal Server Error" };
    }
};

const deleteGarbageComments = async (articleId, deleteIds) => {
    try {
      const result = await Article.updateOne(
        { _id: articleId },
        {
          $pull: {
            comments: {
              _id: { $in: deleteIds },
            },
          },
        },
        { timestamps: false }
      );
  
      return { modifiedCount: result.modifiedCount };
    } catch (err) {
      console.error(`deleteGarbageComments Error: ${err.message}`);
      return { error: true, message: "Internal Server Error" };
    }
  };

const getAllImageUrls = async () => {
    try {
      const allArticles = await Article.find({}).select("_id articleContent background");
  
      const contentImageUrls = allArticles.flatMap((article) =>
        article.articleContent
          .filter((contentBlock) => contentBlock.contentType === "Image")
          .map((contentBlock) => contentBlock.content)
      );

      const backgroundUrls = allArticles.flatMap((article) => article.background);

      const imageUrls = [...contentImageUrls, ...backgroundUrls];
      
      return imageUrls
    } catch (err) {
      console.error(`getAllImageUrls Error: ${err.message}`);
      return { error: true, message: "Internal Server Error" };
    }
};

const getComments = async (page = 1, pageSize = 5) => {
  try {
    const articles = await Article.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .select('comments') 
      .populate({
        path: 'comments.userId',
        select: 'username'
      })
      .lean();

    const allComments = articles.flatMap(article =>
      (article.comments || []).map(comment => ({
        articleId: article._id,
        _id: comment._id,
        userId: comment.userId?._id || comment.userId,
        username: comment.userId?.username || '',
        content: comment.content,
        createdAt: comment.createdAt || Date.now()
      }))
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return { comments: allComments };
  } catch (err) {
    console.error(`getComments Error: ${err.message}`);
    return { error: true, message: "Internal Server Error" };
  }
};

const getUserInteractionData = async (interactionType = 'saves') => {
  try {
    const path = `$${interactionType}`;
    const userIdPath = interactionType === 'comments' ? `${path}.userId` : path;

    const pipeline = [
      { $unwind: path },
      { $addFields: { userId: userIdPath } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          id: '$_id',
          article_category: '$category',
          user_age: {
            $dateDiff: {
              startDate: '$user.birthdate',
              endDate: '$$NOW',
              unit: 'year'
            }
          },
          user_gender: '$user.gender',
          user_address: '$user.address',
          friend_count: { $size: '$user.friendList' },
          _id: 0
        }
      }
    ];

    const result = await Article.aggregate(pipeline).exec();
    return result;
  } catch (err) {
    console.error(`getUserInteractionData Error: ${err.message}`);
    return { error: true, message: "Internal Server Error" };
  }
}

export {
    getArticles,
    getArticleById,
    createArticle,
    deleteArticle,
    updateArticle,
    interactOnArticle,
    postComment,
    deleteComment,
    deleteGarbageComments,
    getAllImageUrls,
    getSavedArticles,
    getComments,
    getUserInteractionData,
    getArticlesForHomepage
}