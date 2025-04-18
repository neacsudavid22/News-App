import User from '../models/User.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from 'mongoose';
import Article from '../models/Article.js';

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
        return user;
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
        if(!deletedUser){
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
        const updatedUser = await User.findByIdAndUpdate({_id: id}, user);
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

const sendFriendRequest = async (id, friend, method = "id") => {
    try {
        if (method === "id" && !mongoose.Types.ObjectId.isValid(friend)) {
            return { error: true, message: "Must provide a valid id!" };
        }

        const user = await User.findById(id).select('_id friendList');
        if (!user) {
            return { error: true, message: "Error: current user id not found" };
        }

        if (id === friend) {
            return { error: true, message: "This is your account" };
        }

        const queryKey = method === "id" ? "_id" : "username";
        const userFriend = await User.findOne({ [queryKey]: friend }).select('friendRequests');

        if (!userFriend) {
            return { error: true, show: true, message: "Friend not found, wrong id or username!" };
        }

        const isAlreadyFriend = user.friendList?.some(fId => fId.toString() === userFriend._id.toString());
        if (isAlreadyFriend) {
            return { error: true, show: true, message: "You are already friend with this user!" };
        }

        const requestAlreadySent = userFriend.friendRequests?.some(reqId => reqId.toString() === user._id.toString());
        if (requestAlreadySent) {
            return { error: true, show: true, message: "Friend request already sent!" };
        }

        await User.updateOne(
            { [queryKey]: friend },
            { $addToSet: { friendRequests: user._id } }
        );

        return { error: false, message: "Friend request sent successfully!" };
    } catch (err) {
        console.error(`sendFriendRequest Error: ${err.message}`);
        return { error: true, message: "Internal Server Error" };
    }
};


const handleFriendRequest = async (id, friendId, action = "accept") => {
    try {
        const user = await User.findById(id).select('_id friendRequests friendList');
        if (!user) {
            return { error: true, message: "Error: current user id not found" };
        }

        const userFriend = await User.findById(friendId).select('_id friendRequests friendList');
        if (!userFriend) {
            return { error: true, message: "Friend not found, wrong id!" };
        }

        const friendSetFriendRequests = new Set( user.friendRequests.map(r=>r.toString()));
        if (!friendSetFriendRequests.has(friendId)) {
            return { error: true, message: "No friend request found from this user!" };
        }

        await User.updateOne(
            { _id: id },
            { $pull: { friendRequests: friendId } }
        );

        if (action === 'accept') {
            await User.updateOne(
                    { _id: id },
                    { $push: { friendList: friendId } }
                );
            await User.updateOne(
                    { _id: friendId },
                    { $push: { friendList: id } }
                );
        }
        const message = `Friend request ${action}ed successfully!`;
        return { error: false, message: message };

    } catch (err) {
        console.error(`handleFriendRequest Error: ${err.message}`);
        return { error: true, message: "Internal Server Error" };
    }
};


const removeFriend = async (id, friendId) => {
    try {
        const user = await User.findById(id).select('_id friendList');
        if (!user) {
            return { error: true, message: "Error: current user id not found" };
        }

        const userFriend = await User.findById(friendId).select('_id friendList');
        if (!userFriend) {
            return { error: true, message: "Friend not found, wrong id!" };
        }

        const currentUserFriendsSet = new Set(user.friendList.map(id => id.toString()));

        if (!currentUserFriendsSet.has(friendId)) {
            return { error: true, message: "The user to be removed was not found in friendList!" };
        }

        const friendUserFriendsSet = new Set(userFriend.friendList.map(id => id.toString()));

        if (!friendUserFriendsSet.has(id)) {
            return { error: true, message: "The current user was not found in the removed user's friendList!" };
        }

        await User.updateOne(
            { _id: id },
            { $pull: { friendList: friendId } }
        );

        await User.updateOne(
            { _id: friendId },
            { $pull: { friendList: id } }
        );

        return { error: false, message: "Friend removed from friendList successfully!" };
    } catch (err) {
        console.error(`removeFriend Error: ${err.message}`);
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

const shareArticle = async (userId, articleId, friendId) => {
    try{
        const user = await User.findById(userId).exec();
        if (!user) return { error: true, message: "Your User doesn't exist" };

        const friend = await User.findById(friendId).exec();
        if (!friend) return { error: true, message: "friend User doesn't exist" };

        const article = await Article.findById(articleId).exec();
        if (!article) return { error: true, message: "Article doesn't exist" };

        const result = await User.updateOne(
            { _id: friend._id },
            {$addToSet: { 
                shareList: {sharedArticle: article._id, userFrom: user._id, sentAt: Date.now()} 
            }}
        );

        return { result };
    }catch(err){
        console.error("shareArticle error: " + err);
        return { error: true, message: "Internal Server Error" };
    }
}

const markAsRead = async (userId, shareId) => {
    try {
        const user = await User.findById(userId).select("_id shareList").exec();
        if (!user) return { error: true, message: "User doesn't exist" };

        const shareItem = user.shareList.id(shareId);
        if (!shareItem) return { error: true, message: "Share not found" };

        shareItem.read = true;

        await user.save();

        return { success: true, shareItem };
    } catch (err) {
        console.error("markAsRead error: ", err);
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
    sendFriendRequest,
    handleFriendRequest,
    shareArticle,
    removeFriend,
    markAsRead
}