import { Roleprop } from "@/components/app-sidebar"
import StudentComps from "./student-comp/studentElems"
import LibComp from "./librarian-comps/librComp"
import ParentComp from "./parent-comps/parentComp"


export default function CompDisp({role}:Roleprop){
    switch (role) {
        case "student":
            return (
                <StudentComps />
            )
        case "parent":
            return (
                <ParentComp />
            )
        case "librarian":
            return (
                <LibComp />
            )
        case "abmin":
            return (
                <div>admin components go here...</div>
            )
        default:
            break;
    }
    
    
    
    
    // if(role=="student"){
    //     return (
    //        <StudentComps />
    //     )
    // }else if(role=="parent"){
    //     return(
    //         <ParentComp />
    //     )    
    // } else if(role=="admin"){
    //     return (
    //         <div>admin here too</div>
    //     )
    // }else if(role=="librarian"){
    //     return(
    //         <LibComp />
    //     )
    // }
}