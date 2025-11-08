import { NextFunction, Request } from "express";
import { sign, verify } from "jsonwebtoken";

export class JwtHelper {
  public generateToken = async (payload: any) => {
    const token = await sign({ payload }, process.env.TOKEN as string, {
      expiresIn: "1d",
    });
    return token;
  };

  public verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const token = `${req.headers["authorization"]}`;
    if (!token) {
      return (res as any).status(401).json({ message: "UNAUTHORIZED ACCESS" });
    }

    const decoded = await verify(token, process.env.TOKEN as string);
    if (!decoded) {
      return (res as any).status(401).json({ message: "INVALID TOKEN" });
    }

    next();
  };
}
