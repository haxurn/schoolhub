import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  UserCheck, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Bell,
  Plus,
  Eye
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  activeClasses: number;
}

// This would typically come from an API call
const mockStats: DashboardStats = {
  totalStudents: 1247,
  totalTeachers: 89,
  totalCourses: 45,
  activeClasses: 12
};

const recentActivities = [
  { id: 1, action: "New student enrolled", time: "2 hours ago", type: "student" },
  { id: 2, action: "Math exam scheduled", time: "4 hours ago", type: "exam" },
  { id: 3, action: "Teacher profile updated", time: "1 day ago", type: "teacher" },
  { id: 4, action: "New course created", time: "2 days ago", type: "course" },
];

function LoadingCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Loading...</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatsCard({ title, value, icon: Icon, change, href }: {
  title: string;
  value: number;
  icon: any;
  change?: string;
  href: string;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        {change && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {change} from last month
          </p>
        )}
        <Link href={href}>
          <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto">
            <Eye className="h-3 w-3 mr-1" />
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<LoadingCard />}>
          <StatsCard
            title="Total Students"
            value={mockStats.totalStudents}
            icon={Users}
            change="+12%"
            href="/dashboard/students"
          />
        </Suspense>
        <Suspense fallback={<LoadingCard />}>
          <StatsCard
            title="Total Teachers"
            value={mockStats.totalTeachers}
            icon={UserCheck}
            change="+5%"
            href="/dashboard/teachers"
          />
        </Suspense>
        <Suspense fallback={<LoadingCard />}>
          <StatsCard
            title="Active Courses"
            value={mockStats.totalCourses}
            icon={BookOpen}
            change="+8%"
            href="/dashboard/courses"
          />
        </Suspense>
        <Suspense fallback={<LoadingCard />}>
          <StatsCard
            title="Ongoing Classes"
            value={mockStats.activeClasses}
            icon={Calendar}
            href="/dashboard/schedule"
          />
        </Suspense>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Activities */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/dashboard/activities">
              <Button variant="ghost" className="w-full mt-4">
                View All Activities
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/students/new">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Add New Student
              </Button>
            </Link>
            <Link href="/dashboard/teachers/new">
              <Button variant="outline" className="w-full justify-start">
                <UserCheck className="h-4 w-4 mr-2" />
                Add New Teacher
              </Button>
            </Link>
            <Link href="/dashboard/courses/new">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Create New Course
              </Button>
            </Link>
            <Link href="/dashboard/schedule/new">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Class
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}