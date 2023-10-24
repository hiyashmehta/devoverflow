import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getTimeStamp = (createdAt: Date): string => {
  const now = new Date().getTime(); // Convert now to a number
  const createdAtTime = createdAt.getTime(); // Convert createdAt to a number
  const elapsedMilliseconds = now - createdAtTime;

  // Define the time intervals and their respective labels
  const intervals: { [key: string]: number } = {
    year: 365 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    hour: 60 * 60 * 1000,
    minute: 60 * 1000,
  };

  // Find the appropriate time interval
  for (const [interval, milliseconds] of Object.entries(intervals)) {
    const count = Math.floor(elapsedMilliseconds / milliseconds);
    if (count >= 1) {
      return `${count} ${interval}${count === 1 ? '' : 's'} ago`;
    }
  }

  // If none of the intervals match (e.g., less than a minute), use "just now"
  return 'just now';
};

// Example usage
const createdAt = new Date('2023-09-10T12:00:00.000Z');
console.log(getTimeStamp(createdAt)); // Example output: "2 days ago"


export const formatAndDivideNumber = (num: number): string => {
  if (num >= 1000000) {
    const formattedNum = (num / 1000000).toFixed(1);
    return `${formattedNum}M`;
  } else if (num >= 1000) {
    const formattedNum = (num / 1000).toFixed(1);
    return `${formattedNum}K`;
  } else {
    return num.toString();
  }
};

export const getJoinedDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
  return new Intl.DateTimeFormat('en-US', options).format(date);
}
