"use client"

import {IconMoon, IconSun} from "@tabler/icons-react"
import {useTheme} from "next-themes"

import {Button} from "@/components/ui/button"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
    const {setTheme} = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="bg-background text-foreground border-border hover:bg-muted transition-colors shrink-0"
                >
                    <IconSun
                        className="h-[1.2rem] w-[1.2rem] text-muted-foreground scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"/>
                    <IconMoon
                        className="absolute h-[1.2rem] w-[1.2rem] text-muted-foreground scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"/>
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="bg-popover text-popover-foreground border border-border shadow-md z-[100]"
            >
                <DropdownMenuItem
                    onClick={() => setTheme("light")}
                    className="hover:bg-muted/50 text-foreground"
                >
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme("dark")}
                    className="hover:bg-muted/50 text-foreground"
                >
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme("system")}
                    className="hover:bg-muted/50 text-foreground"
                >
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}