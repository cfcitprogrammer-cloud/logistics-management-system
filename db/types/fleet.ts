export type Fleet = {
  ID: string;
  "PLATE NUMBER": string;
  MODEL: string;
  "LOAD CAPACITY": number;
  STATUS: string;
  "CURRENT LOCATION": string;
  "CURRENT DRIVER"?: string;
  "CURRENT DRIVER ID"?: string;
  "CREATED AT": string; // ISO date string
  REMARKS?: string;
  "MAINTENANCE STARTS"?: string; // ISO date string
};
