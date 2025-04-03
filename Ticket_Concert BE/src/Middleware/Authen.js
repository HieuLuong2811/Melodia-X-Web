import jwt from 'jsonwebtoken';
export const authenticate = (req, res, next) => {
    const token  = req.headers.authorization?.split(" ")[1];
    if(!token) {
        return res.status(401).json({message : "Không tồn tại Token"})
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    }catch (err){
        return res.status(403).json({message : "Token không hợp lệ"})
    }
}

export const authorize = (QuyenHan) => {
    return(req, res, next) => {
        if(!QuyenHan.includes(req.user.QuyenHan)){
            return res.status(403).json({message : "Truy cập bị từ chối"});
        }
        next();
    }
}