import { z } from "zod";

export const teamMemberSchema = z.object({
  name: z
    .string()
    .min(2, "Name required")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .email("Invalid email"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Valid 10-digit number required"),
  year: z.enum(["1st", "2nd", "3rd"], {
    message: "Select your year",
  }),
  branch: z.enum([
    "ASE", "BT", "CH", "CV", "CSE", "AIML", "CY", "DS", "EEE", 
    "ECE", "EIE", "IEM", "ISE", "ME", "ETE"
  ], {
    message: "Select your branch",
  }),
  usn: z
    .string()
    .min(8, "Valid USN required (e.g. 1RV24IS152)"),
});

export const registrationSchema = z.object({
  teamName: z
    .string()
    .min(2, "Team name required")
    .max(100, "Team name must be less than 100 characters"),
  teamSize: z.enum(["1", "2"], {
    message: "Team size must be 1 or 2",
  }),
  members: z
    .array(teamMemberSchema)
    .min(1, "At least 1 team member required")
    .max(2, "Maximum 2 team members allowed"),
});

export type TeamMember = z.infer<typeof teamMemberSchema>;
export type RegistrationFormData = z.infer<typeof registrationSchema>;

export const YEAR_OPTIONS = [
  { value: "1st", label: "1st Year" },
  { value: "2nd", label: "2nd Year" },
  { value: "3rd", label: "3rd Year" },
];

export const BRANCH_OPTIONS = [
  { value: "ASE", label: "ASE" },
  { value: "BT", label: "BT" },
  { value: "CH", label: "CH" },
  { value: "CV", label: "CV" },
  { value: "CSE", label: "CSE" },
  { value: "AIML", label: "AIML" },
  { value: "CY", label: "CY" },
  { value: "DS", label: "DS" },
  { value: "EEE", label: "EEE" },
  { value: "ECE", label: "ECE" },
  { value: "EIE", label: "EIE" },
  { value: "IEM", label: "IEM" },
  { value: "ISE", label: "ISE" },
  { value: "ME", label: "ME" },
  { value: "ETE", label: "ETE" },
];
