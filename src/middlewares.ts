import fs from "fs";
import jwt from "jsonwebtoken";
import { validate } from "./modules/auth/helper";

export const authorize = async (req: any, res: any, next: any) => {
  const authString = req.headers["authorization"] || "";
  const authParts = authString.split(" ");
  const token = authParts[0];
  if (!token || token === "") {
    return res.sendStatus(401);
  }
  const out = await validate(token);
  if (!out) {
    return res.sendStatus(401);
  }
  next();
};
