import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StGraph } from "../student-comp/stserver";

export default function ParentComp(){
    return (
        <div className="wrapper">
         <Card className="parent-profile">
            <div className="gap-5 flex w-[40%]">
                <Avatar className="ml-3 w-12 h-12">
                    <AvatarImage src="https://i.pinimg.com/736x/25/9d/65/259d65dbdf19e6ada0287b5e851a6f91.jpg" />
                    <AvatarFallback>IM</AvatarFallback>
                        </Avatar>
         
            <div className="flex w-[15%] gap-1 flex-col">
                <p>[name]</p><p>[description]</p>
            </div>
           </div>
           <div className="w-[60%] flex gap-3 justify-end items-center ">
            <Button className="">add child</Button> 
           </div>
           </Card>
           <div className="flex flex-row flex-wrap my-4">
            <Card  className="min-w-[37%] mx-auto">
             student list here
            </Card>
            <Card className="min-w-[57%] mx-auto">
               <StGraph /> 
            </Card>
           </div>
        </div>
    )
}