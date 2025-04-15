"use client"

import { useSelectedLayoutSegments } from "next/navigation";

const DashboardTitle = () => {
    const selectedSegments = useSelectedLayoutSegments();
    let selectedSegment;

    if (selectedSegments.length > 0) {
        selectedSegment = selectedSegments[selectedSegments.length - 1].replace(
            "-",
            " "
        );
    }

    return (
        <h1 className="text-base font-medium capitalize">{ selectedSegment }</h1>
    )
}

export default DashboardTitle