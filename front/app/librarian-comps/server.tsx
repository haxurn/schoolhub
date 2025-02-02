
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckboxItem } from "@radix-ui/react-dropdown-menu";

    const element:number[] = [];
for (let i = 0; i < 6; i++) {
    element.push(i);
}
function Booklist(){
    return (
        <>
        {element.map((ind)=> 
        <Card key={ind} className="w-full  flex justify-evenly items-center p-1">
         [book name] 
         <Separator orientation="vertical" className="h-8" /> 
         [student]
         <Separator orientation="vertical" className="h-8" />
         [id]
         <Separator orientation="vertical" className="h-8" />
         [gender]
         <Separator orientation="vertical" className="h-8" />
         [grade level]
         <Separator orientation="vertical" className="h-8" />
         [due date]
        </Card>
        )}
        </>
    )
}
 function ReserveList(){
    return (
        <>
        {element.map((ind)=> 
        <> 
            
            <Card key={ind} className="w-full rounded-none flex justify-evenly items-center p-1">
             <input type="checkbox" />
            <Separator orientation="vertical" className="h-8" />
             [book name]
             <Separator orientation="vertical" className="h-8" />
             [student]
             <Separator orientation="vertical" className="h-8" />
             [id]
             <Separator orientation="vertical" className="h-8" />
             [gender]
             <Separator orientation="vertical" className="h-8" />
             [grade level]
             <Separator orientation="vertical" className="h-8" />
             [reservation expire date]
            </Card>
        </>
        )}
        </>
    )
}
export { Booklist , ReserveList }