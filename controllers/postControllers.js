const Post = require("../models/postModel");
const User = require("../models/userModel");

const createPost = async (req, res) => {
    try {
        const { postedBy, text, img } = req.body;

        if( !postedBy || !text ) {
            return res.status(400).json({ message: "PostedBy And Text Field Are Required" })
        }

        const user = await User.findById(postedBy);

        if ( !user ) {
            return res.status(400).json({ message: "User Not Found" })
        }

        const maxLength = 500

        if ( text.length > maxLength ) {
            return res.status(400).json({ message: `Text Length Must Be Less Than ${maxLength} characters` })
        }

        const newPost = new Post({ postedBy, text, img})

        await newPost.save();

        res.status(201).json({ message: "Post Created Successfully", newPost })
        
    } catch (error) {
        res.status(500).json({ message: error.message }); //Internal server error
        console.log("Error In FollowUnFollowUser: ", error.message);
    }
}

const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if ( !post ) {
            return res.status(404).json({ message: "Post Not Found" })
        }

        res.status(200).json({post})

    } catch (error) {
        res.status(500).json({ message: error.message });  //  Internal Server Error
        console.log("Error In GetPost: ", error.message);
    }

}

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if ( !post ) {
            return res.status(404).json({ message: "Post Not Found" })
        }

        await post.deleteOne();

        res.status(200).json({ message: "Post Deleted Successfully" })

    } catch (error) {
        res.status(500).json({ message: error.message });  //  Internal Server Error
        console.log("Error In Delete Post: ", error.message);
    }

}

module.exports = { createPost, getPost, deletePost }