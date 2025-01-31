import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse} from "../utils/ApiResponse.js";
import { Tweet } from "../models/tweet.model.js";
import { Comment } from "../models/comment.model.js"


// get video comments
const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;


  //  for invalid video
  if (!isValidObjectId(videoId)){
    throw new ApiError(400, "This video is not valid")
  }

  // find video in database
  const video = await Video.findById(videoId)
  if(!video) {
    throw new ApiError(404, "video not found");
  }

  // match and finds all the comments
  const aggregateComments = await Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId)
      }
    }
  ])

  Comment.aggregatePaginate(aggregateComments, {
    page,
    limit 
  })
  .then((result) => {
    return res.status(201).json(
      new ApiResponse(200, result, "VideoComments fetched successfully!!"))
  })
  .catch((error) => {
    throw new ApiError(500, "something went wrong while fetching video Comments", error)
  })
});

// get tweet comments 
const getTweetComments = asyncHandler(async (req, res) =>{
  const { tweetId } = req.params
  const { page = 1, limit = 10 } = req.query

  if( !isValidObjectId(tweetId)){
    throw new ApiError(400, "This tweet id is not valid")
  }

  // find video in database
  const tweet = await Tweet.findById(tweetId);
  if(!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  // match and find all the comments
  const aggregateComments = await Tweet.aggregate([
    {
      $match: {
        tweet: new mongoose.Types.ObjectId(tweetId)
      }
    }
  ])

  Comment.aggregatePaginate(aggregateComments, {
    page,
    limit
  })

  .then((result) => {
    return res.status(201).json(
      new ApiResponse(200, result, "TweetComments fetched successfully!!")
    )
  })

  .catch((error) => {
    throw new ApiError(500, "someting went wrong fetching tweet Comments", error)
  })
})

// add comments to video
const addComment = asyncHandler(async (req, res) => {
  //TODO: add a comment to a video
  const { comment} = req.body;
  const { videoId } = req.params

  console.log("req.body", req.body)
  console.log("comment", comment)

  if( !comment || comment?.trim() ===""){
    throw new ApiError(400, "comment is required")
  }

  if(!isValidObjectId(videoId)){
    throw new ApiError(400, "comment is required")
  }

  const videoComment = await Comment.create({
    content: comment,
    video: videoId,
    owner: req.user._id
  })

  if(!videoComment) {
    throw new ApiError(500, "something went wrong while creating video comment")
  }

  // return response
  return res.status(201).json(
    new ApiResponse(200, videoComment, "video comment created successfully!!")
  );
});


// update comment to video
const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  
  const { newContent } = req.body;
  const { commentId } = req.params;

  if(!newContent || newContent?.trim()===""){
    throw new ApiError(400, "content is required")
  }

  if(!isValidObjectId(commentId)){
    throw new ApiError(400, "this video id is not valid")
  }

  const comment = await Comment.findById(commentId)

  if(!comment) {
    throw new ApiError(404, "comment not found")
  }

  const updateComment = await comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content: newContent
      }
    },
    {
      new: true
    }
  )
  if(!updateComment){
    throw new ApiError(500, "something went wrong while updating comment")
  }

  // return responce

  return res.status(201).json(
    new ApiResponse(200, updateComment, "comment update successfully!!")
  )
});

// delete comment to video
const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params

  if(!isValidObjectId(commentId)){
    throw new ApiError(400, "This video id is not valid")
  }

  const comment = await Comment.findById(commentId)

  if(!comment) {
    throw new ApiError(404, "comment not found!");
  }

  if(comment.owner.toString() !== req.user._id.toString()){
    throw new ApiError(403, "you don't have permission to delete this comment!");
  }

  const deleteComment = await Comment.deleteOne(req.user._id)

  if(!deleteComment){
    throw new ApiError(500, "something went wrong while deleting comment")
  }

  // return response

  return res.status(201).json(
    new ApiResponse(200, deleteComment, "comment deleted successfully!")
  )
});

// add comment to tweet 
const addCommentToTweet = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  const { tweetId } = req.params;

  if( !comment || comment?.trim()===""){
    throw new ApiError(400, "comment is required")
  }

  if(!isValidObjectId(tweetId)){
    throw new ApiError(400, "This tweet id is not valid")
  }

  const tweetComments = await Comment.create({
    content: comment,
    tweet: tweetId,
    owner: req.user._id
  })

  if(!tweetComments){
    throw new ApiError(500, "something went wrong while creating tweet comment")
  }

  // return response
  return res.status(201).json(
    new ApiResponse(200, tweetComments, "Tweet comment created successfully!")
  );
})

// update comment to tweet
const updateCommentToTweet = asyncHandler(async (req, res) =>{
  const { newContent } = req.body
  const { commentId } = req.params

  if(!newContent || newContent?.trim()=== ""){
    throw new ApiError(400, "content is requied")
  }

  if(!isValidObjectId(commentId)){
    throw new ApiError(400, "This video id is not valid")
  }

  const comment = await Comment.findById(commentId)

  if(!comment ){
    throw new ApiError(404, "comment not found!");
  }

  if(comment.owner.toString() !== req.user._id.toString()){
    throw new ApiError(403, "you don't have permission to update this comment!");
  }

  const updateComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set:{
        content: newContent
      }
    },
    {
      new: true
    }
  )

  // return responce
  return res.status(201).json(
    new ApiResponse(200, updateComment, "comment updated successfully!")
  )
})

const deleteCommentToTweet = asyncHandler(async (req, res) =>{
  const { commentId } = req.params

  if(!isValidObjectId(commentId)){
    throw new ApiError(400, "This tweet id is not valid")
  }

  const comment = await Comment.findById(commentId)

  if(!comment) {
    throw new ApiError(404, "comment not found!"); 
  }

  if(comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "you don't have permission to delete this comment!");
  }

  const deleteComment = await Comment.deleteOne(req.user._id)

  if(!deleteComment){
    throw new ApiError(500, "something went wrong while deleting comment")
  }

  // rerurn response
  return res.status(201).json(
    new ApiResponse(200, deleteComment, "commnet deleting successfully!!")
  )
})

export { 
  getVideoComments, 
  getTweetComments,
  addComment, 
  updateComment, 
  deleteComment,
  addCommentToTweet,
  updateCommentToTweet,
  deleteCommentToTweet,
};
