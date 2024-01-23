
export class FindServiceDto {
    handleFindDto(service: any){
        return service?.map((service: any) => {
            return {
                id: service?.id,
                title: `${service?.car?.description} - ${service?.car?.plate}`,
                subTitle: service?.serviceDetail?.reduce((accumulator: string, currentValue: any, index: number) => String(accumulator) + currentValue.description + (service?.serviceDetail?.length > 1 && index != service?.serviceDetail?.length - 1 ? ", " : ""), " "),
                image: service?.car?.image[0]?.name,
                price: service?.price,
                createdAt: service?.created_at,
                updatedAt: service?.updated_at
            }
        })
        
    }
}