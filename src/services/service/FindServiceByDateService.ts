import prismaClient from "../../prisma";

export class FindServiceByDateService {
    async execute(date: string){
        const daateSearch= new Date(date)
        const daateSearchEnd= new Date(date+" 20:59")
        
        try {
            const services = await prismaClient.serviceCar.findMany({
                where: {
                    created_at: {
                        lte: daateSearchEnd,
                        gte: daateSearch,
                    }
                }
            })
            const data = {
                count: services.length,
                total: services.reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue.price), 0)
            }
            return data
        } catch (error) {   
            throw new Error("Internal error");
            
        }
    }
}