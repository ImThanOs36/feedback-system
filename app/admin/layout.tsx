import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Issue Feedback Admin',
  description: 'Admin dashboard for managing issue feedback',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <main className={inter.className}>
        {children}
        <Toaster />
      </main>
    </>
  )
}
