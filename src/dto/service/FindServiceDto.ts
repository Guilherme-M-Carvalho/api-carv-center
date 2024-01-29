
export class FindServiceDto {
    handleFindDto(service: any){
        return service?.map((service: any) => {
            let subTitle = service?.serviceDetail?.reduce((accumulator: string, currentValue: any, index: number) => {
                const addString = (service?.serviceDetail?.length > 1 && index != service?.serviceDetail?.length - 1 ? ", " : "")
                if(currentValue?.typeService?.id){
                    return String(accumulator) + currentValue?.typeService?.description + addString
                }
                return String(accumulator) + currentValue.description + addString
            }, " ")
            return {
                id: service?.id,
                title: `${service?.car?.description} - ${service?.car?.plate}`,
                subTitle: subTitle,
                image: service?.car?.image[0]?.name,
                price: service?.price,
                name: service?.car?.client?.name,
                phone: service?.car?.client?.phone,
                createdAt: service?.created_at,
                updatedAt: service?.updated_at
            }
        })
        
    }
}