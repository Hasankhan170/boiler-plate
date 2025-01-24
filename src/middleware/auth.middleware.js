import jwt from "jsonwebtoken";

const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  
  if (!token) return res.status(401).json({ message: "Access Denied" });
  console.log("Token received: ", token);


  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid Token" });
      console.log("Decoded Token: ", decoded);
      req.user = decoded; 
      next();
  });
  
  
};


export default authenticateUser;
