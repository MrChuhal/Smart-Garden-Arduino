"use client"

import { TrendingUp } from "lucide-react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

// Updated chartData to reflect hydration percentage
const chartData = [
  { metric: "hydration", percentage: 75, fill: "var(--color-safari)" },
]

const chartConfig = {
  hydration: {
    label: "Hydration",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

interface RadialChartProps {
    title: string;
    description: string;
    metric: string;
    percentage: number;
    bound: number;
}

export default function SensorGrid({
    title,
    description,
    sensorData,
}: {
    title: string;
    description: string;
    sensorData: { metric: string; value: number }[];
}) {
    return (
        <Card className="flex flex-col w-[500px] min-w-max">
            <CardHeader className="items-center pb-0">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 pb-0 w-[500px] min-w-max mx-auto">
                {sensorData.map((data, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center justify-center aspect-square rounded-xl bg-black"
                        style={{
                            background: `rgba(0, 150, 150, ${data.value / 100})`,
                        }}
                    >
                        <div className="text-sm font-medium text-center">
                            {data.metric}
                        </div>
                        <div className="text-lg font-bold text-center">
                            {data.value}%
                        </div>
                    </div>
                ))}
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm min-w-[400px]">
                <div className="leading-none text-muted-foreground">
                    Moisture Levels around the plant
                </div>
            </CardFooter>
        </Card>
    );
}