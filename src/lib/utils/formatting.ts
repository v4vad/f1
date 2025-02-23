export const formatStatus = (status: string): string => {
  if (status === "Finished" || status.includes("+")) return status;
  if (status.includes("Accident")) return "DNF - Accident";
  if (status.includes("Engine")) return "DNF - Engine";
  if (status.includes("Mechanical")) return "DNF - Mechanical";
  if (status.includes("Transmission")) return "DNF - Transmission";
  if (status.includes("Hydraulics")) return "DNF - Hydraulics";
  if (status.includes("Brakes")) return "DNF - Brakes";
  if (status.includes("Electrical")) return "DNF - Electrical";
  if (status.includes("Retired")) return "DNF - Retired";
  if (status.includes("Disqualified")) return "DSQ";
  return `DNF - ${status}`;
};

export const calculateLapDelta = (currentTime: string, previousTime: string): number | null => {
  if (!previousTime || !currentTime) return null;
  
  const convertToSeconds = (time: string) => {
    const parts = time.split(':');
    if (parts.length === 2) {
      return parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
    }
    return parseFloat(parts[0]);
  };

  const current = convertToSeconds(currentTime);
  const previous = convertToSeconds(previousTime);
  return current - previous;
};

export const getPodiumColor = (position: string): string => {
  switch (position) {
    case "1":
      return "bg-yellow-200/70 dark:bg-yellow-500/30 min-h-[160px]";
    case "2":
      return "bg-gray-200/70 dark:bg-gray-500/30 min-h-[130px]";
    case "3":
      return "bg-orange-200/70 dark:bg-orange-500/30 min-h-[100px]";
    default:
      return "";
  }
}; 