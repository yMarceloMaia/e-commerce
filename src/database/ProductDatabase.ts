import { BaseDatabase } from "./BaseDatabase";

export class ProductDatabase extends BaseDatabase {
    public static TABLE_PRODUCTS = "products"

    public getProducts = async () => {
        const res = await BaseDatabase.connection(ProductDatabase.TABLE_PRODUCTS)
        return res
    }
}