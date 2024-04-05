type CostProps = {
    id: number;
    amount: number;
    price: number;
    priceResale: number;
    changeAllProducts: boolean
}

export class CreateProductDto {
    handleValidation({
        amount,
        id,
        price,
        priceResale
    }: CostProps){
        if (!id) {
            throw new Error('{"field": "id", "message": "Custo inválido!"}');
        }
        if (!amount) {
            throw new Error('{"field": "amount", "message": "Quantidade inválida!"}');
        }
        if (!price) {
            throw new Error('{"field": "price", "message": "Preço inválido!"}');
        }
        if (!priceResale) {
            throw new Error('{"field": "priceResale", "message": "Preço de revenda inválido!"}');
        }
    }
}