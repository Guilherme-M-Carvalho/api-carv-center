import prismaClient from "../../prisma";
import { CreateCarService } from "../car/CreateCarService";

export interface ServiceProps {
    car?: Car
    car_id?: number
    serviceDetail: ServiceDetail[]
    id?: number
    files: any
}

export interface Car {
    id?: number
    description: string
    plate: string
    image: Image[]
    client: {
        id?: number;
        name: string;
        phone: number
    }
}

export interface ServiceDetail {
    id?: number
    price: number
    obs?: string
    description?: string
    image?: Image[]
    customerParts: boolean
    typeService: number
    parts: PartsProps[];
    deleted?: boolean;
    costProduct: ProductsProps[]

}

export interface Image {
    id?: number
    name: string
    service_detail_id?: number
    car_id?: number
    before?: boolean
}

type PartsProps = {
    id?: number
    name: string;
    price: number;
    priceResale: number;
    deleted?: boolean;
}

type ProductsProps = {
    id?: number
    amount: string;
    priceResale?: number
}

export class CreateServiceService {
    async execute({
        car,
        serviceDetail,
        files
    }: ServiceProps) {

        const { plate } = car

        const existClient = await prismaClient.client.findFirst({
            where: {
                phone: car.client.phone,
                deleted: false
            }
        })

        const existCar = await prismaClient.car.findFirst({
            where: {
                plate: plate,
                deleted: false
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

        let partPrice = 0
        const serviceDetailFilter = serviceDetail.filter(el => el?.parts?.length && !el.customerParts && !el.deleted)
        serviceDetailFilter.forEach(el => {
            if (el.parts) {
                const parts = el.parts.filter(el => !el.deleted)
                partPrice += parts?.reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue.priceResale), 0);
            }
        })
        const priceTotal = serviceDetail.reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue.price), 0) + partPrice;

        let indexFile = 0

        const data: any = {
            price: Number(priceTotal),
            serviceDetail: {
                create: await Promise.all(serviceDetail?.map(async ({ costProduct, description, image, price, customerParts, typeService, obs, parts }, index) => {
                    const products =  await Promise.all(costProduct.map(async (el, indexProduct) => {
                        const count = await prismaClient.costProduct.findMany({
                            select: {
                                id: true,
                                priceResale: true
                            },
                            where: {
                                cost_resale_id: null,
                                service_detail_id: null,
                                // cost_id: el.id,
                                deleted: false,
                                // cost: {
                                //     deleted: false
                                // }
                            },
                            take: Number(el.amount)
                        })
                        costProduct[indexProduct].priceResale = count.reduce((acc, val) => acc + Number(val.priceResale),0)
                        if (Number(el.amount) > count.length) {
                            throw new Error(`{"field": "amount", "message": "Quantidade selecionada maior que em estoque", "position": "${index}"}`);
                        }
                        return count.map(item => {
                            return {
                                id: item.id
                            }
                        })
                    }))
                    return {
                        description: description,
                        image: {
                            create: image.map(({ name, before }, index) => {
                                const fileName = files.service[indexFile]?.filename
                                indexFile++

                                return {
                                    name: fileName ? fileName : "",
                                    before: before
                                }
                            })
                        },
                        price: price,
                        customerParts: customerParts,
                        type_service_id: !!typeService ? typeService : undefined,
                        obs: obs,
                        parts: {
                            create: parts ? parts?.map(({ name, price, priceResale }) => {
                                return {
                                    description: name,
                                    price: price,
                                    priceResale: priceResale

                                }
                            }) : []
                        },
                        costProduct: {
                            connect:products.flat()
                        },
                    }
                }))
            },
            car: {
                create: {
                    description: car.description,
                    plate: car.plate.toUpperCase(),
                    image: {
                        create: Array.from(files?.vehicle)?.map((vehicle: any) => {
                            return {
                                name: vehicle?.filename
                            }
                        })
                    },
                    client: {
                        create: {
                            name: car.client.name,
                            phone: car.client.phone
                        }
                    }
                },
            },

        }

        const priceProducts = serviceDetail.reduce((acc, val) => acc + val.costProduct.reduce((acc2, val2) => acc2+ Number(val2.priceResale),0) , 0)
        data.price = data.price + priceProducts
        
        if (existClient) {
            delete data.car.create.client
            data.car.create.client_id = existClient.id
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
            Array.from(files?.vehicle)?.forEach((vehicle: any) => {
                // if (!existCar.image?.find(img => img.id == id)) {
                createImage.push({ name: vehicle?.filename })
                // }
            })

            const dataCar = {
                description: car.description,
                image: {
                    createMany: {
                        data: createImage
                    },
                }
            }

            if (!createImage.length) {
                delete dataCar.image.createMany
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
            console.log({
                err
            });

            throw new Error("Internal error");
        }

    }
}