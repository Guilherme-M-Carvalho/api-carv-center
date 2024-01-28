import prismaClient from "../../prisma";

export class FindServiceReportService {
    async execute({ start, end }: { start: string; end: string }) {

        const dateSearch = new Date(start + " 00:00")
        const dateSearchEnd = new Date(end + " 20:59")
        const time = dateSearch.getTime()
        const timeEnd = dateSearchEnd.getTime()
        const subtract = (timeEnd - time)
        const days = Math.ceil(subtract / (24 * 60 * 60 * 1000));
        const week = Math.ceil(days / 7)

        const arr = Array.from(Array(week).keys())

        const dataFind: { lte: Date; gte: Date }[] = []
        const year = dateSearch.getFullYear()
        const month = (dateSearch.getMonth() + 1)
        let dayActive = dateSearch.getDate() - 1
        const dayEnd = dateSearchEnd.getDate()

        console.log({
            dayActive,
            days,
            subtract
        });


        arr.forEach((el, i) => {
            if ((arr.length - 1) === i) {
                dataFind.push({ gte: new Date(`${year}-${month}-${dayActive + 1} 00:01`), lte: new Date(`${year}-${month}-${dayEnd} 20:59`) })
            } else {
                if (!i) {
                    console.log(dayActive + 1);

                }
                dataFind.push({ gte: new Date(`${year}-${month}-${dayActive + 1} 00:01`), lte: new Date(`${year}-${month}-${dayActive + 7} 20:59`) })
            }
            dayActive += 7
        })

        try {

            const result = await Promise.all(dataFind.map(async (data) => {
                return {
                    service: await prismaClient.serviceCar.findMany({
                        where: {
                            created_at: {
                                lte: data.lte,
                                gte: data.gte,
                            }
                        },
                        orderBy: {
                            created_at: "asc"
                        }
                    }),
                    start: data.gte,
                    end: data.lte
                }
            }))
            const chart: { x: string; y: number; qtd: number }[] = []

            if (result.length === 1) {
                const dates: string[] = []
                result.forEach(el => {
                    el.service.forEach(serv => {
                        const dateFormt = this.formatDate(new Date(serv.created_at))
                        if (!dates.find(el => el === dateFormt)) {
                            dates.push(dateFormt)
                        }
                    })
                })
                if (dates.length === 1) {

                    result.forEach(el => {
                        el.service.forEach((serv, i) => {
                            chart.push({ x: this.formatDate(new Date(serv.created_at))+ ` ${i+1}`, y: Number(serv.price), qtd: 1 })
                        })
                    })
                } else {
                    dates.map(date => {
                        const service = result[0].service.filter(el => {
                            const formatDate = this.formatDate(new Date(el.created_at))
                            return formatDate === date
                        })

                        const total = service.reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue.price), 0);
                        chart.push({ x: date, y: total, qtd: service.length })
                    })
                }

            } else {
                result.forEach(el => {
                    const total = el.service.reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue.price), 0);
                    chart.push({ x: `${new Date(el.start).getDate()} - ${new Date(el.end).getDate()}`, y: total, qtd: el.service.length })
                })

            }

            return chart
            const services = await prismaClient.serviceCar.findMany({
                where: {
                    created_at: {
                        lte: dateSearchEnd,
                        gte: dateSearch,
                    }
                }
            })

            // console.log({
            //     services
            // });


        } catch (error) {

        }
    }

    formatDate(date: Date) {
        return new Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'short',
        }).format(date)
    }
}