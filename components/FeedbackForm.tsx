'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from 'uuid'

const departments = [
  "Human Resources",
  "Finance",
  "Information Technology",
  "Marketing",
  "Operations",
  "Research and Development",
  "Customer Service",
  "Sales",
  "Legal",
  "Administration",
  "Food Services"
]

export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    issueTitle: '',
    issueDescription: '',
    additionalInfo: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleDepartmentChange = (value: string) => {
    setFormData({ ...formData, department: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newIssue = {
      ...formData,
      id: uuidv4(),
      date: new Date().toISOString(),
      status: 'Open'
    }
    
    // In a real application, you would send this data to your backend
    // For now, we'll just store it in localStorage
    const storedIssues = localStorage.getItem('issues')
    const issues = storedIssues ? JSON.parse(storedIssues) : []
    issues.push(newIssue)
    localStorage.setItem('issues', JSON.stringify(issues))

    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback. We'll review it shortly.",
    })

    // Reset form
    setFormData({
      name: '',
      email: '',
      department: '',
      issueTitle: '',
      issueDescription: '',
      additionalInfo: ''
    })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Submit Your Feedback</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select value={formData.department} onValueChange={handleDepartmentChange} required>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="issueTitle">Issue Title</Label>
            <Input id="issueTitle" name="issueTitle" value={formData.issueTitle} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="issueDescription">Issue Description</Label>
            <Textarea id="issueDescription" name="issueDescription" value={formData.issueDescription} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Additional Information</Label>
            <Textarea id="additionalInfo" name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">Submit Feedback</Button>
        </CardFooter>
      </form>
    </Card>
  )
}