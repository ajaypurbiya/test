import { Router } from "express";
import {
    addComment,
    getVideoComments,
    getTweetComments,
    updateComment,
    deleteComment,
    addCommentToTweet,
    updateCommentToTweet,
    deleteCommentToTweet
} from '../controllers/comment.controllers.js'

import { verifyJWT } from '../middlewares/auth.middlewares.js'


const router = Router()

router.use(verifyJWT); // apply in all

router.route("/video/:videoId").get(getVideoComments).post(addComment);
router.route("/tweet/:tweetId").get(getTweetComments).post(addCommentToTweet);

router.route("/video/c/:commentId").delete(deleteComment).patch(updateComment);
router.route("/tweet/c/:commentId").delete(deleteCommentToTweet).patch(updateCommentToTweet);

export default router