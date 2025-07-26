"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  Download, 
  Edit, 
  Eye, 
  Trash2,
  MoreHorizontal,
  UserCheck
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface Teacher {
  id: string;
  teacherId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  qualification: string;
  specialization: string;
  experience: number;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';
  joinDate: string;
  coursesCount: number;
}

// Mock data - this would typically come from an API
const mockTeachers: Teacher[] = [
  {
    id: "1",
    teacherId: "TCH001",
    firstName: "Dr. Alice",
    lastName: "Johnson",
    email: "alice.johnson@school.edu",
    phone: "+1-234-567-8901",
    qualification: "PhD Mathematics",
    specialization: "Advanced Mathematics",
    experience: 15,
    status: "ACTIVE",
    joinDate: "2020-01-15",
    coursesCount: 3
  },
  {
    id: "2",
    teacherId: "TCH002",
    firstName: "Prof. Robert",
    lastName: "Smith",
    email: "robert.smith@school.edu",
    phone: "+1-234-567-8902",
    qualification: "MSc Physics",
    specialization: "Quantum Physics",
    experience: 12,
    status: "ACTIVE",
    joinDate: "2021-03-01",
    coursesCount: 2
  },
  {
    id: "3",
    teacherId: "TCH003",
    firstName: "Ms. Emily",
    lastName: "Davis",
    email: "emily.davis@school.edu",
    phone: "+1-234-567-8903",
    qualification: "MA English Literature",
    specialization: "Creative Writing",
    experience: 8,
    status: "ON_LEAVE",
    joinDate: "2022-08-15",
    coursesCount: 2
  },
  {
    id: "4",
    teacherId: "TCH004",
    firstName: "Dr. Michael",
    lastName: "Brown",
    email: "michael.brown@school.edu",
    phone: "+1-234-567-8904",
    qualification: "PhD Chemistry",
    specialization: "Organic Chemistry",
    experience: 20,
    status: "ACTIVE",
    joinDate: "2018-06-01",
    coursesCount: 4
  },
];

const statusColors = {
  ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  INACTIVE: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  ON_LEAVE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  TERMINATED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSpecialization, setFilterSpecialization] = useState("");

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = 
      teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.teacherId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filterStatus || teacher.status === filterStatus;
    const matchesSpecialization = !filterSpecialization || 
      teacher.specialization.toLowerCase().includes(filterSpecialization.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesSpecialization;
  });

  const handleDeleteTeacher = (teacherId: string) => {
    setTeachers(teachers.filter(teacher => teacher.id !== teacherId));
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teachers</h1>
          <p className="text-muted-foreground">
            Manage teaching staff and their information
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Link href="/dashboard/teachers/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Teacher
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teachers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Teachers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teachers.filter(t => t.status === 'ACTIVE').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teachers.filter(t => t.status === 'ON_LEAVE').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Experience</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(teachers.reduce((acc, t) => acc + t.experience, 0) / teachers.length)} yrs
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Teaching Staff Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="ON_LEAVE">On Leave</option>
              <option value="TERMINATED">Terminated</option>
            </select>
            <Input
              placeholder="Filter by specialization"
              value={filterSpecialization}
              onChange={(e) => setFilterSpecialization(e.target.value)}
              className="sm:w-64"
            />
          </div>

          {/* Teachers Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-4 font-medium">Teacher</th>
                  <th className="text-left p-4 font-medium">ID</th>
                  <th className="text-left p-4 font-medium">Qualification</th>
                  <th className="text-left p-4 font-medium">Specialization</th>
                  <th className="text-left p-4 font-medium">Experience</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Courses</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{teacher.firstName} {teacher.lastName}</div>
                        <div className="text-sm text-gray-500">{teacher.email}</div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-sm">{teacher.teacherId}</td>
                    <td className="p-4 text-sm">{teacher.qualification}</td>
                    <td className="p-4 text-sm">{teacher.specialization}</td>
                    <td className="p-4 text-sm">{teacher.experience} years</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[teacher.status]}`}>
                        {teacher.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-sm">{teacher.coursesCount} courses</td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/teachers/${teacher.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/teachers/${teacher.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteTeacher(teacher.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredTeachers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No teachers found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}