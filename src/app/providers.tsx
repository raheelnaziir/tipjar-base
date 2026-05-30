'use client'

import { OnchainKitProvider } from '@coinbase/onchainkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TransactionNotFoundError } from 'viem'
import { baseSepolia } from 'viem/chains'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { coinbaseWallet, metaMask, injected, walletConnect } from 'wagmi/connectors'

const queryClient = new QueryClient()

const config = createConfig({
    chains: [baseSepolia],
    connectors: [
        coinbaseWallet({ appName: 'Base Tip Jar' }),
        metaMask(),
        injected(),
        walletConnect({
            projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
        }),
    ],
    transports: {
        [baseSepolia.id]: http(),
    },
})

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <OnchainKitProvider
                    apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
                    chain={baseSepolia}
                    config={{
                        appearance: {
                            mode: 'light',
                        },
                        wallet: {
                            display: 'modal',
                            supportedWallets: {
                                rabby: true,
                                trust: true,
                                frame: true,
                            },
                        },
                    }}
                >
                    {children}
                </OnchainKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}