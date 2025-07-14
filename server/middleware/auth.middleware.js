import jwt from "jsonwebtoken";

export  const auth = async (req, res, next) => {
  try {
    // console.log("first")
    const token = req?.cookies?.accessToken || 
    req?.header?.authorization?.split(" ")[1];
    // console.log("token ", token);

    if (!token) {
      return res.status(404).json({
        message: "token not avaliable",
        error: true,
        success: false,
        body: {},
      });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

    if(!decode){
        return res.status(401).json({
            message: "token not correct",
            error: true,
            success: false,
            body: {},
          });
    }
    // console.log('decode ' ,decode)
    req.userId = decode.id
    // console.log(req.userId)
    next()

  } catch (error) {
    console.log(error, "auth middleware error");
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
      body: {},
    });
  }
};