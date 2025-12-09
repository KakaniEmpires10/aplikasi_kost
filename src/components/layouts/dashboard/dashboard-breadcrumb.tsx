import { Card } from "@/components/ui/card"
import DynamicBreadcrumb from "@/components/ui/dynamic-breadcrumb"

const DashboardBreadcrumb = () => {
    return (
        <Card className="py-1.5 px-4 rounded-lg">
            <DynamicBreadcrumb />
        </Card>
    )
}

export default DashboardBreadcrumb