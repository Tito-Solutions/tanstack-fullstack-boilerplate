import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "~/components/layout/DashboardLayout";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent } from "~/components/ui/card";

function UsersPage() {
  // Mock user data
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Active" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User", status: "Inactive" },
    { id: 4, name: "Alice Brown", email: "alice@example.com", role: "Editor", status: "Active" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Users
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your application users
            </p>
          </div>
          <Button>Add User</Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center space-x-2">
            <Input
              placeholder="Filter users..."
              className="max-w-sm"
            />
          </div>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4">
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <div className="font-medium">{user.role}</div>
                      <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mt-1 ${
                        user.status === "Active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {user.status}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export const Route = createFileRoute("/dashboard/users/")({
  component: UsersPage,
});