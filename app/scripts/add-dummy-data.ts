import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const dummyData = [
  {
    id: uuidv4(),
    name: "John Doe",
    email: "john.doe@example.com",
    department: "Food Services",
    issueTitle: "Shortage of vegetarian options",
    issueDescription: "There are not enough vegetarian meal options in the cafeteria.",
    additionalInfo: "Many employees have requested more plant-based meals.",
    priority: "medium",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    status: "Open"
  },
  {
    id: uuidv4(),
    name: "Jane Smith",
    email: "jane.smith@example.com",
    department: "Food Services",
    issueTitle: "Expired milk in coffee station",
    issueDescription: "Found expired milk cartons in the 3rd floor coffee station.",
    additionalInfo: "This has happened twice this week.",
    priority: "high",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    status: "In Progress"
  },
  {
    id: uuidv4(),
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    department: "Food Services",
    issueTitle: "Request for gluten-free options",
    issueDescription: "We need more gluten-free meal options in the cafeteria.",
    additionalInfo: "Several employees have celiac disease or gluten sensitivity.",
    priority: "medium",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    status: "Open"
  }
]

async function addDummyData() {
  const dataFilePath = path.join(process.cwd(), 'data', 'issues.json')
  let existingData = []

  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8')
    existingData = JSON.parse(fileContent)
  } catch (error) {
    // File doesn't exist or is empty, which is fine
    console.log(error)
  }

  existingData.push(...dummyData)
  await fs.writeFile(dataFilePath, JSON.stringify(existingData, null, 2))
  console.log('Dummy data added successfully')
}

addDummyData().catch(console.error)