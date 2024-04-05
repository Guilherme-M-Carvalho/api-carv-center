export type UpdateResaleProps = {
    id: number;
    products: ProductProps[]
}

export type ProductProps = {
    id: number;
    amount: number;
    priceResale: number;
    amountSave: number
}

export class UpdateResaleDto {
    handleValidation({ products, id }: UpdateResaleProps){
        if(!id){
            throw new Error(`{"field": "id", "message": "Venda inválida"}`);
        }
        products.forEach(({ amount, id, priceResale }, index) => {
            if(!id){
                throw new Error(`{"field": "id", "message": "Produto inválido", "position": "${index}"}`);
            }
            if(!amount && amount != 0){
                throw new Error(`{"field": "amount", "message": "Quantidade inválida", "position": "${index}"}`);
            }
            if(!priceResale){
                throw new Error(`{"field": "priceResale", "message": "Preço inválido", "position": "${index}"}`);
            }
        })
    }
}