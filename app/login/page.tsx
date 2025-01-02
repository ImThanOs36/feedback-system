'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would validate credentials against a backend
    // For this example, we'll use a hardcoded username and password
    if (username === 'admin' && password === 'password') {
      localStorage.setItem('isLoggedIn', 'true')
      router.push('/admin')
    } 
  }

  return (
    <main>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Login</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  )
}