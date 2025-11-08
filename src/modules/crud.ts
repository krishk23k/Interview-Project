import sequelize from "../config/db";
import { Request, Response } from "express";
import category from "../models/category";
import service from "../models/services";
import service_price from "../models/service_price";
export class crud {
  public createCategory = async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const data = {
        name: name,
      };

      const findCategory = await category.findOne({ where: { name: name } });
      if (findCategory) {
        return res.status(400).json({ message: "CATEGORY ALREADY EXISTS" });
      }
      const newCategory = await category.create(data);
      res.status(201).json({ message: "CATEGORY CREATED", data: newCategory });
    } catch (error) {
      res.status(500).json({ message: "INTERNAL SERVER ERROR", error });
    }
  };

  public get = async (req: Request, res: Response) => {
    try {
      const newCategory = await category.findAll();
      res.status(201).json({ data: newCategory });
    } catch (error) {
      res.status(500).json({ message: "INTERNAL SERVER ERROR", error });
    }
  };

  public update = async (req: Request, res: Response) => {
    try {
      const categoryId = req.params.categoryId;
      const { name } = req.body;

      const find = await category.findOne({ where: { name: name } });
      if (find) {
        return res
          .status(400)
          .json({ message: "CATEGORY NAME ALREADY EXISTS" });
      }
      const newCategory = await category.update(
        {
          name: name,
          updatedAt: new Date(),
        },
        {
          where: { id: categoryId },
        }
      );
      if (newCategory[0] == 1) {
        return res.status(201).json({ message: "CATEGORY UPDATED" });
      } else {
        return res.status(404).json({ message: "CATEGORY NOT FOUND" });
      }
    } catch (error) {
      res.status(500).json({ message: "INTERNAL SERVER ERROR", error });
    }
  };

  public delete = async (req: Request, res: Response) => {
    try {
      const categoryId = req.params.categoryId;
      const services = await service.count({
        where: { category_id: categoryId },
      });
      if (services > 0) {
        return res
          .status(400)
          .json({ message: "CANNOT DELETE CATEGORY WITH ASSOCIATED SERVICES" });
      }
      const deleted = await category.destroy({ where: { id: categoryId } });
      if (deleted) {
        return res.status(200).json({ message: "CATEGORY DELETED" });
      } else {
        return res.status(404).json({ message: "CATEGORY NOT FOUND" });
      }
    } catch (error) {
      res.status(500).json({ message: "INTERNAL SERVER ERROR", error });
    }
  };

  public addService = async (req: Request, res: Response) => {
    try {
      const categoryId = req.params.categoryId;
      const { service_name, type } = req.body;
      const categoryExists = await category.findByPk(categoryId);

      if (!categoryExists) {
        return res.status(404).json({ message: "CATEGORY NOT FOUND" });
      }

      const find = await service.findAll({
        where: {
          category_id: categoryId,
          service_name: service_name,
          type: type,
        },
      });

      if (find.length > 0) {
        return res.status(400).json({ message: "SERVICE ALREADY EXISTS" });
      }

      const newService = await service.create({
        category_id: categoryId,
        service_name,
        type,
      });
      res.status(201).json({ message: "SERVICE CREATED", data: newService });
    } catch (error) {
      res.status(500).json({ message: "INTERNAL SERVER ERROR", error });
    }
  };

  public getServices = async (req: Request, res: Response) => {
    try {
      const categoryId = req.params.categoryId;

      const find = await category.findByPk(categoryId);
      if (!find) {
        return res.status(404).json({ message: "CATEGORY NOT FOUND" });
      }
      const services = await service.findAll({
        where: { category_id: categoryId },
      });
      res.status(200).json({ data: services });
    } catch (error) {
      res.status(500).json({ message: "INTERNAL SERVER ERROR", error });
    }
  };

  public removeServices = async (req: Request, res: Response) => {
    try {
      const { categoryId, serviceId } = req.params;
      const deleted = await service.destroy({
        where: { id: serviceId, category_id: categoryId },
      });

      if (deleted) {
        await service_price.destroy({
          where: { service_id: serviceId },
        });
        return res.status(200).json({ message: "SERVICE DELETED" });
      }
    } catch (error) {
      res.status(500).json({ message: "INTERNAL SERVER ERROR", error });
    }
  };

  public updateService = async (req: Request, res: Response) => {
    try {
      const { categoryId, serviceId } = req.params;
      const { service_name, type, price_options } = req.body;

      const findService = await service.findOne({
        where: { id: serviceId, category_id: categoryId },
      });
      if (!findService) {
        return res.status(404).json({ message: "SERVICE NOT FOUND" });
      }
      await service.update(
        { service_name: service_name, type: type },
        {
          where: { id: serviceId, category_id: categoryId },
        }
      );

      const findPrices = await service_price.findAll({
        where: { service_id: serviceId },
      });
      if (findPrices.length > 0) {
        await service_price.destroy({
          where: { service_id: serviceId },
        });
      }

      for (const option of price_options) {
        await service_price.create({
          service_id: serviceId,
          duration: option.duration,
          price: option.price,
          type: option.type,
        });
      }
      return res.status(200).json({ message: "SERVICE UPDATED" });
    } catch (error) {
      return res.status(500).json({ message: "INTERNAL SERVER ERROR", error });
    }
  };
}
