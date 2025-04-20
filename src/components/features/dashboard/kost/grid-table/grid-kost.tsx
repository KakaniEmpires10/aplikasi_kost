"use client"

import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AvatarFallback } from "@radix-ui/react-avatar"
import { Pencil, Trash2 } from "lucide-react"
import data from "../data.json"
import { KostType } from "../kost.constant"
import { formatCurrency } from "@/lib/utils"

const dataKost: KostType[] = data

const GridKost = () => {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dataKost.map((item) => (
                    <Card key={item.id}>
                        <CardContent>
                            <div className="flex justify-between items-center">
                                <div className="flex gap-4 items-center">
                                    <Avatar className="rounded-lg w-14 h-14">
                                        <AvatarImage src={item.featured_image} />
                                        <AvatarFallback>Fn</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{item.kost_name}</p>
                                        <Badge variant={"secondary"}>{item.publish}</Badge>
                                    </div>
                                </div>
                                <div className="space-x-1">
                                    <Button size="iconSm"><Pencil /></Button>
                                    <Button variant="destructive" size="iconSm"><Trash2 /></Button>
                                </div>
                            </div>
                            <Separator className="my-4" />
                            <div className="grid grid-cols-2 items-start gap-2">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground whitespace-normal break-words">Owner</p>
                                    <p className="text-xs text-accent-foreground underline underline-offset-4 font-semibold whitespace-normal break-words">{item.owner}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground whitespace-normal break-words">Ditambah oleh</p>
                                    <p className="text-xs font-semibold whitespace-normal break-words">{item.author}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground whitespace-normal break-words">Harga</p>
                                    <p className="text-xs text-accent-foreground font-semibold whitespace-normal break-words">{formatCurrency(parseFloat(item.price))}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground whitespace-normal break-words">Satuan</p>
                                    <p className="text-xs font-semibold whitespace-normal break-words capitalize">per-{item.price_type}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground whitespace-normal break-words">Dibuat</p>
                                    <p className="text-xs text-accent-foreground font-semibold whitespace-normal break-words">{item.created_at}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground whitespace-normal break-words">Update terakhir</p>
                                    <p className="text-xs font-semibold whitespace-normal break-words">{item.updated_at}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground whitespace-normal break-words">Tersedia</p>
                                    <p className="text-xs font-semibold whitespace-normal break-words text-green-500">{item.is_available}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground whitespace-normal break-words">Jml Booking</p>
                                    <p className="text-xs font-semibold whitespace-normal break-words">{item.total_booking}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    )
}

export default GridKost