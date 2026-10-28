"use client";
import dynamic from "next/dynamic";

const LifeObservationReportScreen = dynamic(
  () => import("@/components/screens/LifeObservationReportScreen"),
  { ssr: false },
);

export default function ReportPage() {
  return <LifeObservationReportScreen />;
}
