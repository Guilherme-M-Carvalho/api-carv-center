import { FindFirstServiceService } from "./FindFirstServiceService";
import puppeteer from "puppeteer"
const style = `
<style>
* {
    font-family: Arial, Helvetica, sans-serif;
    margin: 0;
    padding: 0;
}

.paper {
    padding: 16px;
}

.top {
    border: 1px solid #000;
    padding: 8px;
}

.banner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 8px;
    border-bottom: 1px solid #000;
}

table,
th,
td {
    border: 1px solid #000;
    border-collapse: collapse;
}

th,
td {
    padding: 8px;
}
</style>
`

export class GenerateOsService {
    async execute({ id }: { id: number }) {
        const findService = new FindFirstServiceService()
        const service = await findService.execute({ id });
        let rowsTable = ""
        service.serviceDetail.forEach(el => {
            let description = el.description
            let partPrice = Number(el.price)
            if(el.type_service_id){
                description = el.typeService.description
            }
            if(el.parts.length){
                let subTitle = el?.parts?.reduce((accumulator: string, currentValue, index: number) => {
                    const addString = (el?.parts?.length > 1 && index != el?.parts?.length - 1 ? ", " : "")
                    return String(accumulator) + currentValue.description + addString
                }, " ")
                partPrice += el?.parts?.reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue.price), 0);
                description += `, ${subTitle}`
            }
            rowsTable += `<tr>
            <td colspan="4">
                ${description}
            </td>
            <td>
                ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(partPrice))}
            </td>
        </tr>`
        })
        let htmlResponse = `${style}
        <div class="paper">
            <div class="top">
                <div class="banner">
                    <img height="80" src="http://localhost:3333/files/logo.png" alt="logo" />
                    <h3 style="width: 40%; text-align: center; text-transform: capitalize;">Serviços de manutenção e
                        reparação mecânica de veículos automotores</h1>
                </div>
                <p style="font-size: 10px;"> CNPJ: 22.146.174/0001-08</p>
                <div style="margin-top: 8px; display: flex; justify-content: space-between;">
                    <div style="width: 50%;">
                        <p style="font-weight: 600;">Carv Auto Center</p>
                        <p style="font-size: 10px; text-transform: capitalize;">AVENIDA MANOEL TEIXEIRA SAMPAIO, 289 -
                            JARDIM PRESIDENCIAL</p>
                        <p style="font-size: 10px; text-transform: capitalize;">AVARÉ - SP - CEP 18.706-673</p>
                    </div>
                    <div style="width: 50%; display: flex; flex-direction: column; align-items: flex-end;">
                        <p style="font-weight: 600;">Fone: (14) 99846-4904</p>
                        <p style="font-size: 10px;">e-mail: carvautocenter@gmail.com</p>
                    </div>
                </div>
            </div>

            <div style="display: flex; gap: 16px; margin-top: 16px;">
                <div
                    style="border: 1px solid #000; width: 70%; padding: 8px; display: flex; justify-content: space-between;">
                    <p style="font-weight: 600;">ORDEM DE SERVIÇO</p>
                    <p style="font-weight: 600;">N° ${service.id}</p>
                </div>
                <div
                    style="border: 1px solid #000; width: 30%; padding: 8px; display: flex; justify-content: space-between; align-items: center; justify-content: flex-end;">
                    <p>Data: ${new Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'medium',
            timeZone: 'GMT'
        }).format(new Date(service?.created_at))}</p>
                </div>
            </div>
            <div
                style="margin-top: 16px; border: 1px solid #000; padding: 8px; display: flex; flex-direction: column; gap: 8px;">
                <div style="display: flex;">
                    <p style="font-weight: 600;">Veículo: </p>
                    <p style="border-bottom: 1px solid #000; width: 100%;">${service.car.description}</p>
                </div>
                <div style="display: flex;">
                    <p style="font-weight: 600;">Placa: </p>
                    <p style="border-bottom: 1px solid #000; width: 100%;">${service.car.plate}</p>
                </div>
            </div>
            <div style="margin-top: 16px;">
                <table style="width: 100%; table-layout: fixed;">
                    <thead>
                        <tr>
                            <th colspan="4">
                                Serviço
                            </th>
                            <th>
                                Valor
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    ${rowsTable}
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 16px;">
                <table style="width: 100%; table-layout: fixed;">
                    <thead>
                        <tr>
                            <th colspan="4" style="text-align: left; border-bottom: none;">
                                DE ACORDO
                            </th>
                            <th>
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colspan="4" style="border-top: none;">
                                <div style="margin-top: 30px; width: 100%; border-top: 1px solid #000;">
                                    <p style="text-align: center;">Ass. do Cliente</p>
                                </div>
                            </td>
                            <td>
                                ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(service.price))}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            </div>
        `;
        const pdfPath = `./uploads/os-${service.id}.pdf`;
        const browser = await puppeteer.launch({ headless: 'new' });
        let pagePdf = await browser.newPage();
        await pagePdf.setContent(htmlResponse);

        const pdf = await pagePdf.pdf({
            path: pdfPath,
            format: 'A4',
            // landscape: true,
            // margin: { top: '32px', left: '32px', right: '32px', bottom: '32px' },
            timeout: 0
        });
        await browser.close();

        return pdf
    }
}