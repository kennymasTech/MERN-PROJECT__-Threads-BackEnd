const Post = require("../models/postModel");
const User = require("../models/userModel");

const createPost = async (req, res) => {
  try {
    const { postedBy, text, img } = req.body;

    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ message: "PostedBy And Text Field Are Required" });
    }

    const user = await User.findById(postedBy);

    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }

    const maxLength = 500;

    if (text.length > maxLength) {
      return res.status(400).json({
        message: `Text Length Must Be Less Than ${maxLength} characters`,
      });
    }

    const newPost = new Post({ postedBy, text, img });

    await newPost.save();

    res.status(201).json({ message: "Post Created Successfully", newPost });
  } catch (error) {
    res.status(500).json({ message: error.message }); //Internal server error
    console.log("Error In FollowUnFollowUser: ", error.message);
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ message: error.message }); //  Internal Server Error
    console.log("Error In GetPost: ", error.message);
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Unauthorized To Delete This Post" });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message }); //  Internal Server Error
    console.log("Error In Deleting A Post: ", error.message);
  }
};

const likeUnlikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post Unliked Successfully" });
    } else {
      post.likes.push(userId);
      await post.save();

      res.status(200).json({ message: "Post Liked Successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message }); //  Internal Server Error
    console.log("Error In LikeUnlike Post: ", error.message);
  }
};

const replyToPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;

    if (!text) {
      return res.status(400).json({ message: "Text Field Is Required" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    const reply = { userId, text, userProfilePic, username };

    post.replies.push(reply);
    await post.save();

    res.status(200).json({ message: "Reply Added Successfully", post });
  } catch (error) {
    res.status(500).json({ message: error.message }); //  Internal Server Error
    console.log("Error In Reply To Post: ", error.message);
  }
};

module.exports = {
  createPost,
  getPost,
  deletePost,
  likeUnlikePost,
  replyToPost,
};
