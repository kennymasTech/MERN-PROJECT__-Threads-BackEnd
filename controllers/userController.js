
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generateTokenAndSetCookie = require("../utils/helper/generateTokenAndSetCookies");

const signUpUser = async (req, res) => {
    try {
        const {name, email, password, username} = req.body;
        const user = await User.findOne({ $or:[ {email}, {username} ]});
        
        if(user) {
            return res.status(400).json({message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name, email, username, password: hashedPassword
        })

        await newUser.save();

        if(newUser) {

            generateTokenAndSetCookie(newUser._id, res)
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
            })
        } else { 
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
            res.status(500).json({ message: error.message });
            console.log("Error in signupUser: ", error.message)
        };
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await user.findOne({ username: username })
    } catch (error) {
        
    }
}

module.exports = { signUpUser, loginUser };