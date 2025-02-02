"use client"
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import { useState } from "react";
import NavDisp from "./navDisplay";
import { role } from "./role"
import CompDisp from "./compDisplay";
import { Card } from "@/components/ui/card";

export default function DashboardLoader(){
  const [show, setShow] = useState(false)
  return(
    <div > 
      
      <nav className="nav">
      <div className="flex items-start">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-2 h-4" />
        <svg xmlns="http://www.w3.org/2000/svg" className="inline " height="30px" viewBox="0 -960 960 960" width="30px" fill="#000000"><path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240L480-120Zm0-332 274-148-274-148-274 148 274 148Zm0 241 200-108v-151L480-360 280-470v151l200 108Zm0-241Zm0 90Zm0 0Z"/></svg>
        <h1 className="text-black font-[family-name:var(--font-geist-sans)] font-bold text-xl">schoolhub</h1>
      </div>
      <div className="flex relative flex-shrink flex-row items-center gap-1   p-1">
        <Button variant={"ghost"} className="">
          <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-help"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 17l0 .01" /><path d="M12 13.5a1.5 1.5 0 0 1 1 -1.5a2.6 2.6 0 1 0 -3 -4" /></svg>
        </Button>
        <Button variant={"ghost"} className="relative " onClick={()=>{if(show!==true){setShow(true)}else{setShow(false)}}}>{role} actions
          <div className={show==true?`absolute smtrans top-12 flex flex-col p-3 items-center rounded-xl z-20 gap-4 bg-zinc-900`:"absolute opacity-0 smtrans -top-7 flex flex-col p-3 items-center rounded-xl gap-4 bg-zinc-900"}>
          <NavDisp role={role} />
          </div>
          </Button>
            
      </div>
      </nav>
      <Separator orientation="horizontal" ></Separator>
      <h1 className="text-black m-3 font-semibold font-[family-name:var(--font-geist-sans)] text-2xl">{role} dashboard</h1>
      <Separator className="w-3/4 my-0 mx-auto" orientation="horizontal"></Separator>
   <CompDisp role={role} />
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
