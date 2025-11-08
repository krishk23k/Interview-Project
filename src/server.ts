import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import Router from "./modules/route";
import dotenv from "dotenv";
dotenv.config();

export class server {
  constructor() {
    let app = express();
    const port = process.env.PORT || 3000;
    app.use(cors());
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(Router);
    app.listen(port || 3000, () => {
      console.log(`Server is running http://localhost:${port}`);
    });
  }
}
