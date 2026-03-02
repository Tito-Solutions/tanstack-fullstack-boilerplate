import { withTamboInteractable } from "@tambo-ai/react";
import { z } from "zod";
import { ProfileInformationCard } from "./ProfileInformationCard";

export const ProfileInformationCardPropsSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
});

export const InteractableProfileInformationCard = withTamboInteractable(
  ProfileInformationCard,
  {
    componentName: "ProfileInformationCard",
    description: "Card that edits a user's profile (first name, last name, email).",
    propsSchema: ProfileInformationCardPropsSchema,
  },
);