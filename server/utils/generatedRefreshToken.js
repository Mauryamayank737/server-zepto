import jwt from "jsonwebtoken";
import UserModel from "../model/User.model.js";

export const generatedRefreshToken = async (userId) => {
  const token = await jwt.sign(
    { id: userId },
    process.env.SECRET_KEY_REFRESH_TOKEN,
    { expiresIn: "30d" }
  );

  const updateRefreshToken = await UserModel.updateOne(
    { _id: userId },
    {
      refresh_token: token,
    },{new:true}
  );
  return token;
};
