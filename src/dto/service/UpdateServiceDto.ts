type HandleValidationCreateServiceProps = {
    car: {
        plate: string;
        description: string;
        client: {
            id?: number;
            name: string;
            phone: number
        }
    },
    serviceDetail: ServiceDetailProps[];
    id?: number;
}

type ServiceDetailProps = {
    price: number;
    description: string;
    id?: number;
    image: ImageProps[];
    parts: PartsProps[];
    customerParts: boolean
    typeService: number
}

type PartsProps = {
    id?: number
    name: string;
    price: number
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
        if (!car.client.name) {
            throw new Error('{"field": "name", "message": "Nome do cliente inválido"}');
        }
        if (String(car.client.phone).length < 10) {
            throw new Error('{"field": "phone", "message": "Telefone do cliente inválido"}');
        }
        if (!car.description) {
            throw new Error('{"field": "description", "message": "Descrição inválida"}');
        }
        if (car.plate.length !== 7) {
            throw new Error('{"field": "plate", "message": "Placa inválida"}');
        }
        serviceDetail.forEach((el, i) => {
            if (!el.description && !el.typeService) {
                throw new Error(`{"field": "description", "message": "Descrição inválida", "position": "${i}"}`);
            }
            if (!el.price) {
                throw new Error(`{"field": "price", "message": "Preço inválido", "position": "${i}"}`);
            }
            console.log({
                el
            });
            
            if(el?.parts){
                el?.parts?.forEach(({ name, price }, index) => {
                    if (!name && !el.customerParts) {
                        throw new Error(`{"field": "part", "message": "Nome da peça inválida", "position": "${i}", "child": "${index}"}`);
                    }
                    if (!price && !el.customerParts) {
                        throw new Error(`{"field": "price", "message": "Preço da peça inválida", "position": "${i}", "child": "${index}"}`);
                    }
                })
            }

        })
    }
}