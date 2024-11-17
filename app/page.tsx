import Navbar from '@/components/Navbar'
import FeedbackForm from '@/components/FeedbackForm'

export default function Home() {
  return (
    <main>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Submit Issue Feedback</h1>
        <FeedbackForm />
      </div>
    </main>
  )
}