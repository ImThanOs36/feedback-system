'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from 'lucide-react';
import { format } from "date-fns";

interface IssueFeedback {
  id: string;
  name: string;
  email: string;
  department: string;
  issueTitle: string;
  issueDescription: string;
  additionalInfo: string;
  date: string;
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

  // Load issues from localStorage on mount
  useEffect(() => {
    const storedIssues = localStorage.getItem('issues');
    if (storedIssues) {
      setIssueList(JSON.parse(storedIssues));
    }
  }, []);

  // Memoized filter function
  const filterIssues = useCallback(() => {
    let filtered = issueList;

    if (selectedDepartment !== "All Departments") {
      filtered = filtered.filter(issue => issue.department === selectedDepartment);
    }

    if (selectedDate) {
      filtered = filtered.filter(issue => {
        const issueDate = new Date(issue.date);
        return issueDate.toDateString() === selectedDate.toDateString();
      });
    }

    setFilteredIssues(filtered);
  }, [issueList, selectedDepartment, selectedDate]);

  // Apply filtering whenever relevant state changes
  useEffect(() => {
    filterIssues();
  }, [filterIssues]);

  // Update issue status
  const updateStatus = (id: string, newStatus: 'Open' | 'In Progress' | 'Resolved') => {
    const updatedList = issueList.map(item =>
      item.id === id ? { ...item, status: newStatus } : item
    );

    setIssueList(updatedList);
    localStorage.setItem('issues', JSON.stringify(updatedList));
    filterIssues(); // Reapply filters

    toast({
      title: "Status Updated",
      description: `Issue status updated to ${newStatus}`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl lg:text-4xl">Issue Feedback Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            {/* Filter by Department */}
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

            {/* Filter by Date */}
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

          {/* Issue List Table */}
          <div className="overflow-x-auto sm:overflow-x-visible">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Issue Information</TableHead>
                  <TableHead className="hidden sm:table-cell">Department</TableHead>
                  <TableHead className="hidden sm:table-cell">Status & Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIssues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{issue.issueTitle}</div>
                        <div className="text-sm text-muted-foreground">{issue.name}</div>
                        <div className="text-sm text-muted-foreground">{issue.department}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{issue.department}</TableCell>
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
    </div>
  );
}
