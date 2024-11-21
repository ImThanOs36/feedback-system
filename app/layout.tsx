import './globals.css'
import type { Metadata } from 'next'
import { Toaster } from "@/components/ui/toaster"



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
      <body >
        {children}
        <Toaster />
      </body>
    </html>
  )
}