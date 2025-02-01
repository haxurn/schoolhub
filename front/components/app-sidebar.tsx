import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
  } from "@/components/ui/sidebar"
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";


// export type Roleprops = {
//   student: boolean;
//   teacher: boolean;
//   admin: boolean;
// }
export type Roleprop = {
    role: string;
}

export default function AppSidebar({role}:Roleprop){
  return (
    <Sidebar>
      {role=="student"?
      <div className="w-full flex flex-col items-center justify-between h-full">
        <div>
          <SidebarHeader>
                        <h1 className="sbhead">{role} options</h1>
                     </SidebarHeader>
                     <SidebarContent>
                       <SidebarGroup>
                       <Button className="sidebtn" variant={"ghost"}>home</Button>
                         <Button className="sidebtn" variant={"ghost"}>club applications</Button>
                         <Button className="sidebtn" variant={"ghost"}>club membership management</Button>
                         <Button className="sidebtn" variant={"ghost"}>book reservation</Button>
                       </SidebarGroup>
                     </SidebarContent>
        </div>
                   <div>  
                      <SidebarGroup>
                      <h1 className="sbhead">settings</h1>
                      <Button className="sidebtn" variant={"ghost"}>profiles setting</Button>
                      <Button className="sidebtn" variant={"ghost"}>add certificate to achievements</Button>
                     </SidebarGroup>
                     <Separator />
                                       <SidebarFooter>
                       <h1 className="text-sm">this project was made by students in vission academy</h1>
                                       </SidebarFooter>
                   </div>
      </div>
      :role=="admin"?
      <div className="w-full flex flex-col items-center justify-between h-full">
        <SidebarHeader>
              <h1 className="sbhead">{role} options</h1>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>

              </SidebarGroup>
            </SidebarContent>
            <div>
              <Separator />
                                         <SidebarFooter>
                         <h1 className="text-sm">this project was made by students in vission academy</h1>
                                         </SidebarFooter>
            </div>
      </div>
      :role=="parent"?
    <div className="w-full flex flex-col items-center justify-between h-full">
      <SidebarHeader>
      <h1 className="sbhead">{role} options</h1>
      </SidebarHeader>
      <SidebarContent>
      <SidebarGroup>
     <Button className="sidebtn" variant={"ghost"}>home</Button>
     <Button className="sidebtn" variant={"ghost"}>payment methods</Button>
     <Button className="sidebtn" variant={"ghost"}>curiclum</Button>
</SidebarGroup>
            </SidebarContent>
            <div>
              <Separator />
                                         <SidebarFooter>
                         <h1 className="text-sm">this project was made by students in vission academy</h1>
                                         </SidebarFooter>
            </div>
    </div>
    :role == "librarian"?
        <div className="w-full flex flex-col items-center justify-between h-full">
 <SidebarHeader>
      <h1 className="sbhead">{role} options</h1>
      </SidebarHeader>
      <SidebarContent> 
        <p>more options in the near future..</p>

            </SidebarContent>
            <div>
              <Separator />
                                         <SidebarFooter>
                         <h1 className="text-sm">this project was made by students in vission academy</h1>
                                         </SidebarFooter>
            </div>
        </div>
        : ""}
    </Sidebar>
  )
}

  