import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js' 
import { 
        getUsers, getUserById, createUser, deleteUser, 
        updateUser, loginUser, sendFriendRequest,
        handleFriendRequest, shareArticle, 
        removeFriend, markAsRead
    } from '../controllers/user-controller.js'

const usersRouter = express.Router();

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

        if (result.error && result.message !== "User not found" ) {
            return res.status(400).json({ message: result.message });
        }

        const username = result.message === "User not found" ? "Removed User" : result.username

        return res.status(200).json(username);
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
        if(result.account !== "author" && result.account !== "admin"){
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

    usersRouter.route('/friend-request/:fid').post(authMiddleware, async (req, res) => {
        const method = req.body.method;
        
        const result = await sendFriendRequest(req.user._id, req.params.fid, method);

        if (result.error && !result.show) {
            return res.status(400).json({ show: false, message: result.message });
        }
    
        return res.status(200).json(result); 
    });

    usersRouter.route('/handle-request/:fid').put(authMiddleware, async (req, res) => {
        const action = req.body.action;
        
        const result = await handleFriendRequest(req.user._id, req.params.fid, action)
    
        if (result.error && !result.show) {
            return res.status(400).json({ show: false, message: result.message });
        }
    
        return res.status(200).json(result); 
    });


    usersRouter.route('/remove-friend/:fid').put(authMiddleware, async (req, res) => {
        const result = await removeFriend(req.user._id, req.params.fid);
    
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
    
    usersRouter.get("/refresh-token", authMiddleware, async (req, res) => {
        try {
            const user = await getUserById(req.user._id);
            if (!user) {
                return res.status(400).json({ message: "User not found" });
            }
            const forRefresh = true;
            const result = await loginUser(user.username, user.password, forRefresh);
    
            res.clearCookie("token", {
                httpOnly: true,
                sameSite: "Lax"
            });
    
            res.cookie("token", result.token, {
                httpOnly: true,
                sameSite: "Lax",
                maxAge: 60 * 60 * 1000
            });
    
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error refreshing token:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });

    usersRouter.get("/check-auth", (req, res) => {
        if (req.cookies.token) {
            return res.json({ authenticated: true });
        }
        return res.json({ authenticated: false });
    });

    usersRouter.get("/user-by-token", authMiddleware, async (req, res) => {
        const user = await getUserById(req.user._id);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    });

    usersRouter.put("/share-article-to/:fid", authMiddleware, async (req, res) => {
        try {
            const result = await shareArticle(req.user._id, req.body.articleId, req.params.fid);
            if (result.error) {
                return res.status(400).json({ message: result.message });
            }
    
            return res.status(200).json(result);
        } catch(err){
            console.error(err);
        }
    })

    usersRouter.put("/mark-as-read/:snid", authMiddleware, async (req, res) => {
        try {
            const result = await markAsRead(req.user._id, req.params.snid);
            if (result.error) {
                return res.status(400).json({ message: result.message });
            }
    
            return res.status(200).json(result);
        } catch(err){
            console.error(err);
        }
    })
    
export default usersRouter;