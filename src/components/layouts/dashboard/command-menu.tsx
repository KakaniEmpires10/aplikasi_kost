"use client"

import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Dispatch, SetStateAction, useEffect } from "react"

type CommandMenuProps = {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
}

const CommandMenu = ({ open, setOpen }: CommandMenuProps) => {
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    })

  return (
      <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
              <CommandEmpty>Menu yang anda cari tidak ada.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                  <CommandItem>Calendar</CommandItem>
                  <CommandItem>Search Emoji</CommandItem>
                  <CommandItem>Calculator</CommandItem>
              </CommandGroup>
          </CommandList>
      </CommandDialog>
  )
}

export default CommandMenu