'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader } from 'lucide-react';
import { format } from "date-fns";
import axios from 'axios';

interface IssueFeedback {
  id: string | "";
  name: string | "";
  email: string | "";
  department: string | "";
  title: string | "";
  description: string | "";
  additionalInfo: string | "";
  date: string | "";
  rawDate?: Date; // For sorting purposes
  status: 'Open' | 'In Progress' | 'Resolved';
}

const departments = [
  "All Departments",
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
];

export default function AdminDashboard() {
  const [issueList, setIssueList] = useState<IssueFeedback[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<IssueFeedback[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  async function getData() {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues`);
      if (response) {
        setLoading(false);
      }
      const issues = response.data.issues
        .map((issue: { date: string | number | Date }) => {
          const date = new Date(issue.date);
          return {
            ...issue,
            date: `${("0" + date.getDate()).slice(-2)}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`,
            rawDate: date, // Store raw Date for sorting
          };
        })
        .sort((a: { rawDate: number; }, b: { rawDate: number; }) => b.rawDate - a.rawDate); // Sort by rawDate (newest first)

      setIssueList(issues);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const filterIssues = useCallback(() => {
    let filtered = issueList;

    if (selectedDepartment !== "All Departments") {
      filtered = filtered.filter(issue => issue.department === selectedDepartment);
    }

    if (selectedDate) {
      filtered = filtered.filter(issue => {
        const issueDate = new Date(issue.rawDate || issue.date);
        return issueDate.toDateString() === selectedDate.toDateString();
      });
    }

    setFilteredIssues(filtered);
  }, [issueList, selectedDepartment, selectedDate]);

  useEffect(() => {
    filterIssues();
  }, [filterIssues]);

  const updateStatus = (id: string, newStatus: 'Open' | 'In Progress' | 'Resolved') => {
    const updatedList = issueList.map(item =>
      item.id === id ? { ...item, status: newStatus } : item
    );

    setIssueList(updatedList);
    filterIssues();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl lg:text-4xl">Issue Feedback Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div>
              <Label htmlFor="department-select" className="mb-2 block text-sm font-medium">
                Filter by Department
              </Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger id="department-select" className="w-full sm:w-[250px]">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date-select" className="mb-2 block text-sm font-medium">
                Filter by Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full sm:w-[250px] justify-start text-left font-normal ${!selectedDate && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="overflow-x-auto sm:overflow-x-visible">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Issue Information</TableHead>
                  <TableHead className="hidden sm:table-cell">Department</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="hidden sm:table-cell">Status & Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIssues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell>
                      <div>
                        <div className="text-md text-muted-foreground "><b>Title of Issue: </b>{issue.title}</div>
                        <div className="text-sm text-muted-foreground"><b>Name: </b> {issue.name}</div>
                        <div className="text-sm text-muted-foreground"><b>Email: </b>{issue.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{issue.department}</TableCell>
                    <TableCell className="hidden sm:table-cell">{issue.date}</TableCell>
                    <TableCell>
                      <Badge variant={
                        issue.status === 'Resolved' ? 'default' :
                          issue.status === 'In Progress' ? 'secondary' : 'outline'
                      }>
                        {issue.status}
                      </Badge>
                      <div className="mt-2">
                        <Select
                          value={issue.status}
                          onValueChange={(newStatus) => updateStatus(issue.id, newStatus as 'Open' | 'In Progress' | 'Resolved')}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Open">Open</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <div className='flex w-full items-start justify-center p-10' >
        {loading ? <Loader /> : null}
      </div>
    </div>
  );
}
