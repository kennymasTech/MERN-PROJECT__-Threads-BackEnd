
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
        const user = await User.findOne({ username: username })
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")

        if(!user || !isPasswordCorrect) return res.status(400).json({ error: "Invalid Username Or Password"})

        if(user.isFrozen) {
            user.isFrozen = false
            await user.save()
        }

        generateTokenAndSetCookie(user._id, res)

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio,
            profilePi: user.profilePic
        })

    } catch (error) {
        res.status(500).json({ error: error.message})
        console.log("Error In loginUser:", error.message);
    }
};

const logOutUser = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 1})
        res.status(200).json({ message: "User logged Out Successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log("Error In Logging Out", error.message);
    }
}

module.exports = { signUpUser, loginUser, logOutUser };