type CostProps = {
    id?: number;
    name: string;
    description?: string;

}

export class UpdateCostDto {
    handleValidation({
        name,
        id
    }: CostProps){
        if (!id) {
            throw new Error('{"field": "id", "message": "Custo inválido!"}');
        }
        if (!name) {
            throw new Error('{"field": "name", "message": "Nome inválido!"}');
        }
    }
}