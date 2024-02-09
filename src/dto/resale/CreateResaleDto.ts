export type CreateResaleProps = {
    products: ProductProps[]
}

export type ProductProps = {
    id: number;
    amount: number;
}

export class CreateResaleDto {
    handleValidation({ products }: CreateResaleProps){
        products.forEach(({ amount, id }, index) => {
            if(!id){
                throw new Error(`{"field": "id", "message": "Produto inválido", "position": "${index}"}`);
            }
            if(!amount){
                throw new Error(`{"field": "amount", "message": "Quantidade inválida", "position": "${index}"}`);
            }
        })
    }
}