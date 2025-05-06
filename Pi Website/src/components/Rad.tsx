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

export default function RadialChart({
    title,
    description,
    metric,
    percentage,
    bound,
}: RadialChartProps) {
    const chartData = [
        { metric, percentage, fill: "var(--color-safari)" },
    ];

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={{
                        [metric]: {
                            label: metric,
                            color: "hsl(var(--chart-2))",
                        },
                    }}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <RadialBarChart
                        data={chartData}
                        startAngle={90}
                        endAngle={(percentage / bound) * 360 + 90}
                        innerRadius={80}
                        outerRadius={110}
                    >
                        <PolarGrid
                            gridType="circle"
                            radialLines={false}
                            stroke="none"
                            className="first:fill-muted last:fill-background"
                            polarRadius={[86, 74]}
                        />
                        <RadialBar dataKey="percentage" background cornerRadius={10} />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-4xl font-bold"
                                                >
                                                    {percentage}{metric}
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm min-w-[400px]">
                <div className="flex items-center gap-2 font-medium leading-none"></div>
                <div className="leading-none text-muted-foreground">
                    Out of {bound}{metric}
                </div>
            </CardFooter>
        </Card>
    );
}