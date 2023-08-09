"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
// import { Icons } from "@/components/icons"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const components: { title: string; href: string; description: string }[] = [
    {
        title: "Home",
        href: "/",
        description:
            "Back to home",
    },
    {   
        title: "Merkle Tree",
        href: "/merkleTree",
        description:
            "Create Merkle Tree",
    },
    {
        title: "Create NFT Collection",
        href: "/createNFTCollection",
        description:
            "Create your nft collection",
    },
    {
        title: "Mint cNFT",
        href: "/mintcNFT",
        description:
            "Create your NFT",
    },
    {
        title: "Get Your cNFTs",
        href: "/getyourNFTs",
        description:
            "Displays your cNFTs",
    },
    {
        title: "Transfer cNFT",
        href: "/transfercNFT",
        description: "Transfer your NFT to another wallet address",
    },
    {
        title: "Burn cNFT",
        href: "/burncNFT",
        description:
            "Burn your NFT",
    }
]

export function NavigationMenuHeader() {
    return (
        <NavigationMenu>
            <NavigationMenuList>

                <NavigationMenuItem>
                    <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[370px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            {components.map((component) => (

                                <ListItem
                                    key={component.title}
                                    title={component.title}
                                    href={component.href}
                                >
                                    {component.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link href={`${props.href}`}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >

                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>

                </Link>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"
