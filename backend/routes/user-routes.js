import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js' 
import { getUsers, getUserById, createUser, deleteUser, updateUser, loginUser, sendFriendRequestById, sendFriendRequestByUsername, declineFriendRequest, acceptFriendRequest } from '../controllers/user-controller.js'

const usersRouter = express.Router()

    usersRouter.route('/user').get(authMiddleware, async (req, res) => {
        const category = req.query.category

        const result = await getUsers(category);

        if (result.error) {
            return res.status(400).json({ message: result.message });
        }

        return res.status(200).json(result);
    })

    usersRouter.route('/username/:id').get( async (req, res) => {
        const result = await getUserById(req.params.id);

        if (result.error) {
            return res.status(400).json({ message: result.message });
        }

        return res.status(200).json(result.username);
    })

    usersRouter.route('/user').post(async (req, res) => {
        const result = await createUser(req.body);

        if (result.error) {
            return res.status(400).json({ message: result.message });
        }

        return res.status(200).json(result);
    })

    usersRouter.route('/user/:id').get(authMiddleware, async (req, res) => {
        const result = await getUserById(req.params.id)
        if (result.error) {
            return res.status(400).json({ message: result.message });
        }

        return res.status(200).json(result);
    })
    
    usersRouter.route('/author/:id').get(async (req, res) => {
        const result = await getUserById(req.params.id)
        if(result.account !== "author"){
            return res.status(400).json({ message: "User is not an author" });
        }

        if (result.error) {
            return res.status(400).json({ message: result.message });
        }

        return res.status(200).json(result.name);
    })

    usersRouter.route('/user/:id').delete(authMiddleware, async (req, res) => {
        const result = await deleteUser(req.params.id)
        if (result.error) {
            return res.status(400).json({ message: result.message });
        }

        return res.status(200).json(result);
    })

    usersRouter.route('/user/:id').put(authMiddleware, async (req, res) => {
        const result = await updateUser(req.params.id, req.body);
        if (result.error) {
            return res.status(400).json({ message: result.message });
        }
        
        return res.status(200).json(result);
    })

    usersRouter.route('/user/:id/friend-request-by-id').post(async (req, res) => {
        const result = await sendFriendRequestById(req.params.id, req.body.friendId);
    
        if (result.error && !result.show) {
            return res.status(400).json({ show: false, message: result.message });
        }
    
        return res.status(200).json(result); 
    });

    usersRouter.route('/user/:id/friend-request-by-username').post(async (req, res) => {
        const result = await sendFriendRequestByUsername(req.params.id, req.body.friendUsername);
    
        if (result.error && !result.show) {
            return res.status(400).json({ show: false, message: result.message });
        }
    
        return res.status(200).json(result); 
    });

    usersRouter.route('/user/:id/accept-friend-request-by-id').post(async (req, res) => {
        const result = await acceptFriendRequest(req.params.id, req.body.friendId);
    
        if (result.error && !result.show) {
            return res.status(400).json({ show: false, message: result.message });
        }
    
        return res.status(200).json(result); 
    });

    usersRouter.route('/user/:id/decline-friend-request-by-id').post(async (req, res) => {
        const result = await declineFriendRequest(req.params.id, req.body.friendId);
    
        if (result.error && !result.show) {
            return res.status(400).json({ show: false, message: result.message });
        }
    
        return res.status(200).json(result); 
    });

    usersRouter.route('/login').post(async (req, res) => {
        const result = await loginUser(req.body.username, req.body.password);

        if (result.error) {
            return res.status(400).json({ message: result.message });
        }

        res.cookie("token", result.token, {
            httpOnly: true,
            sameSite: "Lax", 
            maxAge: 60 * 60 * 1000  
        });

        return res.status(200).json(result);
    })

    usersRouter.post("/logout", authMiddleware, (req, res) => {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "Lax"
        });
        return res.status(200).json({ message: "Logged out successfully" });
    });

    usersRouter.get("/user-by-token", authMiddleware, async (req, res) => {
        return res.status(200).json({ user: req.user });
    });
    
export default usersRouter;