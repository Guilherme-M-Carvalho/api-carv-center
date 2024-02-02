type CostProps = {
    id?: number;
    name: string;
    description?: string;
    amount: number;
    price: number;
    deleted?: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export class CreateCostDto {
    handleValidation({
        amount,
        name,
        price,
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
    }
}