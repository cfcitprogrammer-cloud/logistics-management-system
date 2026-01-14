export function getDeliveryStatus(deliveryDate: string | Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const delivery = new Date(deliveryDate);
  delivery.setHours(0, 0, 0, 0);

  if (isNaN(delivery.getTime())) return "Unknown";

  if (delivery.getTime() === today.getTime()) return "On Schedule";
  if (delivery.getTime() < today.getTime()) return "Delayed";

  return "Upcoming";
}
