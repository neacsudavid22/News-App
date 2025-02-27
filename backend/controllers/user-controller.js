import mongoose from 'mongoose';
import User from '../models/User.js';

async function getUsers(){
    try{
        const data = await User.find()
        return data
    }
    catch (err) {
        console.error(`getUsers Error: ${err.message}`);
        process.exit(1);
    }
}

async function getAuthUser(username, password){
    try{
        const data = await User.findOne().where({username: username, password: password})
        return data ? data : {message: "no match for username and password"}
    }
    catch (err) {
        console.error(`getUsers Error: ${err.message}`);
        process.exit(1);
    }
}

async function getUserById(id){
    try{
        const data = await User.findById(id)
        return data
    }
    catch (err) {
        console.error(`getUsersById Error: ${err.message}`);
        process.exit(1);
    }
}

async function createUser(user){
    try{
        const data = await User.create(user)
        return { message: `User ${data._id} succesfully created`, result: data }
    }
    catch (err) {
        console.error(`createUser Error: ${err.message}`);
        process.exit(1);
    }
}

async function deleteUser(id){
    try{
        const data = await User.deleteOne({_id: id})
        return { message: `User succesfully deleted`, result: data }
    }
    catch (err) {
        console.error(`deleteUser Error: ${err.message}`);
        process.exit(1);
    }
}

async function updateUser(id, user){
    try{
        const data = await User.updateOne({_id: id}, user)
        return { message: `User succesfully updated`, result: data }
    }
    catch (err) {
        console.error(`updateUser Error: ${err.message}`);
        process.exit(1);
    }
}

export {
    getUsers,
    getUserById,
    createUser,
    deleteUser,
    updateUser,
    getAuthUser
}