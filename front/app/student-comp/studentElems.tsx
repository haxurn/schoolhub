import { Separator } from "@/components/ui/separator";
import school from "@/img/download.jpeg";
import Image from "next/image";
import { Card, CardHeader } from "@/components/ui/card";
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { AvatarFallback, Avatar, AvatarImage } from "@/components/ui/avatar";
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
export default function StudentComps(){
    
    return (
        <div className="w-full flex flex-row flex-wrap mb-0 mt-3 mx-auto pb-0 p-3">
            <Card className="main-profile">
                <div className="mono flex flex-wrap gap-6  items-center">
                    <Avatar className="ml-3">
                        <AvatarImage src="https://i.pinimg.com/736x/25/9d/65/259d65dbdf19e6ada0287b5e851a6f91.jpg" />
                        <AvatarFallback>IM</AvatarFallback>
                    </Avatar>
                 <div>
                     Name: [name]<br/> Grade: [grade]  Section: [section] <br /> id: [id number]
                     <p className="description">
                        [description of student]
                     </p>
                 </div>
                </div>
                <Separator className="my-3" />
                <h2 className=" ml-2 font-semibold text-xl sans">activities and clubs</h2>
                <div className="activities">
                    <div className="act">
                        [name] performed [activity] 
                        <span className="text-left"> at [time]</span>
                    </div>
                    <Separator />
                    <div className="clubs">
                    <span className="sans">[name] is currently a member of..</span> <br />
                    <h2 >[club name]</h2>
                    </div> 
                </div>
                <h1 className="sans font-semibold text-lg ml-4">Achievements</h1>
                <Separator />
                <div className="activities">
                    <div className="act">no achievements here yet, so start NOW</div>
                </div>
            </Card>
          
            <div className="min-w-[43%] w-auto flex flex-wrap flex-col my-3 mx-auto">
                <Card className="stats">
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
                </Card>
                <Card className="club-announcement">
                    <h1 className="sans text-lg text-center m-2 font-semibold">club announcements</h1>
                    <Separator />
                <div className="act flex items-center gap-3">
             <div className="h-8 w-8 rounded-full bg-[#eaeaea]"></div> <div className="flex flex-col">
                <h3>[announcer]  [club name]</h3>
                <p>THIS HAS HAPPENED!!!</p>
             </div>
               </div>
                </Card>
            </div>
            <Card className="school-announcements">
                 <h1 className="sans font-bold text-xl text-center m-2">school announcements</h1>
                 <Separator />
               <div className="act flex items-center gap-3">
             <div className="h-8 w-8 rounded-full bg-[#eaeaea]"></div> <div className="flex flex-col">
                <h3>[announcer]</h3>
                <p>THIS HAS HAPPENED!!!</p>
             </div>
               </div>
            </Card>
        </div>
    )
}