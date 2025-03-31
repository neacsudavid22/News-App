import User from '../models/User.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from 'mongoose';

const getUsers = async () => {
    try {
        const users = await User.find();
        if (users.length === 0) {
            return { error: true, message: "No users found" };
        }
        return users;
    } catch (err) {
        console.error(`getUsers Error: ${err.message}`);
        return { error: true, message: "Internal Server Error" };
    }
}

const getUserById = async (id) => {
    try{
        const user = await User.findById(id)
        if(!user){
            return { error: true, message: "User not found" };
        }
        return user
    }
    catch (err) {
        console.error(`getUsersById Error: ${err.message}`);
        return { error: true, message: "Internal Server Error" };
    }
}

const createUser = async (user) => {
    try{
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        user.password = await bcrypt.hash(user.password, salt);
        
        const newUser = await User.create(user);
        if(!newUser){
            return { error: true, message: "Error creating user" };
        }
        return newUser;
    }
    catch (err) {
        console.error(`createUser Error: ${err.message}`);
        return { error: true, message: "Internal Server Error" };
    }
}

const deleteUser = async (id) => {
    try{
        const deletedUser = await User.deleteOne({_id: id})
        if(!deleteUser){
            return { error: true, message: "Error deleting user" };
        }
        return deletedUser;
    }
    catch (err) {
        console.error(`deleteUser Error: ${err.message}`);
        return { error: true, message: "Internal Server Error" };
    }
}

const updateUser = async (id, user) => {
    try{
        if(user.password){
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            user.password = await bcrypt.hash(user.password, salt);
        }
        const updatedUser = await User.updateOne({_id: id}, user);
        if(!updatedUser){
            return { error: true, message: "Error updating user" };
        }
        
        return updatedUser;
    }
    catch (err) {
        console.error(`updateUser Error: ${err.message}`);
        return { error: true, message: "Internal Server Error" };
    }
}

const sendFriendRequestById = async (id, friendId) => {
    try {
        if(!mongoose.Types.ObjectId.isValid(friendId)){
            return { error: true, message: "Must provide an valid id!" };
        }

        const user = await User.findById(id).select('_id');
        if (!user) {
            return { error: true, message: "Error: current user id not found" };
        }

        const userFriend = await User.findById(friendId).select('friendRequests');
        if (!userFriend) {
            return { error: true, show: true, message: "Friend not found, wrong id!" };
        }

        if(user.friendList && user.friendList.includes(userFriend._id)){
            return { error: true, show: true, message: "You are already friend with this user!" };
        }


        if (userFriend.friendRequests && userFriend.friendRequests.includes(user._id)) {
            return { error: true, show: true, message: "Friend request already sent!" };
        }

        await User.updateOne({ _id: friendId }, { $addToSet: { friendRequests: user._id } });

        return { error: false, message: "Friend request sent succesfully!" };
    } catch (err) {
        console.error(`sendFriendRequestById Error: ${err.message}`);
        return { error: true, message: "Internal Server Error" };
    }
};

const sendFriendRequestByUsername = async (id, friendUsername) => {
    try {
        const user = await User.findById(id).select('_id');
        if (!user) {
            return { error: true, message: "Error: current user id not found" };
        }

        const userFriend = await User.findOne({username: friendUsername}).select('friendRequests');
        if (!userFriend) {
            return { error: true, show: true, message: "Friend not found, wrong username!" };
        }
 
        if(user.friendList && user.friendList.includes(userFriend._id)){
            return { error: true, show: true, message: "You are already friend with this user!" };
        }

        if (userFriend.friendRequests && userFriend.friendRequests.includes(user._id)) {
            return { error: true, show: true, message: "Friend request already sent!" };
        }

        await User.updateOne({ _id: userFriend._id }, { $addToSet: { friendRequests: user._id } });

        return { error: false, message: "Friend request sent succesfully!" };
    } catch (err) {
        console.error(`sendFriendRequestByUsername Error: ${err.message}`);
        return { error: true, message: "Internal Server Error" };
    }
};

const loginUser = async (username, password, forRefresh = false) => {
    try {
        const user = await User.findOne({ username }).exec();
        if (!user) return { error: true, message: "User doesn't exist" };

        // Compare password with hashed version
        if(!forRefresh){
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) return { error: true, message: "Invalid password" };
        }
        else if (password !== user.password) return { error: true, message: "Invalid password" };

        const userObj = user.toObject();
        delete userObj.password;

        // Generate JWT token
        const token = jwt.sign(
            { user: userObj }, process.env.JWT_SECRET, { expiresIn: "1h" }
        );

        if(!token) return { error: true, message: "Error generating token" };
        return { token };
    } catch (err) {
        console.error("Error with login:", err);
        return { error: true, message: "Internal Server Error" };
    }
};

export {
    getUsers,
    getUserById,
    createUser,
    deleteUser,
    updateUser,
    loginUser,
    sendFriendRequestById,
    sendFriendRequestByUsername
}