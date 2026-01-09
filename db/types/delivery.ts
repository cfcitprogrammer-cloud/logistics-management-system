export type Delivery = {
  ID: string;
  "PO ID": string;
  "LAST LOCATION": string;
  "DELIVERY DATE": number;
  "DELIVERY ADDRESS": string;
  STATUS: string;
  "TRACKING ID"?: string;
  "DELIVERY DATETIME"?: string;
  "RECEIPT FILE": string;
  "CREATED AT"?: string; // ISO date string
};
