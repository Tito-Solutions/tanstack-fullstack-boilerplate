import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "~/components/layout/DashboardLayout";
import { Button } from "~/components/ui/button";
import { TextField } from "~/components/ui/TextField";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { UserAvatar } from "~/components/UserAvatar";
import { ChangePasswordForm } from "~/components/ChangePasswordForm";
import { MFAToggle } from "~/components/MFAToggle";
import { useAuth } from '~/hooks/useAuth';
import { useAuthenticationStore } from "~/store/useAuthenticationStore";

function ProfilePage() {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");

  const { isAuthenticated, user } = useAuthenticationStore();
  const { logout, loading } = useAuth();
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Profile
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your profile information
          </p>
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center gap-4 md:flex-row">
                <UserAvatar 
                  imageUrl={null}
                  name={user.name}
                  email={user.email}
                  size="xl"
                />
                <div className="space-y-2">
                  <Button variant="outline">Change Avatar</Button>
                  <p className="text-sm text-muted-foreground">
                    JPG, GIF or PNG. 1MB max.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <TextField
                  id="name"
                  label="Name"
                  value={user.name}
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  id="email"
                  label="Email"
                  type="email"
                  value={user.email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
          <MFAToggle />
          <ChangePasswordForm />
        </div>
      </div>
    </DashboardLayout>
  );
}

export const Route = createFileRoute("/dashboard/profile/")({
  component: ProfilePage,
});