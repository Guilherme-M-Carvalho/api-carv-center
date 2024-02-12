import prismaClient from "../../prisma";

export class FindServiceByDateService {
    async execute(date: string) {
        const daateSearch = new Date(date)
        const daateSearchEnd = new Date(date + " 20:59")

        try {
            const services = await prismaClient.serviceDetailCar.findMany({
                select: {
                    id: true,
                    deleted: true,
                    description: true,
                    parts: true,
                    costProduct: true,
                    price: true,
                },
                where: {
                    created_at: {
                        lte: daateSearchEnd,
                        gte: daateSearch,
                    }
                }
            })

            const resale = await prismaClient.costResale.findMany({
                select: {
                    id: true,
                    deleted: true,
                    costProduct: true,
                    price: true,
                },
                where: {
                    created_at: {
                        lte: daateSearchEnd,
                        gte: daateSearch,
                    }
                }
            })

            const totalService = services.reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue.price) + (currentValue.parts.reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue.price), 0), + currentValue.costProduct.reduce((acc, val) => acc + Number(val.priceResale), 0)), 0)
            const countService = services.reduce((acc, val) => acc + Number(val.costProduct.length),0) + services.length
            
            const totalResale = resale.reduce((acc,val) =>acc + val.costProduct.reduce((ac, value) => ac + Number(value.priceResale ),0), 0)
            const countResale = resale.reduce((acc, val) => acc + Number(val.costProduct.length),0)

            const totalServices = services.reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue.price),0)

            const data = {
                count: (countResale + countService),
                total: (totalResale + totalService),
                countResale: countResale + services.reduce((acc, val) => acc + Number(val.costProduct.length),0),
                countService: services.length,
                totalService: totalServices,
                totalResale: totalResale +  services.reduce((acc, val) => acc + Number(val.costProduct.reduce((ac,value) => ac + Number(value.priceResale),0)),0)
            }
            return data
        } catch (error) {
            throw new Error("Internal error");

        }
    }
}