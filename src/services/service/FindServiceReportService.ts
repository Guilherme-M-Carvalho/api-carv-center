import prismaClient from "../../prisma";

export class FindServiceReportService {
    async execute({ start, end }: { start: string; end: string }) {
        const dateSearch = new Date(start + " 00:01")
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

        arr.forEach((el, i) => {
            if ((arr.length - 1) === i) {
                dataFind.push({ gte: new Date(`${year}-${month}-${dayActive + 1} 00:01`), lte: new Date(`${year}-${month}-${dayEnd} 20:59`) })
            } else {
                dataFind.push({ gte: new Date(`${year}-${month}-${dayActive + 1} 00:01`), lte: new Date(`${year}-${month}-${dayActive + 7} 20:59`) })
            }
            dayActive += 7
        })

        try {
            const result = await Promise.all(dataFind.map(async (data) => {
                const service = await prismaClient.serviceDetailCar.findMany({
                    select: {
                        id: true,
                        customerParts: true,
                        parts: true,
                        description: true,
                        image: true,
                        price: true,
                        created_at: true,
                        costProduct: {
                            select: {
                                id: true,
                                price: true,
                                priceResale: true,
                                deleted: true,
                                serviceDetail: true,
                                service_detail_id: true,
                                cost_resale_id: true
                            },
                            where: {
                                deleted: false
                            }
                        }
                    },
                    where: {
                        created_at: {
                            lte: data.lte,
                            gte: data.gte,
                        },
                        deleted: false
                    },
                    orderBy: {
                        created_at: "asc"
                    }
                })

                const cost = await prismaClient.cost.findMany({
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        costProduct: {
                            select: {
                                id: true,
                                price: true,
                                priceResale: true,
                                deleted: true,
                                serviceDetail: true,
                                service_detail_id: true,
                                cost_resale_id: true
                            },
                            where: {
                                deleted: false
                            }
                        },
                        costHitory: {
                            select: {
                                id: true,
                                amount: true,
                                price: true,
                                priceResale: true,
                                created_at: true,
                            },
                            where: {
                                deleted: false
                            }
                        },
                        created_at: true
                    },
                    where: {
                        created_at: {
                            lte: data.lte,
                            gte: data.gte,
                        },
                        deleted: false
                    },
                    orderBy: {
                        created_at: "asc"
                    }
                })

                const productResale = await prismaClient.costResale.findMany({
                    select: {
                        id: true,
                        price: true,
                        costProduct: {
                            select: {
                                id: true,
                                price: true,
                                priceResale: true,
                                deleted: true,
                                serviceDetail: true,
                                service_detail_id: true,
                                cost_resale_id: true
                            },
                            where: {
                                deleted: false
                            }
                        },
                        created_at: true
                    },
                    where: {
                        deleted: false,
                        created_at: {
                            lte: data.lte,
                            gte: data.gte,
                        },
                    }
                })

                return {
                    service: service,
                    cost: cost.map(el => {
                        const priceResale = el.costProduct.filter(el => !!el.serviceDetail || !!el.cost_resale_id)
                        const history = el.costHitory.pop()
                        return {
                            ...el,
                            amount: history.amount,
                            price: history.price,
                            priceResale: priceResale.reduce((acc, val) => acc + Number(val.price), 0)
                        }
                    }),
                    productResale: productResale,
                    start: data.gte,
                    end: data.lte
                }
            }))

            const chart: {
                chart: { legend: string; x: number; date: string; y: number; qtd: number }[]; title: string; domain: {
                    min: number;
                    max: number
                }
            }[] = []

            if (result.length === 1) {
                const dates: string[] = []
                result.forEach(el => {
                    el.service.forEach(serv => {
                        const dateFormt = this.formatDate(new Date(serv.created_at))
                        if (!dates.find(el => el === dateFormt)) {
                            dates.push(dateFormt)
                        }
                    })
                    el.cost.forEach(serv => {
                        const dateFormt = this.formatDate(new Date(serv.created_at))
                        if (!dates.find(el => el === dateFormt)) {
                            dates.push(dateFormt)
                        }
                    })
                    el.productResale.forEach(serv => {
                        const dateFormt = this.formatDate(new Date(serv.created_at))
                        if (!dates.find(el => el === dateFormt)) {
                            dates.push(dateFormt)
                        }
                    })
                })
                if (dates.length === 1) {
                    const chartProfit: { legend: string; x: number; date: string; y: number; qtd: number }[] = []
                    const chartCost: { legend: string; x: number; date: string; y: number; qtd: number }[] = []
                    const chartLiquid: { legend: string; x: number; date: string; y: number; qtd: number }[] = []
                    const chartPart: { legend: string; x: number; date: string; y: number; qtd: number }[] = []
                    const chartResale: { legend: string; x: number; date: string; y: number; qtd: number }[] = []
                    let resalePrice = 0
                    let productResalePrice = 0
                    result.forEach(el => {
                        let maxProfit = 0
                        let minProfit = 0
                        let maxCost = 0
                        let minCost = 0
                        let maxPart = 0
                        let minPart = 0
                        let maxResale = 0
                        let minResale = 0
                        resalePrice += el.service.reduce((acc, val) => acc + Number(val.costProduct.filter(el => !!el.service_detail_id).reduce((acc, val) => acc + Number(val.priceResale), 0)), 0)
                        productResalePrice += el.productResale.reduce((acc, val) => acc + Number(val.costProduct.filter(el => !!el.cost_resale_id).reduce((acc, val) => acc + Number(val.priceResale), 0)), 0)
                        resalePrice += productResalePrice
                        let countResale = 1
                        el.service.forEach((serv, i) => {
                            const resaleCost = serv.costProduct.filter(el => !!el.serviceDetail) // deve ser feito pelo serviço
                            const resalePrice = resaleCost.reduce((acc, val) => acc + Number(val.priceResale), 0) // deve ser feito pelo serviço

                            const y = serv?.parts?.reduce((accumalator, value) => accumalator + Number(value.price), 0)
                            chartPart.push({ legend: "Peças", qtd: serv?.parts?.length, x: i + 1, date: this.formatDate(new Date(serv.created_at)), y: y })
                            chartProfit.push({ legend: "Lucro (Bruto)", x: i + 1, date: this.formatDate(new Date(serv.created_at)), y: (Number(serv.price)), qtd: 1 })
                            chartResale.push({ legend: "Venda (Produtos)", x: countResale, date: this.formatDate(new Date(serv.created_at)), y: Number(resalePrice), qtd: Number(resaleCost.length) }) // deve ser feito pelo serviço
                            countResale++
                            maxProfit = this.validationMax(maxProfit, Number(serv.price))
                            minProfit = this.validationMin(minProfit, Number(serv.price))
                            maxPart = this.validationMax(maxPart, Number(y))
                            minPart = this.validationMin(minPart, Number(y))
                            maxResale = this.validationMax(maxResale, Number(resalePrice)) // deve ser feito pelo serviço
                            minResale = this.validationMin(minResale, Number(resalePrice)) // deve ser feito pelo serviço
                        })
                        el.cost.forEach((serv, i) => {
                            // const resaleCost = serv.costProduct.filter(el => !!el.serviceDetail) // deve ser feito pelo serviço
                            // const resalePrice = resaleCost.reduce((acc, val) => acc + Number(val.priceResale), 0) // deve ser feito pelo serviço
                            chartCost.push({ legend: "Custo", x: (i + 1), date: this.formatDate(new Date(serv.created_at)), y: Number(serv.price), qtd: Number(serv.amount) })
                            // chartResale.push({ legend: "Venda (Produtos)", x: (i + 1), date: this.formatDate(new Date(serv.created_at)), y: Number(resalePrice), qtd: Number(resaleCost.length) }) // deve ser feito pelo serviço
                            maxCost = this.validationMax(maxCost, Number(serv.price))
                            minCost = this.validationMin(minCost, Number(serv.price))
                            // maxResale = this.validationMax(maxResale, Number(resalePrice)) // deve ser feito pelo serviço
                            // minResale = this.validationMin(minResale, Number(resalePrice)) // deve ser feito pelo serviço
                        })
                        el.productResale.forEach((resale, i) => {
                            const resaleProd = resale.costProduct.filter(el => !!el.cost_resale_id)
                            const resalePrice = resaleProd.reduce((acc, val) => acc + Number(val.priceResale), 0)
                            chartResale.push({ legend: "Venda (Produtos)", x: countResale, date: this.formatDate(new Date(resale.created_at)), y: Number(resalePrice), qtd: Number(resaleProd.length) })
                            maxResale = this.validationMax(maxResale, Number(resalePrice))
                            minResale = this.validationMin(minResale, Number(resalePrice))
                            countResale++
                        })
                        if (chartProfit.length !== chartCost.length) {
                            if (chartProfit.length > chartCost.length) {
                                const subtract = chartProfit.length - chartCost.length
                                const arr = Array.from(Array(subtract).keys())
                                arr.forEach((el, i) => {
                                    chartCost.push({
                                        legend: "Custo",
                                        qtd: 0,
                                        x: i + 1,
                                        y: 0,
                                        date: chartProfit[chartCost.length + i]?.date
                                    })
                                })
                            } else if (chartCost.length > chartProfit.length) {
                                const subtract = chartCost.length - chartProfit.length
                                const arr = Array.from(Array(subtract).keys())
                                arr.forEach((el, i) => {
                                    chartProfit.push({
                                        legend: "Lucro (Bruto)",
                                        qtd: 0,
                                        x: i + 1,
                                        y: 0,
                                        date: chartCost[chartProfit.length + i]?.date
                                    })
                                })
                            }
                        }
                        chartProfit.map((el, i) => {
                            const y = el.y - chartCost[i].y
                            chartLiquid.push({ legend: "Lucro (Líquido)", qtd: 1, x: i + 1, y, date: el.date })
                        })

                        chart.push({
                            chart: chartProfit, title: "Lucro (Bruto)", domain: {
                                max: maxProfit,
                                min: minProfit
                            }
                        })
                        chart.push({
                            chart: chartCost, domain: {
                                max: maxCost,
                                min: minCost
                            }, title: "Custo"
                        })
                        chart.push({
                            chart: chartPart, domain: {
                                max: maxPart,
                                min: minPart
                            }, title: "Peças"
                        })
                        chart.push({
                            chart: chartResale, domain: {
                                max: maxResale,
                                min: minResale
                            }, title: "Venda (Produtos)"
                        })


                    })

                    const totalProfit = chartProfit.reduce((acc, val) => acc + val.y, 0) + resalePrice
                    const totalCost = chartCost.reduce((acc, val) => acc + val.y, 0)
                    const totalPart = chartPart.reduce((acc, val) => acc + val.y, 0)
                    const totalLiquid = (totalProfit - totalCost)
                    return {
                        totalProfit,
                        totalCost,
                        totalPart,
                        totalLiquid,
                        totalResale: resalePrice,
                        chart
                    }
                } else {

                    const chartProfit: { legend: string; x: number; date: string; y: number; qtd: number }[] = []
                    const chartCost: { legend: string; x: number; date: string; y: number; qtd: number }[] = []
                    const chartLiquid: { legend: string; x: number; date: string; y: number; qtd: number }[] = []
                    const chartPart: { legend: string; x: number; date: string; y: number; qtd: number }[] = []
                    const chartResale: { legend: string; x: number; date: string; y: number; qtd: number }[] = []
                    let maxProfit = 0
                    let minProfit = 0
                    let maxCost = 0
                    let minCost = 0
                    let maxPart = 0
                    let minPart = 0
                    let maxliquid = 0
                    let minliquid = 0
                    let maxResale = 0
                    let minResale = 0
                    let resalePrice = 0

                    dates.map((date, i) => {
                        const service = result[0].service.filter(el => {
                            const formatDate = this.formatDate(new Date(el.created_at))
                            return formatDate === date
                        })
                        const cost = result[0].cost.filter(el => {
                            const formatDate = this.formatDate(new Date(el.created_at))
                            return formatDate === date
                        })
                        const resale = result[0].productResale.filter(el => {
                            const formatDate = this.formatDate(new Date(el.created_at))
                            return formatDate === date
                        })
                        const amountProduct = service.reduce((acc,val) => acc + Number(val.costProduct.length),0)
                        const amountResale = resale.reduce((acc,val) => acc + Number(val.costProduct.length),0)
                        const totalProduct = service.reduce((accumulator, currentValue) => Number(accumulator) + (Number(currentValue.costProduct.reduce((acc, val) => acc + Number(val.priceResale),0))), 0);

    
                        const totalResale = resale.reduce((acc, val) => acc + Number(val.costProduct.filter(el => !!el.cost_resale_id).reduce((acc, val) => acc + Number(val.priceResale), 0)), 0) + totalProduct

                        const total = service.reduce((accumulator, currentValue) => Number(accumulator) + (Number(currentValue.price)), 0) + totalResale;

                        const totalCost = cost.reduce((accumulator, currentValue) => Number(accumulator) + (Number(currentValue.price)), 0);
                        const totalPart = service.reduce((acc, val) => Number(acc) + val.parts.reduce((accumalator, value) => accumalator + Number
                            (value.price), 0), 0)
                        const amountPart = service.reduce((acc, val) => acc + val.parts.length, 0)
                        chartProfit.push({ legend: "Lucro (Bruto)", x: i + 1, date: date, y: total, qtd: service.length + amountProduct + amountResale })
                        chartCost.push({ legend: "Custo", x: i + 1, date: date, y: totalCost, qtd: cost.length })
                        chartPart.push({ legend: "Peças", qtd: amountPart, x: i + 1, date: date, y: totalPart })

                        const qtdResale = resale[0].costProduct.filter(el => !!el.cost_resale_id).length + service.reduce((acc, val) => acc + val.costProduct.length, 0)

                        chartResale.push({ legend: "Venda (Produtos)", qtd: qtdResale, x: i + 1, date: date, y: totalResale })
                        maxProfit = this.validationMax(maxProfit, total)
                        minProfit = this.validationMin(minProfit, total)
                        maxCost = this.validationMax(maxCost, totalCost)
                        minCost = this.validationMin(minCost, totalCost)
                        maxPart = this.validationMax(maxPart, totalPart)
                        minPart = this.validationMin(minPart, totalPart)
                        maxResale = this.validationMax(maxResale, totalResale)
                        minResale = this.validationMin(minResale, totalResale)
                        resalePrice += totalResale
                    })


                    chartProfit.map((el, i) => {
                        const y = (el.y - chartCost[i].y)
                        chartLiquid.push({ legend:`Vendas, ${chartCost[i].qtd} Custo`, qtd: el.qtd, x: i + 1, y, date: el.date })
                        maxliquid = this.validationMax(maxliquid, y)
                        minliquid = this.validationMin(minliquid, y)
                    })
                    chart.push({
                        chart: chartProfit, domain: {
                            max: maxProfit,
                            min: minProfit,
                        }, title: "Lucro (Bruto)"
                    })
                    chart.push({
                        chart: chartCost, domain: {
                            max: maxCost,
                            min: minCost,
                        }, title: "Custo"
                    })
                    chart.push({
                        chart: chartLiquid, domain: {
                            max: maxliquid,
                            min: minliquid
                        }, title: "Lucro (Líquido)"
                    })
                    chart.push({
                        chart: chartPart, domain: {
                            max: maxPart,
                            min: minPart
                        }, title: "Peças"
                    })
                    chart.push({
                        chart: chartResale, domain: {
                            max: maxResale,
                            min: minResale
                        }, title: "Venda (Produtos)"
                    })
                    const totalProfit = chartProfit.reduce((acc, val) => acc + val.y, 0)
                    
                    const totalCost = chartCost.reduce((acc, val) => acc + val.y, 0)
                    const totalPart = chartPart.reduce((acc, val) => acc + val.y, 0)
                    const totalLiquid = (totalProfit - totalCost)

                    return {
                        totalProfit,
                        totalCost,
                        totalPart,
                        totalLiquid,
                        totalResale: resalePrice,
                        chart
                    }
                }

            } else {
                const chartProfit: { legend: string; x: number; date: string; y: number; qtd: number }[] = []
                const chartCost: { legend: string; x: number; date: string; y: number; qtd: number }[] = []
                const chartLiquid: { legend: string; x: number; date: string; y: number; qtd: number }[] = []
                const chartPart: { legend: string; x: number; date: string; y: number; qtd: number }[] = []
                const chartResale: { legend: string; x: number; date: string; y: number; qtd: number }[] = []

                let maxProfit = 0
                let minProfit = 0
                let maxCost = 0
                let minCost = 0
                let maxPart = 0
                let minPart = 0
                let maxliquid = 0
                let minliquid = 0
                let maxResale = 0
                let minResale = 0
                let resalePrice = 0
                result.forEach((el, i) => {
                    const totalPart = el.service.reduce((acc, val) => Number(acc) + val.parts.reduce((accumalator, value) => accumalator + Number(value.price), 0), 0)

                    const amountPart = el.service.reduce((acc, val) => acc + val.parts.length, 0)

                    const amountProduct = el.service.reduce((acc,val) => acc + Number(val.costProduct.length),0)
                    const amountResale = el.productResale.reduce((acc,val) => acc + Number(val.costProduct.length),0)

                    const totalProduct = el.service.reduce((accumulator, currentValue) => Number(accumulator) + (Number(currentValue.costProduct.reduce((acc, val) => acc + Number(val.priceResale),0))), 0);

                    const totalResale = el.productResale.reduce((acc, val) => acc + Number(val.costProduct.filter(el => !!el.cost_resale_id).reduce((acc, val) => acc + Number(val.priceResale), 0)), 0) + totalProduct

                    const total = el.service.reduce((accumulator, currentValue) => Number(accumulator) + (Number(currentValue.price)), 0)  + totalResale;
                    const totalCost = el.cost.reduce((accumulator, currentValue) => Number(accumulator) + (Number(currentValue.price)), 0);
                    chartProfit.push({ legend: "Lucro (Bruto)", x: i + 1, date: `${new Date(el.start).getDate()} - ${new Date(el.end).getDate()}`, y: total, qtd: el.service.length + amountProduct + amountResale })
                    chartCost.push({ legend: "Custo", x: i + 1, date: `${new Date(el.start).getDate()} - ${new Date(el.end).getDate()}`, y: totalCost, qtd: el.cost.length })
                    chartPart.push({ legend: "Peças", qtd: amountPart, x: i + 1, date: `${new Date(el.start).getDate()} - ${new Date(el.end).getDate()}`, y: totalPart })


                    const countResale = el.productResale.reduce((acc,val) => acc + val.costProduct.length,0)
                    const countServiceProduct = el.service.reduce((acc,val) => acc + val.costProduct.length,0)

                    chartResale.push({ legend: "Venda (Produtos)", qtd: (countResale + countServiceProduct), x: i + 1, date: `${new Date(el.start).getDate()} - ${new Date(el.end).getDate()}`, y: totalResale })

                    maxProfit = this.validationMax(maxProfit, total)
                    minProfit = this.validationMin(minProfit, total)
                    maxCost = this.validationMax(maxCost, totalCost)
                    minCost = this.validationMin(minCost, totalCost)
                    maxPart = this.validationMax(maxPart, totalPart)
                    minPart = this.validationMin(minPart, totalPart)
                    maxResale = this.validationMax(maxResale, totalResale)
                    minResale = this.validationMin(minResale, totalResale)
                    resalePrice += totalResale
                })
                chartProfit.map((el, i) => {
                    const y = el.y - chartCost[i].y
                    chartLiquid.push({ legend: `Vendas, ${chartCost[i].qtd} Custo`, qtd: el.qtd, x: i + 1, y, date: el.date })
                    maxliquid = this.validationMax(maxliquid, y)
                    minliquid = this.validationMin(minliquid, y)
                })
                chart.push({
                    chart: chartProfit, domain: {
                        max: maxProfit,
                        min: minProfit,
                    }, title: "Lucro (Bruto)"
                })
                chart.push({
                    chart: chartCost, domain: {
                        max: maxCost,
                        min: minCost,
                    }, title: "Custo"
                })
                chart.push({
                    chart: chartLiquid, domain: {
                        max: maxliquid,
                        min: minliquid
                    }, title: "Lucro (Líquido)"
                })
                chart.push({
                    chart: chartPart, domain: {
                        max: maxPart,
                        min: minPart
                    }, title: "Peças"
                })
                chart.push({
                    chart: chartResale, domain: {
                        max: maxResale,
                        min: minResale
                    }, title: "Venda (Produtos)"
                })

                const totalProfit = chartProfit.reduce((acc, val) => acc + val.y, 0)
                const totalCost = chartCost.reduce((acc, val) => acc + val.y, 0)
                const totalPart = chartPart.reduce((acc, val) => acc + val.y, 0)
                const totalLiquid = (totalProfit - totalCost)

                return {
                    totalProfit,
                    totalCost,
                    totalPart,
                    totalLiquid,
                    totalResale: resalePrice,
                    chart
                }

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


    validationMin(current: number, val: number) {
        if (current > val) {
            return val
        }
        return current
    }
    validationMax(current: number, val: number) {
        if (current < val) {
            return val
        }
        return current
    }

    formatDate(date: Date) {
        return new Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'short',
        }).format(date)
    }
}