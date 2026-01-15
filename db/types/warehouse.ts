// db/types/warehouse.ts
export interface WarehouseStock {
  ID: number;
  "ITEM ID": string;
  "ITEM NAME": string;
  CATEGORY: string;
  UOM: string;
  "CURRENT STOCK": number;
  "RESERVED STOCK": number;
  "AVAILABLE STOCK": number;
  "MINIMUM STOCK LEVEL": number;
  "MAXIMUM STOCK LEVEL": number;
}
