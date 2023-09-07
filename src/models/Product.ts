
export interface ProductDTO {
    productCode: string,
    newPrice: string
}

export class Product {
    constructor(
        private _id: number,
        private _name: string,
        private _costPrice: number,
        private _salesPrice: number
    ) { }
    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
    public get costPrice(): number {
        return this._costPrice;
    }
    public set costPrice(value: number) {
        this._costPrice = value;
    }
    public get salesPrice(): number {
        return this._salesPrice;
    }
    public set salesPrice(value: number) {
        this._salesPrice = value;
    }

    public getProductDb(){
        return {
            code: this._id,
            name: this._name,
            cost_price: this._costPrice,
            sales_price: this._salesPrice
        }
    }
}