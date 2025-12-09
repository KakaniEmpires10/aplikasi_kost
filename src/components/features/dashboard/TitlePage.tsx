"use client"

import { SEGMENT_TITLES } from "@/lib/segment-title";
import { useSelectedLayoutSegments } from "next/navigation";

const TitlePage = () => {
  const segments = useSelectedLayoutSegments();
  const lastSegment = segments[segments.length - 1];

  // Get custom title or fallback to formatted segment
  const title = SEGMENT_TITLES[lastSegment] ||
    (lastSegment ? lastSegment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Dashboard');

  return (
    <h2 className="text-xl font-bold">{title}</h2>
  );
}

export default TitlePage