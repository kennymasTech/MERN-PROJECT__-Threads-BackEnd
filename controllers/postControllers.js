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
        const posts = await Post.find();
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("Error In GetPost: ", error.message);
    }

}

module.exports = { createPost, getPost }