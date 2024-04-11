import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

export default {
  mongoURL: process.env.MONGOURL,
  adminName: process.env.ADMINNAME,
  adminPassword: process.env.ADMINPASSWORD,
  privateKey: process.env.PRIVATEKEY,
  tokenCookieName: process.env.TOKENCOOKIENAME,
};
