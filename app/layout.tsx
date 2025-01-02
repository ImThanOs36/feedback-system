import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Issue Feedback System',
  description: 'System for submitting and managing issue feedback',
} 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground`}>
        {children}

      </body>
    </html>
  )
}