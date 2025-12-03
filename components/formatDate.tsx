import { format } from "date-fns";

export function formatWIB(dateString: string) {
  if (!dateString) return "—";

  const date = new Date(dateString);

  // Konversi ke WIB (UTC+7)
  const wibDate = new Date(date.getTime());

  return format(wibDate, "dd MMM yyyy HH:mm:ss");
}
