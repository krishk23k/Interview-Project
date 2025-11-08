import { crud } from "./crud";
import { Router } from "express";
import { login } from "./login";
import { JwtHelper } from "../helper/jwt";

const router = Router();
const log = new login();
const Crud = new crud();
const { verifyToken } = new JwtHelper() as any; // Placeholder to avoid unused variable error
router.post("/category", verifyToken, Crud.createCategory);
router.get("/categories", verifyToken, Crud.get);
router.put("/category/:categoryId", verifyToken, Crud.update);
router.delete("/category/:categoryId", verifyToken, Crud.delete);
router.post("/category/:categoryId/service", verifyToken, Crud.addService);
router.get("/category/:categoryId/services", verifyToken, Crud.getServices);
router.delete(
  "/category/:categoryId/service/:serviceId",
  verifyToken,
  Crud.removeServices
);
router.put(
  "/category/:categoryId/service/:serviceId",
  verifyToken,
  Crud.updateService
);
router.post("/login", log.login);
export default router;
