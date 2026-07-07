export const parseDate = (date) => {
  if (!date) return null;

  const parsedDate = new Date(date);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

export const formatDisplayDate = (date) => {
  const parsedDate = parseDate(date);

  if (!parsedDate) {
    return "No due date";
  }

  return parsedDate.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const toBackendDate = (date) => {
  const parsedDate = parseDate(date);

  return parsedDate ? parsedDate.toISOString() : null;
};

export const toInputDate = (date) => {
  const parsedDate = parseDate(date);

  return parsedDate ? parsedDate.toISOString().split("T")[0] : "";
};