
import { Separator } from "@/components/ui/separator";
import school from "@/img/download.jpeg";
import Image from "next/image";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

export default function StudentComps(){
    return (
        <div className="w-full flex flex-wrap mb-0 mt-3 mx-auto pb-0 p-3">
            <Card className="main-profile">
                <div className="mono flex flex-wrap gap-6  items-center">
                    <div className="profile">
                    </div>
                 <div>
                     Name: [name]<br/> Grade: [grade]  Section: [section]
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
                    <div className="act">
                        [name] performed [activity] 
                        <span className="text-left"> at [time]</span>
                    </div>
                    <div className="act">
                        [name] performed [activity] 
                        <span className="text-left"> at [time]</span>
                    </div>
                    <div className="act">
                        [name] performed [activity] 
                        <span className="text-left"> at [time]</span>
                    </div>
                    <div className="act">
                        [name] performed [activity] 
                        <span className="text-left"> at [time]</span>
                    </div>
                    <Separator />
                    <div className="clubs">
                    <span className="sans">[name] is currently a member of..</span> <br />
                    <h2 >[club name]</h2>
                    <h2>[club name]</h2>
                    <h2>[club name]</h2>
                    </div> 
                </div>
                <h1 className="sans font-semibold text-lg ml-4">Achievements</h1>
                <Separator />
                <div className="activities">
                    <div className="act">no achievements here yet, so start NOW</div>
                </div>
            </Card>
            <div className="w-[43%] flex flex-col mx-auto">
                <Card className="stats">
                <div>graph here</div>
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
           {/*  <div className="subject-result">
               image gen here 
            </div>*/}
        </div>
    )
}