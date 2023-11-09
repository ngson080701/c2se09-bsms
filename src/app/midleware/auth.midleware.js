import jwt from "jsonwebtoken";


export default async function checkAuth(req, res, next) {
    const token = req.headers?.authorization?.split(" ")[1];
    try {
        const jwtObject = jwt.verify(token, process.env.JWTPrivateKey);
        const isExpired = Date.now() >= jwtObject.exp * 1000;
        if (isExpired) {
          res.results(HttpStatusCode.BAD_REQUEST).json({
            message: "Token is expired",
          });
          res.end();
        } else {
          req.user = jwtObject;
          await isAuthenticated(req, res, next);

          next;
        }
    
      } catch (exception) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          message: "Bạn chưa login",
        });
      }
}
async function isAuthenticated(req, res, next){
    const role = req.user.data?.isAdmin
    const manage = req.user.data?.storeManager
    if(role === true ||  manage ==="manager"  ) {
        next
    }else{
        return res.status(400).json("bạn không được phép")
    }
}


