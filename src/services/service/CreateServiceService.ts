import prismaClient from "../../prisma";
import { CreateCarService } from "../car/CreateCarService";

export interface ServiceProps {
    car: Car
    serviceDetail: ServiceDetail[]
    price: string
    id?: number
}

export interface Car {
    id?: number
    description: string
    plate: string
}

export interface ServiceDetail {
    id?: number
    price: string
    description: string
    image: Image[]
}

export interface Image {
    id?: number
    name: string
    service_detail_id: number
}

export class CreateServiceService {
    async execute({
        car,
        price,
    }: ServiceProps) {
        const { plate } = car
        let existCar = await prismaClient.car.findFirst({
            where: {
                plate: plate
            },
            select: {
                id: true,
                description: true,
                plate: true,
            }
        })

        if (!existCar) {
            existCar = await new CreateCarService().execute(car)
        }

        try {
            const service = await prismaClient.serviceCar.create({
                data: {
                    price: price,
                    car_id: existCar.id
                },
                select: {
                    price: true,
                    car: true
                }
            })
            return service

        } catch (err){
            console.log({
                err
            });
            
        }

    }
}