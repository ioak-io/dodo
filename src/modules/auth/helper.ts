import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import jwt from "jsonwebtoken";
import { add, differenceInSeconds } from "date-fns";

import { apikeyCollection, apikeySchema } from "./model";
import { getCollection, getGlobalCollection } from "../../lib/dbutils";

const selfRealm = 100;
const appUrl = process.env.APP_URL || "http://localhost:3010";

export const validate = async (token: string) => {
  const model = getGlobalCollection(apikeyCollection, apikeySchema);
  const out = await model.findOne({ token });
  return !!out;
};
