import { Roleprop } from "@/components/app-sidebar"
import StudentComps from "./student-comp/studentElems"


export default function CompDisp({role}:Roleprop){
    if(role=="student"){
        return (
           <StudentComps />
        )
    } else if(role=="admin"){
        return (
            <div>admin here too</div>
        )
    }
}