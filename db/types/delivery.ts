export type Delivery = {
  ID: string;
  "PO ID": string;
  "LAST LOCATION": string;
  "DELIVERY DATE": number; // timestamp or number representation of date
  "DELIVERY ADDRESS": string;
  STATUS: string;
  "CREATED AT"?: string; // ISO date string
  "TRACKING ID"?: string;
  "RECEIPT FILE": string;
  "DELIVERY DATETIME"?: string; // ISO date string
  "RECEIVE DATE"?: string; // ISO date string
  "LAST UPDATED"?: string; // ISO date string
  LAT?: number; // delivery latitude
  LONG?: number; // delivery longitude
  LATFROM?: number; // from latitude
  LATTO?: number; // to latitude
  LONGFROM?: number; // from longitude
  LONGTO?: number; // to longitude
  COURIER?: string;
  FROM?: string; // from address
  ATTACHMENT?: string;
};
