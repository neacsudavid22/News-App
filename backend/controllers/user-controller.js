import User from '../models/User.js';

async function getUsers(){
    try{
        return await User.find()
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
        return await User.create(user)
    }
    catch (err) {
        console.error(`createUser Error: ${err.message}`);
        process.exit(1);
    }
}

async function deleteUser(id){
    try{
        return await User.deleteOne({_id: id})
    }
    catch (err) {
        console.error(`deleteUser Error: ${err.message}`);
        process.exit(1);
    }
}

async function updateUser(id, user){
    try{
        return await User.updateOne({_id: id}, user)
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