type HandleValidationCreateServiceProps = {
    car: {
        plate: string;
        description: string;
    },
    serviceDetail:ServiceDetailProps[];
    id?:number;
}

type ServiceDetailProps = {
    price: number;
    description: string;
    id?: number;
    image: ImageProps[]
}

type ImageProps = {
    before: boolean;
    id?: number
}

export class UpdateServiceDto {
    handleValidation({id, car, serviceDetail}: HandleValidationCreateServiceProps) {
        if(!id){
            throw new Error('{"field": "id", "message": "Serviço não existe"}');
        }

        if(!car.description){
            throw new Error('{"field": "description", "message": "Descrição inválida"}');
        }
        if(car.plate.length !== 7){
            throw new Error('{"field": "plate", "message": "Placa inválida"}');
        }
        serviceDetail.forEach((el, i) => {
            if(!el.description){
                throw new Error(`{"field": "description", "message": "Descrição inválida", "position": "${i}"}`);
            }
            if(!el.price){
                throw new Error(`{"field": "price", "message": "Preço inválido", "position": "${i}"}`);
            }
        })
    }
}