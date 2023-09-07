import { ProductDatabase } from "../database/ProductDatabase"
import { Product, ProductDTO } from "../models/Product"
import { Readable } from "stream"
import readline from "readline"
import { BadRequestError } from "../errors/BadRequestError"

interface ProductPack {
    productId: number,
    quantity: number,
    productCostPrice: number,
    productSalesPrice: number
}

interface Pack {
    id: number,
    packId: number,
    products: ProductPack[]
}

export class ProductBusiness {
    constructor(
        private productDatabase: ProductDatabase
    ) { }

    public getProducts = async () => {
        const res = await this.productDatabase.getProducts()
        return res
    }

    public getPacks = async () => {
        const packs = await this.productDatabase.getPacks()
        
        const infoPacks: any[] = []
        for (let pack of packs) {
            const packExist = infoPacks.find(p => p.packId === pack.pack_id)
            if (packExist) {
                packExist.products.push({
                    code: pack.code,
                    name: pack.name,
                    costPrice: +pack.cost_price,
                    salesPrice: +pack.sales_price,
                    quantity: pack.qty
                })
            } else {
                infoPacks.push({
                    id: pack.id,
                    packId: pack.pack_id,
                    pricePack: 0,
                    products: [
                        {
                            code: pack.code,
                            name: pack.name,
                            costPrice: +pack.cost_price,
                            salesPrice: +pack.sales_price,
                            quantity: pack.qty
                        }
                    ]
                })
            }
        }

        const infoPacksWitchPrices = infoPacks.map((pack) => {
            let pricePack = 0
            for(let product of pack.products){
                pricePack += product.salesPrice * product.quantity
            }
            return {...pack, pricePack: +pricePack.toFixed(2)}
        })
        

        return infoPacksWitchPrices
    }

    public updatePriceProduct = async (buffer: any) => {

        // Verificar se o arquivo recebido possui os campos necessários
        const readableFile = new Readable()
        readableFile.push(buffer)
        readableFile.push(null)

        const productsLine = readline.createInterface({ input: readableFile })

        const products: ProductDTO[] = []
        for await (let line of productsLine) {
            const productLineSplit = line.split(",")
            if (Number(productLineSplit[0])) {
                products.push({
                    productCode: productLineSplit[0],
                    newPrice: productLineSplit[1]
                })
            }
        }

        for (let product of products) {
            const productDb = await this.productDatabase.getProductsById(Number(product.productCode))

            const productModel = new Product(
                productDb.code,
                productDb.name,
                productDb.cost_price,
                productDb.sales_price
            )
            const productNewPrice = Number(product.newPrice)

            productModel.costPrice < productNewPrice && (productModel.salesPrice = productNewPrice)

            console.log(productModel)
            await this.productDatabase.updateProductById(Number(product.productCode), productModel.getProductDb())
        }


        return { message: "Preços atualizados com sucesso" }

    }

    // public updatePriceProduct = async (products: any) => {
    //     const objProducts = []
    //     for (let product of products) {
    //         if (Number(product[0])) {
    //             objProducts.push({
    //                 productCode: product[0],
    //                 newPrice: product[1]
    //             })
    //         }
    //     }

    //     for (let product of objProducts) {
    //         const productDb = await this.productDatabase.getProductsById(Number(product.productCode))

    //         const productModel = new Product(
    //             productDb.code,
    //             productDb.name,
    //             productDb.cost_price,
    //             productDb.sales_price
    //         )
    //         const productNewPrice = Number(product.newPrice)

    //         productModel.costPrice <  productNewPrice && (productModel.salesPrice = productNewPrice)

    //         await this.productDatabase.updateProductById(product.productCode, productModel.getProductDb())
    //     }


    //     return {message: "Preços atualizados com sucesso"}
    // }

    public updatePricePack = async (products: any) => {

    }
}
