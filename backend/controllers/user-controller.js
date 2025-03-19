import User from '../models/User.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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

const getUsername = async (id) => {
    try{
        const {username} = await User.findById(id).select("username")
        if(!username){
            return { error: true, message: "User not found" };
        }
        return username
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
        const updatedUser = await User.updateOne({_id: id}, user)
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

const loginUser = async (username, password) => {
    try {
        const user = await User.findOne({ username }).exec();
        if (!user) return { error: true, message: "User doesn't exist" };

        // Compare password with hashed version
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return { error: true, message: "Invalid password" };

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
    getUsername
}