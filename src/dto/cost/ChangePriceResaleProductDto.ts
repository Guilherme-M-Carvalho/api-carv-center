type CostProps = {
    cost_history_id: number;
    id: number;
    priceResale: number;
    changeAllProducts: boolean
}
export class ChangePriceResaleProductDto {
    handleValidation({
        cost_history_id,
        id,
        priceResale
    }: CostProps){
        if (!id) {
            throw new Error('{"field": "id", "message": "Custo inválido!"}');
        }
        if (!cost_history_id) {
            throw new Error('{"field": "amount", "message": "Hitorico inválido!"}');
        }
        if (!priceResale) {
            throw new Error('{"field": "priceResale", "message": "Preço de revenda inválido!"}');
        }
    }
}