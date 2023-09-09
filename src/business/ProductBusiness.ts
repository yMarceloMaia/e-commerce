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
interface ProductPackWithCode {
    identifyCode?: string,
    productCode?: number,
    newPrice?: number
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
                    costPricePack: 0,
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
            let priceCostPack = 0
            for (let product of pack.products) {
                pricePack += product.salesPrice * product.quantity
                priceCostPack += product.costPrice * product.quantity
            }
            return { ...pack, pricePack: +pricePack.toFixed(2), costPricePack: +priceCostPack.toFixed(2) }
        })


        return infoPacksWitchPrices
    }

    // public updatePriceProduct = async (buffer: any) => {
    //     const readableFile = new Readable()
    //     readableFile.push(buffer)
    //     readableFile.push(null)

    //     const productsLine = readline.createInterface({ input: readableFile })
    //     const productsLines = []
    //     for await (let line of productsLine) {
    //         productsLines.push(line)
    //     }

    //     if (productsLines[0].includes("product_code")) {

    //         const products: ProductDTO[] = []
    //         for await (let line of productsLines) {
    //             const productLineSplit = line.split(",")
    //             if (Number(productLineSplit[0])) {
    //                 products.push({
    //                     productCode: productLineSplit[0],
    //                     newPrice: productLineSplit[1]
    //                 })
    //             }
    //         }

    //         for (let product of products) {
    //             const productDb = await this.productDatabase.getProductsById(Number(product.productCode))

    //             if (!productDb) throw new BadRequestError(`Produto com código "${product.productCode}" não encontrado`)

    //             const productModel = new Product(
    //                 productDb.code,
    //                 productDb.name,
    //                 productDb.cost_price,
    //                 productDb.sales_price
    //             )
    //             const productNewPrice = Number(product.newPrice)

    //             productModel.costPrice < productNewPrice && (productModel.salesPrice = productNewPrice)

    //             await this.productDatabase.updateProductById(Number(product.productCode), productModel.getProductDb())


    //         }

    //         return { message: "Preços dos produtos atualizados com sucesso" }

    //     } else {
    //         const packs = []
    //         for await (let line of productsLines) {
    //             const productLineSplit = line.split(",")
    //             if (Number(productLineSplit[0])) {
    //                 packs.push({
    //                     packCode: productLineSplit[0],
    //                     newPricePack: productLineSplit[1]
    //                 })
    //             }
    //         }

    //         const packDb = await this.getPacks()

    //         let updatedPacks = []
    //         for (let pack of packs) {
    //             if (!packDb) throw new BadRequestError(`Produto com código "${pack.packCode}" não encontrado`)

    //             updatedPacks = await this.updatePriceProductByPricePack(pack)
    //         }

    //         for (let updatePack of updatedPacks) {
    //             const pack = await this.productDatabase.getProductsById(updatePack.packId)

    //             const packDB = {
    //                 code: pack.code,
    //                 name: pack.name,
    //                 cost_price: updatePack.costPricePack,
    //                 sales_price: updatePack.pricePack
    //             }
    //             await this.productDatabase.updateProductById(updatePack.packId, packDB)
    //         }

    //         return { message: "Preços dos packs/produtos atualizados com sucesso", updatedPacks }
    //     }
    // }

    public updatePriceProduct = async (buffer: any) => {
        const readableFile = new Readable()
        readableFile.push(buffer)
        readableFile.push(null)

        const productsLine = readline.createInterface({ input: readableFile })
        const productsLines = []
        for await (let line of productsLine) {
            productsLines.push(line)
        }

        // if (productsLines[0].includes("product_code")) {

        const products: ProductDTO[] = []
        for await (let line of productsLines) {
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

            if (!productDb) throw new BadRequestError(`Produto com código "${product.productCode}" não encontrado`)

            const productModel = new Product(
                productDb.code,
                productDb.name,
                productDb.cost_price,
                productDb.sales_price
            )
            const productNewPrice = Number(product.newPrice)

            productModel.costPrice < productNewPrice && (productModel.salesPrice = productNewPrice)
            if (product.productCode.length == 2) {
                await this.productDatabase.updateProductById(Number(product.productCode), productModel.getProductDb())
            } else {
                const packDb = await this.getPacks()

                let updatedPacks = []
                for (let pack of products) {
                    if (!packDb) throw new BadRequestError(`Produto com código "${pack.productCode}" não encontrado`)
                    // console.log("AAAAAAAAAAA")
                    updatedPacks = await this.updatePriceProductByPricePack(pack)
                }

                for (let updatePack of updatedPacks) {
                    const pack = await this.productDatabase.getProductsById(updatePack.packId)

                    const packDB = {
                        code: pack.code,
                        name: pack.name,
                        cost_price: updatePack.costPricePack,
                        sales_price: updatePack.pricePack
                    }
                    
                    await this.productDatabase.updateProductById(updatePack.packId, packDB)
                }
                
            }
            // if(product.productCode)
        }

        return { message: "Preços dos produtos atualizados com sucesso" }

        // } else {
        //     const packs = []
        //     for await (let line of productsLines) {
        //         const productLineSplit = line.split(",")
        //         if (Number(productLineSplit[0])) {
        //             packs.push({
        //                 packCode: productLineSplit[0],
        //                 newPricePack: productLineSplit[1]
        //             })
        //         }
        //     }

        //     const packDb = await this.getPacks()

        //     let updatedPacks = []
        //     for (let pack of packs) {
        //         if (!packDb) throw new BadRequestError(`Produto com código "${pack.packCode}" não encontrado`)

        //         updatedPacks = await this.updatePriceProductByPricePack(pack)
        //     }

        //     for (let updatePack of updatedPacks) {
        //         const pack = await this.productDatabase.getProductsById(updatePack.packId)

        //         const packDB = {
        //             code: pack.code,
        //             name: pack.name,
        //             cost_price: updatePack.costPricePack,
        //             sales_price: updatePack.pricePack
        //         }
        //         await this.productDatabase.updateProductById(updatePack.packId, packDB)
        //     }

        //     return { message: "Preços dos packs/produtos atualizados com sucesso", updatedPacks }
        // }
    }

    public updatePriceProductByPricePack = async (pack: any) => {
        const packsDb = await this.getPacks()
        for (let packDb of packsDb) {
            if (packDb.packId === +pack.productCode) {
                for (let prod of packDb.products) {
                    const product = new Product(
                        prod.code,
                        prod.name,
                        prod.costPrice,
                        prod.salesPrice
                    )
                    const productRatio = (product.salesPrice * prod.quantity) / packDb.pricePack
                    const productIncrease = (productRatio * (pack.newPrice - packDb.pricePack)) / prod.quantity
                    const newPriceProduct = product.salesPrice + productIncrease
                    product.salesPrice = +newPriceProduct.toFixed(2)

                    await this.productDatabase.updateProductById(product.id, product.getProductDb())
                }
                packDb.pricePack = +pack.newPrice
            }
        }

        return packsDb
    }
}
