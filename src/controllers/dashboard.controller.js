import mongoose from "mongoose";
import { Video } from "../models/video.models.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

  const allLikes = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $group: {
        _id: null,
        totalVideoLikes: {
          $sum: {
            $cond: [
              {
                $ifNull: ["$video", false],
              },
              1, // not null then add 1
              0, // else 0
            ],
          },
        },
        totalTweetLikes: {
          $sum: {
            $cond: [{ $ifNull: ["$tweet", false] }, 1, 0],
          },
        },
        totalTweetLikes: {
          $sum: {
            $cond: [{ $ifNull: ["$tweet", false] }, 1, 0],
          },
        },
        totalCommentLikes: {
          $sum: {
            $cond: [{ $ifNull: ["$comment", false] }, 1, 0],
          },
        },
      },
    },
  ]);

  // total subscriber
  const allSubscribes = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(req.user._id)
      }
    },
    {
      $count: "subscribers"
    }
  ])

  // total videos
  const allVideo = await Video.aggregate([
    {
      $match: {
        videoOwner: new mongoose.Types.ObjectId(req.user._id)
      }
    },
    {
      $count: "videos"
    }
  ])

  // total views 
  const allViews = await Video.aggregate([
    {
      $match: {
        videoOwner: new mongoose.Types.ObjectId(req.user._id)
      }
    },
    {
      $group: {
        _id: null,
        allVideoViews: {
          $sum: "$views"
        }
      }
    }
  ])

  const stats = {
    Subscribers: allSubscribes[0].subscribers,
    totalVideo: allVideo[0].Videos,
    totalVideoViews: allViews[0].allVideoViews,
    totalVideoLikes: allLikes[0].totalVideoLikes,
    totalTweetLikes: allLikes[0].totalTweetLikes,
    totalCommentLikes: allLikes[0].totalCommentLikes
  }

  // return responce
  return res.status(200).json(
    new ApiResponse(
      200, 
      stats,
      "fetching channel stats successfully!!"
    )
  )

});


// get channel videos
const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel

  const allVideo = await Video.find({
    videoOwner: req.user._id
  })

  if(!allVideo){
    throw new ApiError(
      500,
      "something went wrong while fetching channel all videos!!"
    )
  }

  return res.status(200).json(
    new ApiResponse(
      200, 
      allVideo,
      "All videos fetched successfully !!"
    )
  )
});

export { getChannelStats, getChannelVideos };
