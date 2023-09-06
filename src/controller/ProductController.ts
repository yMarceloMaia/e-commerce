import { Request, Response } from "express";
import { ProductBusiness } from "../business/ProductBusiness";

export class ProductController {
    constructor(
        private productBusiness: ProductBusiness
    ) { }

    public getProducts = async (req: Request, res: Response) => {
        try {
            const response = await this.productBusiness.getProducts()
            res.status(200).send(response)
        } catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    }

    public updatePrice = async (req: Request, res: Response) => {
        try {
            console.log(req.file?.buffer.toString("utf-8"))
            res.status(200).send("aaa")
        } catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    }

}