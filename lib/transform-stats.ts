// lib/transformStats.ts
export function transformWeekStats(apiData: any) {
  return apiData.order.map((day: string) => ({
    name: day,
    Delivered: apiData.days[day].Delivered,
    Completed: apiData.days[day].Completed,
    Returned: apiData.days[day].Returned,
    InTransit: apiData.days[day]["In Transit"],
    Total: apiData.days[day].Total,
  }));
}
