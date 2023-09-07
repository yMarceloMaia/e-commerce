import { Request, Response } from "express";
import { ProductBusiness } from "../business/ProductBusiness";
import { Readable } from "stream"
import readline from "readline"
import { BaseError } from "../errors/BaseError";
import { ProductDTO } from "../models/Product";
import { BadRequestError } from "../errors/BadRequestError";

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

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public getPackById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            const response = await this.productBusiness.getPackById(id)
            res.status(200).send(response)
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public getPacks = async (req: Request, res: Response) => {
        try {
            const response = await this.productBusiness.getPacks()
            res.status(200).send(response)
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public updatePrice = async (req: Request, res: Response) => {
        try {
            const buffer = req.file?.buffer

            const output = await this.productBusiness.updatePriceProduct(buffer)

            res.status(200).send(output)
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }


    // public getProducts = async (req: Request, res: Response) => {
    //     try {
    //         const response = await this.productBusiness.getProducts()
    //         res.status(200).send(response)
    //     } catch (error) {
    //         console.log(error)
    //         res.status(400).send(error)
    //     }
    // }

    // public updatePrice = async (req: Request, res: Response) => {
    //     try {
    //         const buffer = req.file?.buffer
    //         const readableFile = new Readable()
    //         readableFile.push(buffer)
    //         readableFile.push(null)

    //         const productsLine = readline.createInterface({ input: readableFile })
          
    //         const products = []
    //         for await (let line of productsLine){
    //             const productLineSplit = line.split(",")
    //             products.push(productLineSplit)
    //         } 

    //         if(products[0][0].includes("product_code")){
    //             const output = await this.productBusiness.updatePriceProduct(products)
    //             res.status(200).send(output)
    //         }else if(products[0][0].includes("pack_code")){
    //             const output = await this.productBusiness.updatePricePack(products)
    //             res.status(200).send(output)
    //         }else{
    //             throw new BadRequestError("É preciso passar valores correspondentes ao product_code ou pack_code")
    //         }

    //     } catch (error) {
    //         console.log(error)

    //         if (error instanceof BaseError) {
    //             res.status(error.statusCode).send(error.message)
    //         } else {
    //             res.status(500).send("Erro inesperado")
    //         }
    //     }
    // }
}