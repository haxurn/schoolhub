import { Roleprop } from "@/components/app-sidebar";
import StNav from "./student-comp/studentNav";

export default function NavDisp({role}:Roleprop){
     if(role == "student"){
        return(
            <StNav />
        )
     } else if (role == "admin"){
        return (
            <div className="text-white">admin here</div>
        )
     }

}