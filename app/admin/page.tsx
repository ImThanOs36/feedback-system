'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import AdminDashboard from '@/components/AdminDashboard'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      router.push('/login')
    }
  }, [router])

  return (
    <main>
      <Navbar />
      <AdminDashboard />
    </main>
  )
}