'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import axios from 'axios'
import { Loader } from 'lucide-react'

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

  const [message, setMessage] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleDepartmentChange = (value: string) => {
    setFormData({ ...formData, department: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validate that required fields are not empty
    if (Object.values(formData).some(field => field === '')) {
      setMessage({
        text: "Error: All required fields must be filled out.",
        type: 'error'
      })
      return;
    }

    // Send the form data to the backend
    axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/submit`, { formData }, { headers: { "Content-Type": "application/json" } })
      .then(() => {
        setLoading(false)
        setMessage({
          text: "Success: The issue has been received and the report has been sent to the concerned team via email.",
          type: 'success'
        })
      })
      .catch(() => {
        setMessage({
          text: "Error: Something went wrong. Please try again.",
          type: 'error'
        })
      });

    // Reset form
    setFormData({
      name: '',
      email: '',
      department: '',
      issueTitle: '',
      issueDescription: '',
      additionalInfo: ''
    });
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      {/* Message Box */}
      {message.text && (
        <div className={` p-4 rounded-md ${message.type === 'success' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
          {message.type === 'success' ? (
            <span>✔️ {message.text}</span>
          ) : (
            <span>❌ {message.text}</span>
          )}
        </div>
      )}
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
          <Button type="submit" disabled={loading}>
            {loading ? <Loader /> : "Submit Feedback"}
          </Button>
        </CardFooter>
      </form>


    </Card>
  )
}
