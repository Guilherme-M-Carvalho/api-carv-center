export type CreateResaleProps = {
    products: ProductProps[]
}

export type ProductProps = {
    id: number;
    amount: number;
    priceResale: number
}

export class CreateResaleDto {
    handleValidation({ products }: CreateResaleProps){
        products.forEach(({ amount, id, priceResale }, index) => {
            if(!id){
                throw new Error(`{"field": "id", "message": "Produto inválido", "position": "${index}"}`);
            }
            if(!amount){
                throw new Error(`{"field": "amount", "message": "Quantidade inválida", "position": "${index}"}`);
            }
            if(!priceResale){
                throw new Error(`{"field": "priceResale", "message": "Preço inválido", "position": "${index}"}`);
            }
        })
    }
}