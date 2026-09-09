function todayDateWithTimeStamp(): string {
  const today = new Date();
  return today.toISOString();
}

function pastDate(numberOfDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() - numberOfDays);
  return d.toISOString();
}

function pastDateWithEndTimeStamp(numberOfDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() - numberOfDays);
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
}

function futureDateWithTimeStamp(numberOfDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + numberOfDays);
  return d.toISOString();
}

function convertISODateToShortDate(isoDateString: string): string {
  const date = new Date(isoDateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const dateUtils = {
  todayDateWithTimeStamp,
  pastDate,
  futureDateWithTimeStamp,
  pastDateWithEndTimeStamp,
  convertISODateToShortDate,
};
