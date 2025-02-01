import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export default function LibComp(){
    const [list,setList] = useState("Books borrowed")
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
            <Button className="">check in</Button> 
           </div>
        </Card>
        <div className="flex my-2 justify-between">
            <h3 className="text-2xl font-semibold sans">{list}</h3> 
            <div>
                <Button onClick={() =>setList("Books borrowed")} className="m-1">books borrowed</Button><Button onClick={()=>setList("Reservations")} className="m-1">reservations</Button></div>
        </div>
        <Separator className="mb-3"/>
        {list=="Books borrowed"?
        <div>
            <Card className="w-full flex justify-evenly items-center p-1">
              book name <Separator orientation="vertical" className="h-8" />student<Separator orientation="vertical" className="h-8" />id<Separator orientation="vertical" className="h-8" />gender<Separator orientation="vertical" className="h-8" />grade level<Separator orientation="vertical" className="h-8" />due date
            </Card>
            <Separator className="my-2" />
            {/**data goes here */}
        </div>
       
            :list=="Reservations"?
            <div>
            <Card className="w-full flex justify-evenly items-center p-1">
              book name <Separator orientation="vertical" className="h-8" />student<Separator orientation="vertical" className="h-8" />id<Separator orientation="vertical" className="h-8" />gender<Separator orientation="vertical" className="h-8" />grade level<Separator orientation="vertical" className="h-8" />reservation expire date
            </Card>
            <Separator className="my-2" />
             {/**data goes here */}
        </div>
            :""}
        </div>
    )
}