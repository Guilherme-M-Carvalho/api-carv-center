type CostProps = {
    id?: number;
    name: string;
    description?: string;
    amount: number;
    price: number;
    priceResale: number;
    deleted?: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export class CreateCostDto {
    handleValidation({
        amount,
        name,
        price,
        priceResale
    }: CostProps){
        if (!name) {
            throw new Error('{"field": "name", "message": "Nome inválido!"}');
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