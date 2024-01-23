import prismaClient from "../../prisma";

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
}

export interface ServiceDetail {
    id?: number
    price: number
    description: string;
    deleted?: boolean;
    image?: Image[]
}

export interface Image {
    id?: number
    name: string
    service_detail_id?: number
    car_id?: number
    before?: boolean;
    deleted?: boolean;
}

export class UpdateServiceService {
    async execute({
        car,
        serviceDetail,
        files,
        id
    }: ServiceProps) {

        const { plate } = car

        const existService = await prismaClient.serviceCar.findFirst({
            where: {
                id: id
            }
        })

        if(!existService){
            throw new Error('{"message": "Serviço não existe!"}');
            
        }

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
                    },
                    where: {
                        deleted: false
                    }
                }
            }
        })

        const priceTotal = serviceDetail.reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue.price), 0);

        let indexFile = 0

        const serviceDetailCreate = []
        const serviceDetailUpdate = []

        serviceDetail?.forEach(({ description, image, price, id, deleted }, index) => {
            if (!id) {
                serviceDetailCreate.push({
                    description: description,
                    image: {
                        create: image.map(({ name, before }, index) => {
                            const fileName = files.service[indexFile]?.filename
                            indexFile++

                            return {
                                name: fileName,
                                before: before
                            }
                        })
                    },
                    price: price
                })
            } else {
                const imageCreate = []
                const imageUpdate = []

                image.forEach(({ name, before, id, deleted }, index) => {
                    const fileName = files.service[indexFile]?.filename
                    if (!id) {
                        indexFile++
                        imageCreate.push({
                            name: fileName,
                            before: before,
                            id
                        })
                    } else {

                        imageUpdate.push({
                            data: {
                                name: name,
                                before: before,
                                deleted,
                                id
                            },
                            where: {
                                id: id
                            }
                        })

                    }
                })

                serviceDetailUpdate.push({
                    data: {
                        description: description,
                        image: {
                            create: imageCreate,
                            update: imageUpdate
                        },
                        price: price,
                        deleted: !!deleted,
                        id
                    },
                    where: {
                        id: id
                    }
                })
            }
        })

        const data: any = {
            price: Number(priceTotal),
            serviceDetail: {
                create: serviceDetailCreate,
                update: serviceDetailUpdate
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
                    }
                }
            }
        }

        if (existCar) {
            data.car_id = existCar.id

            const deleteImage: number[] = []
            existCar.image?.forEach(({ id }) => {
                if (!car.image?.find(img => img.id == id) || car.image?.find(img => img.id == id).deleted) {
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
                    updateMany: {
                        data: {
                            deleted: true,
                        },
                        where: {
                            id: {
                                in: deleteImage
                            }
                        }
                    }
                    // deleteMany: {
                    //     id: {
                    //         in: deleteImage
                    //     }
                    // }
                }
            }

            if (!createImage.length) {
                delete dataCar.image.createMany
            }
            if (!deleteImage.length) {
                delete dataCar.image.updateMany
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
            delete data.car

        }

        try {
            const service = await prismaClient.serviceCar.update({
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
                },
                where: {
                    id: id
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