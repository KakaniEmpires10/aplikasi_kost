import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button" 
import { ClipboardList, DoorOpen } from "lucide-react"
import { authSectionProps } from "@/components/features/auth/auth.constant"

const SwitchSectionButton = ({ register, onRegisterChange }: authSectionProps) => {
    return (
        <div role="tablist" className="bg-secondary text-secondary-foreground p-1 drop-shadow flex gap-2 rounded-md absolute top-2 left-1/2 transform -translate-x-1/2 z-10">
            <Button
                role="tab"
                variant="ghost"
                className={cn("w-36 py-1.5 px-3 rounded-sm", { "bg-background hover:bg-background dark:hover:bg-background text-foreground text-shadow-xs": !register })}
                onClick={() => onRegisterChange(false)}
            >
                { register && <DoorOpen className="w-5 h-5 mr-2" /> } Login
            </Button>
            <Button
                role="tab"
                variant="ghost"
                className={cn("w-36 py-1.5 px-3 rounded-sm", { "bg-background hover:bg-background dark:hover:bg-background text-foreground text-shadow-xs": register })}
                onClick={() => onRegisterChange(true)}
            >
                { !register && <ClipboardList className="w-5 h-5 mr-2" />} Register
            </Button>
        </div>
    )
}

export default SwitchSectionButton