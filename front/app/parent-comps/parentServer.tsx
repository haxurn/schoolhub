import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

function Children(){
    return (
        <>
        <Card className="flex items-center">
        <Avatar className="ml-3">
                        <AvatarImage src="https://i.pinimg.com/736x/25/9d/65/259d65dbdf19e6ada0287b5e851a6f91.jpg" />
                        <AvatarFallback>IM</AvatarFallback>
                    </Avatar>
        </Card>
        </>
    )
}