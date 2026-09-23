const MS_DAY = 24 * 60 * 60 * 1000;
const STATIC_YEARS = [2018, 2025, 2026, 2027, 2028, 2029, 2030];
const possibleDates = buildPossibleDates();

function buildPossibleDates() {
  const dates = [];
  const baseYear = 2020; // leap year to include Feb 29
  const start = Date.UTC(baseYear, 1, 3);
  const end = Date.UTC(baseYear, 2, 9);

  for (let time = start; time <= end; time += MS_DAY) {
    const date = new Date(time);
    dates.push({
      month: date.getUTCMonth(),
      day: date.getUTCDate(),
    });
  }

  return dates;
}

function easterDate(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(Date.UTC(year, month - 1, day));
}

function mardiGrasDate(year) {
  const easter = easterDate(year);
  return new Date(easter.getTime() - 47 * MS_DAY);
}

function kingCakeDays(mardiDate) {
  const year = mardiDate.getUTCFullYear();
  const jan6 = Date.UTC(year, 0, 6);
  const mardiTime = mardiDate.getTime();
  return Math.round((mardiTime - jan6) / MS_DAY) + 1;
}

function kingCakeDaysForDate(month, day) {
  const year = 2020; // use leap year for consistency
  const jan6 = Date.UTC(year, 0, 6);
  const targetDate = Date.UTC(year, month, day);
  return Math.round((targetDate - jan6) / MS_DAY) + 1;
}

function formatDate(date, withYear = false) {
  const monthNames = [
    "Jan.",
    "Feb.",
    "Mar.",
    "Apr.",
    "May",
    "Jun.",
    "Jul.",
    "Aug.",
    "Sep.",
    "Oct.",
    "Nov.",
    "Dec.",
  ];
  const month = monthNames[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  return withYear ? `${month} ${day}, ${year}` : `${month} ${day}`;
}

function formatWeekday(date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function findDateIndex(date) {
  return possibleDates.findIndex(
    (item) => item.month === date.getUTCMonth() && item.day === date.getUTCDate()
  );
}

function classifyByIndex(index) {
  const number = index + 1;

  const halves = number <= 18 ? "Early" : "Late";

  let thirds = "Late";
  if (number <= 12) {
    thirds = "Early";
  } else if (number <= 24) {
    thirds = "Kinda in the Middle";
  }

  let fourths = "Late";
  if (number <= 9) {
    fourths = "Early";
  } else if (number <= 18) {
    fourths = "Kinda Early";
  } else if (number <= 27) {
    fourths = "Kinda Late";
  }

  return { halves, thirds, fourths };
}

function yearAnswer(year) {
  const date = mardiGrasDate(year);
  const verdict = classifyByIndex(findDateIndex(date)).halves;
  return `Mardi Gras ${year} is ${verdict} — Fat Tuesday ${formatDate(date, true)}`;
}

function yearDescription(year) {
  return `${yearAnswer(year)}. That's ${kingCakeDays(mardiGrasDate(year))} days of king cake. Compare the two-, three-, and four-bucket verdicts and settle the debate.`;
}

function validYear(value) {
  return /^\d{4}$/.test(String(value)) && Number(value) >= 1583 && Number(value) <= 9999;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    STATIC_YEARS, possibleDates, mardiGrasDate, kingCakeDays, formatDate,
    formatWeekday, findDateIndex, classifyByIndex, yearAnswer, yearDescription,
    validYear,
  };
}
