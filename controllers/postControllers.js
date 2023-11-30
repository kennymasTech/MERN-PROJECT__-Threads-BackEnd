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

        const newPost
        
    } catch (error) {
        res.status(500).json({ message: error.message }); //Internal server error
        console.log("Error In FollowUnFollowUser: ", error.message);
    }
}

module.exports = { createPost }