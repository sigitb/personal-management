import { ValidatedFile } from "@/types/import-file"
import { FILE_CONFIGS, SingleFileImport } from "./import-file"
import { ActionCrateProps, ActionCreateItem } from "@/types"
import { Button } from "./ui/button"
import { Link } from "@inertiajs/react"
import { Plus } from "lucide-react"

export function ActionCreate({ items }: ActionCrateProps) {
    const handleImport = (config: ValidatedFile) => {
        console.log('Single file imported:', config.name)
    }
    const handleActionComponent = (item: ActionCreateItem) => {
        switch (item.type) {
            case 'import':
                return (
                    <SingleFileImport config={FILE_CONFIGS.EXCEL_ONLY}
                        onImport={handleImport} />
                )
                break;
            case 'modal':
                return (
                    <Button variant={'default'} className='rounded-[7px]' onClick={item.onClick} size={"sm"}>
                        {item.icon ? <item.icon className="h-4 w-4" /> : <Plus className='h-4 w-4' />} {item.label}
                    </Button>
                )
            default:
                return (
                    <Button variant={'default'} className='rounded-[7px]' size={"sm"}>
                        <Link href={item.href} className='flex gap-2'> {item.icon ? <item.icon className="h-4 w-4" /> : <Plus className='h-4 w-4' />} {item.label} </Link>
                    </Button>
                )
                break;
        }
    }
    return (
        <div className="flex justify-end gap-4 mb-4">
            {
                items.map((item, index) => (
                    <div key={index}>
                        {handleActionComponent(item)}
                    </div>
                ))
            }
        </div>
    )
}