import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs/promises'
import path from 'path'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const { name, email, department, issueTitle, issueDescription, additionalInfo, priority, feedbackId, date } = req.body
    // @ts-expect-ignore
    const issueData = {
      id: feedbackId,
      name,
      email,
      department,
      issueTitle,
      issueDescription,
      additionalInfo,
      priority,
      date: date || new Date().toISOString(),
      status: 'Open'
    }

    const dataFilePath = path.join(process.cwd(), 'data', 'issues.json')
    let existingData = []

    try {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8')
      existingData = JSON.parse(fileContent)
    } catch (error) {
      // File doesn't exist or is empty, which is fine for the first submission
      console.log(error)
    }

    existingData.push(issueData)
    await fs.writeFile(dataFilePath, JSON.stringify(existingData, null, 2))

    res.status(200).json({ message: 'Issue submitted successfully' })
  } catch (error) {
    console.error('Error processing issue feedback:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}