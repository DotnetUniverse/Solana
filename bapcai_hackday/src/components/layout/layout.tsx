"use client"

import ConnectWalletButton from "@/components/wallet/ConnectWalletButton"
import { ModeToggle } from "../theme/toggleThemeBtn"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"

import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { clusterApiUrl } from "@solana/web3.js"
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import type { AppProps } from "next/app"
import type { FC, PropsWithChildren } from "react"
import React, { useMemo } from "react"
import { NavigationMenuHeader } from "./header"

require("@solana/wallet-adapter-react-ui/styles.css")


export const Layout = ({ children }: PropsWithChildren) => {
    const network = WalletAdapterNetwork.Devnet

    const endpoint = useMemo(() => clusterApiUrl(network), [network])

    const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], [network])

    return (
        <div className="min-h-full w-full">
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets} autoConnect>
                    <WalletModalProvider>
                        <header className="flex flex-row justify-between items-center sticky w-full  top-0 z-50 border-b backdrop-blur p-4">
                            <div className="flex flex-row justify-between items-center gap-4">
                                <h1 className="text-2xl text-green-500 text-whitespace-nowrap">B A P C A I</h1>
                                <NavigationMenuHeader />
                            </div>
                            <div className="flex flex-row justify-center items-center">
                                <ConnectWalletButton />
                                <ModeToggle />
                            </div>
                        </header>

                        <main className="flex justify-center py-4 min-h-screen">
                            {children}
                        </main>
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider >
        </div>
    )
}