"use client"

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { LayoutGrid, PlusCircle, Search, Table } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

const FilterKost = () => {
    const pathname = usePathname()
    const searchParams = useSearchParams();

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    )

    const layout = searchParams.get('layout') || 'grid'

    return (
        <Card className="p-4 flex-row justify-between items-center">
            <ToggleGroup variant="outline" className="inline-flex" type="single" value={layout}>
                <ToggleGroupItem asChild value="grid">
                    <Link href={pathname + '?' + createQueryString('layout', 'grid')}>
                        <LayoutGrid />
                    </Link>
                </ToggleGroupItem>
                <ToggleGroupItem asChild value="table">
                    <Link href={pathname + '?' + createQueryString('layout', 'table')}>
                        <Table />
                    </Link>
                </ToggleGroupItem>
            </ToggleGroup>

            <div className="flex items-center gap-2">
                <div className="relative">
                    <Input className="placeholder-shown:pl-8" type="search" placeholder="Cari Kost..." />
                    <Search className="absolute size-4 stroke-3 top-1/2 left-2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
                <Select>
                    <SelectTrigger>Filter Draft</SelectTrigger>
                    <SelectContent>
                        <SelectItem value='publish'>Publish</SelectItem>
                        <SelectItem value='draft'>Draft</SelectItem>
                    </SelectContent>
                </Select>
                <Select>
                    <SelectTrigger>Filter Status</SelectTrigger>
                    <SelectContent>
                        <SelectItem value='tersedia'>Tersedia</SelectItem>
                        <SelectItem value='tidak tersedia'>Tidak Tersedia</SelectItem>
                    </SelectContent>
                </Select>
                <Button asChild>
                    <Link href="#"><PlusCircle /> Tambah Kost</Link>
                </Button>
            </div>
        </Card>
    )
}

export default FilterKost