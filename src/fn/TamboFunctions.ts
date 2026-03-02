import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";
import { http } from "~/hooks/api/http";
import { ProfileForm } from "~/components/ProfileInformationCard";
import { useAuthenticationStore } from "~/store/useAuthenticationStore";

interface GetDashboardAnalyticsInput {
  range: 'week' | 'month' | 'quarter' | 'year';
}

async function getDashboardAnalytics(input: GetDashboardAnalyticsInput) {
  const res = await http.get("/activity/dashboard", {
    params: { range: input.range },
  });
  return res.data;
}

export const DashboardAnalyticsTool: TamboTool = {
  name: "get_dashboard_analytics",
  description: "Get the dashboard analytics data",
  tool: getDashboardAnalytics,
  inputSchema: z.object({
    range: z.enum(['week', 'month', 'quarter', 'year']).describe("The range of the analytics data"),
  }),
  outputSchema: z.any(), // replace with a real schema once you know it
};

async function getMetricsData(input: GetDashboardAnalyticsInput) {
    const res = await http.get("/activity/dashboard", {
      params: { range: input.range },
    });
    const data = res.data.data;
    return [
      {value: data.pageSummary.uniqueUsers, label: 'Unique Users'},
      {value: data.pageSummary.totalVisits, label: 'Total Route Usage'},
      {value: data.pageSummary.avgResponseTime, label: 'Average Response Time'},
    ];
  }

export const MetricsDataTool: TamboTool = {
  name: "get_metrics_data",
  description: "Get the metrics data",
  tool: getMetricsData,
  inputSchema: z.object({
    range: z.enum(['week', 'month', 'quarter', 'year']).describe("The range of the analytics data"),
  }),
  outputSchema: z.any(), // replace with a real schema once you know it
};

async function updateProfileForm(input: ProfileForm) {
  const res = await http.patch("/users/update", input);
  useAuthenticationStore.getState().setUser(res.data);
  
  return res;
}

export const UpdateProfileFormTool: TamboTool = {
  name: "update_profile_form",
  description: "Update the profile form",
  tool: updateProfileForm,
  inputSchema: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().optional(),
  }),
  outputSchema: z.any(),
};