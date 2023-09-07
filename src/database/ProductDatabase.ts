import { BaseDatabase } from "./BaseDatabase";

export class ProductDatabase extends BaseDatabase {
    public static TABLE_PRODUCTS = "products"
    public static TABLE_PACKS = "packs"

    public getProducts = async () => {
        const res = await BaseDatabase.connection(ProductDatabase.TABLE_PRODUCTS)
        return res
    }

    public getProductsById = async (id: number) => {
        const [res] = await BaseDatabase.connection(ProductDatabase.TABLE_PRODUCTS).where({code: id})
        return res
    }

    public updateProductById = async (id: number, product: any): Promise<void> => {
        await BaseDatabase.connection(ProductDatabase.TABLE_PRODUCTS).where({code: id}).update(product)
    }

    public getPacks = async () => {
        const res = await BaseDatabase.connection(ProductDatabase.TABLE_PACKS)
            .innerJoin(ProductDatabase.TABLE_PRODUCTS, "packs.product_id", "=", "products.code")
        return res
    }
}