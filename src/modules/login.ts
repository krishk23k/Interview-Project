import { JwtHelper } from "../helper/jwt";
import { Request, Response } from "express";
export class login {
  public login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const userEmail = process.env.EMAIL as string;
      const userPassword = process.env.PASSWORD as string;
      if (userEmail === email && userPassword === password) {
        const jwtHelper = new JwtHelper();
        const token = await jwtHelper.generateToken(email);
        res.setHeader("Authorization", token);
        return res.status(200).json({ message: "LOGIN SUCCESSFUL" });
      } else {
        return res.status(401).json({ message: "INVALID CREDENTIALS" });
      }
    } catch (error) {
      res.status(500).json({ message: "INTERNAL SERVER ERROR", error });
    }
  };
}
