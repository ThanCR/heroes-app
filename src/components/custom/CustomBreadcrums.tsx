import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Link } from "react-router";


interface Breadcrumb {
    label: string;
    to: string;
}


interface Props {
    currentPage: string;
    breadcrumbs?: Breadcrumb[]
}

export const CustomBreadcrums = ({ currentPage = 'asd', breadcrumbs = [] }: Props) => {
    return (
        <Breadcrumb className="p-4">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <Link to='/'>Inicio</Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {
                    breadcrumbs.map(crumb => (
                        <>
                            <BreadcrumbLink asChild>
                                <Link to={crumb.to}>{crumb.label}</Link>
                            </BreadcrumbLink>
                            <BreadcrumbSeparator />
                        </>

                    ))
                }
                <BreadcrumbItem>
                    <BreadcrumbPage>
                        {currentPage}
                    </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}
