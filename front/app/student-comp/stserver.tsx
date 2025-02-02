import { CardHeader } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Popover ,PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const chartData = [
    {quarter: "1st quarter", grade: "84"},
    {quarter: "2nd quarter", grade: "52"},
    {quarter: "3rd quarter", grade: "88.8"},
    {quarter: "4th quarter", grade: "86"},
  ]
const chartConfig = {
    grade: {
        label: "average",
        color: "#3e0480"
    }
} satisfies ChartConfig
function StGraph(){
    return (
        <>
        <CardHeader>
                <h1 className="text-center font-semibold sans">student grades</h1> <span>year: 
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button className="hover:bg-purple-100" variant={"ghost"}>select grade</Button>
                            </PopoverTrigger>
                        <PopoverContent className="flex justify-between items-center">
                            <Button>1</Button>
                            <Button>2</Button>
                            <Button>3</Button>
                            <Button>4</Button>
                            <Button>5</Button>
                        </PopoverContent>
                    </Popover>
                </span>
            </CardHeader>
                <ChartContainer config={chartConfig} className="min-h-[200px] z-30 w-[78%] mx-auto">
                  <BarChart className="w-5" accessibilityLayer data={chartData}>
                  <XAxis
      dataKey="quarter"
      tickLine={false}
      tickMargin={10}
      axisLine={false}
      tickFormatter={(value) => value.slice(0, 3)}
    />
    <ChartTooltip content={<ChartTooltipContent />} />
    <ChartLegend content={<ChartLegendContent />} />
                             <CartesianGrid vertical={false} />
                             <Bar dataKey="grade" fill="#3e0480" radius={4} />
                  </BarChart>
                </ChartContainer>
        </>
    )
}

export { StGraph }