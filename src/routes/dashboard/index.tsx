import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DashboardLayout } from "~/components/layout/DashboardLayout";

const dashboardSchema = z.object({
  name: z.string().min(2, "Name is required"),
});

type DashboardFormData = z.infer<typeof dashboardSchema>;

function DashboardHome() {
  const form = useForm<DashboardFormData>({
    resolver: zodResolver(dashboardSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: DashboardFormData) => {
    console.log("Form data:", data);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to Your Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Start building your application here
          </p>
        </div>

        <div className="max-w-md">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </DashboardLayout>
  );
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});
