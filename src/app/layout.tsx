import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tip Jar - Send ETH on BASE',
  description: 'Send ETH tips to anyone on BASE',
  icons: { icon: '/favicon.PNG' },
  other: {
    'base:app_id': '6a1b24ab0404c6213202498d',
    'fc:frame': JSON.stringify({
      version: '1',
      imageUrl: 'https://tipjar-base.vercel.app/favicon.PNG',
      button: {
        title: 'Send a Tip',
        action: {
          type: 'launch_frame',
          name: 'Base Tip Jar',
          url: 'https://tipjar-base.vercel.app',
          splashImageUrl: 'https://tipjar-base.vercel.app/favicon.PNG',
          splashBackgroundColor: '#ffffff',
        },
      },
    }),
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={geist.className}>{children}</body>
    </html>
  )
}