import express from "express"
import { ProductController } from "../controller/ProductController"
import { ProductBusiness } from "../business/ProductBusiness"
import { ProductDatabase } from "../database/ProductDatabase"
import multer from "multer"

const multerConfig = multer()

export const productRouter = express.Router()

const productController = new ProductController(
    new ProductBusiness(
        new ProductDatabase()
    )
)

productRouter.get("/", productController.getProducts)
productRouter.post("/", multerConfig.single("file"), productController.updatePrice)

