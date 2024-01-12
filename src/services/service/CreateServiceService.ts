import prismaClient from "../../prisma";
import { CreateCarService } from "../car/CreateCarService";

export interface ServiceProps {
    car?: Car
    car_id?: number
    serviceDetail: ServiceDetail[]
    price?: number
    id?: number
}

export interface Car {
    id?: number
    description: string
    plate: string
    image: Image[]
}

export interface ServiceDetail {
    id?: number
    price: number
    description: string
    image?: Image[]
}

export interface Image {
    id?: number
    name: string
    service_detail_id?: number
    car_id?: number
    before?: boolean
}

export class CreateServiceService {
    async execute({
        car,
        serviceDetail
    }: ServiceProps) {
        const { plate } = car
        const existCar = await prismaClient.car.findFirst({
            where: {
                plate: plate
            },
            select: {
                id: true,
                description: true,
                plate: true,
                image: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        })

        const priceTotal = serviceDetail.reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue.price), 0);

        const data: any = {
            price: Number(priceTotal),
            serviceDetail: {
                create: serviceDetail?.map(({ description, image, price }) => {
                    return {
                        description: description,
                        image: {
                            create: image.map(({ name, before }) => {
                                return {
                                    name: name,
                                    before: before
                                }
                            })
                        },
                        price: price
                    }
                })
            },
            car: {
                create: {
                    description: car.description,
                    plate: car.plate.toUpperCase(),
                    image: {
                        create: car?.image?.map(({ name }) => {
                            return {
                                name: name
                            }
                        })
                    }
                }
            }
        }

        if (existCar) {
            delete data.car
            data.car_id = existCar.id

            const deleteImage: number[] = []
            existCar.image?.forEach(({ id }) => {
                if (!car.image?.find(img => img.id == id)) {
                    deleteImage.push(Number(id))
                }
            })
            const createImage: { name: string }[] = []
            car.image?.forEach(({ name, id }) => {
                if (!existCar.image?.find(img => img.id == id)) {
                    createImage.push({ name })
                }
            })

            const dataCar = {
                description: car.description,
                image: {
                    createMany: {
                        data: createImage
                    },
                    deleteMany: {
                        id: {
                            in: deleteImage
                        }
                    }
                }
            }

            if (!createImage.length) {
                delete dataCar.image.createMany
            }
            if (!deleteImage.length) {
                delete dataCar.image.deleteMany
            }
            if (!deleteImage.length && !createImage.length) {
                delete dataCar.image
            }

            try {
                await prismaClient.car.update({
                    where: {
                        id: existCar.id
                    },
                    data: dataCar
                })
            } catch (error) {
                throw new Error("Internal error");
            }
        }

        try {
            const service = await prismaClient.serviceCar.create({
                data: data,
                select: {
                    car: {
                        select: {
                            plate: true,
                            description: true,
                            id: true,
                            image: {
                                select: {
                                    name: true,
                                    id: true
                                }
                            }
                        }
                    },
                    price: true,
                    serviceDetail: {
                        select: {
                            id: true,
                            description: true,
                            price: true,
                            image: {
                                select: {
                                    name: true,
                                    id: true,
                                    before: true
                                }
                            }
                        }
                    },
                    id: true
                }
            })
            return service

        } catch (err) {
            throw new Error("Internal error");
        }

    }
}