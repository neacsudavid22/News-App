import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(403).json({ message: "Token required" });

    const token = authHeader.split(" ")[1]; 

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = decoded; // Attach user data to request object
        next(); // Move to the next middleware or route
    });
};

export default authMiddleware;