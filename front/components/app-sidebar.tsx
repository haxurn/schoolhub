import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
  } from "@/components/ui/sidebar"
import { Button } from "./ui/button";

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
      <div className="w-full h-fit">
        <SidebarHeader>
                      <h1 className="sbhead">student options</h1>
                   </SidebarHeader>
                   <SidebarContent>
                     <SidebarGroup />
                     <SidebarGroup />
                   </SidebarContent>
                  <SidebarFooter />
      </div>
      :
      <div className="w-full h-fit">
        <SidebarHeader>
              <h1 className="sbhead">admin options</h1>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup />
             <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
      </div>
      }
    </Sidebar>
  )
}

  