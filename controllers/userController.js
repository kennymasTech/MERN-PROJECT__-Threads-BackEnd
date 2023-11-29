const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generateTokenAndSetCookie = require("../utils/helper/generateTokenAndSetCookies");
const mongoose = require("mongoose");



const getUserProfile = async (req, res, next) => {
    // We Fetch The User Profile Either By Username Or UserId
    // Query Is Either Username Or UserId

    const { query } = req.params;
    try {
        let user;

        // Query Is UserId
        if(mongoose.Types.ObjectId.isValid(query)) {
            user = await User.findOne({_id: query}).select("-password").select("-updateAt");
        } else {
            // Query Is Username
            user = await User.findOne({ username: query }).select("-password").select("-updateAt");
        }

        if(!user)
        return res.status(400).json({ error: "User Not Found" });
            res.status(200).json({ message: "Successfully Found A User"})
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("Error In Getting User Profile: ", error.message);
    }

}

const signUpUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
      });
    } else {
      res.status(400).json({ message: "Invalid User Data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error In SignupUser: ", error.message);
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid Username Or Password" }); //bad request
    }

    if (user.isFrozen) {
      user.isFrozen = false;
      await user.save();
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ message: error.message }); //Internal server error
    console.log("Error In LoginUser: ", error.message);
  }
};

const logoutUser = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "User Logged Out Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message }); //Internal server error
    console.log("Error In Logout", error.message);
  }
};

const followUnFollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You Can Not Follow/Unfollow Yourself" });
    }
    if (!userToModify || !currentUser) {
      return res.status(400).json({ error: "User Not Found" });
    }

    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      //Unfollow User
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ mesage: "User Unfollowed Successfully" });
    } else {
      //FOLLOW USER
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      res.status(200).json({ mesage: "User Followed Successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message }); //Internal server error
    console.log("Error In FollowUnFollowUser: ", error.message);
  }
};

module.exports = { followUnFollowUser, signUpUser, loginUser, logoutUser, getUserProfile };
