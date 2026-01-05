const MS_DAY = 24 * 60 * 60 * 1000;

const yearInput = document.getElementById("yearInput");
const yearDown = document.getElementById("yearDown");
const yearUp = document.getElementById("yearUp");
const mardiDate = document.getElementById("mardiDate");
const mardiWeekday = document.getElementById("mardiWeekday");
const halvesResult = document.getElementById("halvesResult");
const thirdsResult = document.getElementById("thirdsResult");
const fourthsResult = document.getElementById("fourthsResult");
const breakdownTable = document.querySelector("#breakdownTable tbody");
const breakdownCards = document.getElementById("breakdownCards");
const timelineMarker = document.getElementById("timelineMarker");
const timelineMarkerLabel = document.getElementById("timelineMarkerLabel");

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

function renderBreakdownTable(selectedIndex) {
  breakdownTable.innerHTML = "";

  possibleDates.forEach((date, idx) => {
    const row = document.createElement("tr");
    if (idx === selectedIndex) {
      row.classList.add("highlight");
    }

    const classification = classifyByIndex(idx);
    const displayDate = `${formatMonthDay(date.month, date.day)}`;

    row.innerHTML = `
      <td>${displayDate}</td>
      <td>${classification.halves}</td>
      <td>${classification.thirds}</td>
      <td>${classification.fourths}</td>
    `;

    breakdownTable.append(row);
  });
}

function renderBreakdownCards(selectedIndex) {
  breakdownCards.innerHTML = "";

  possibleDates.forEach((date, idx) => {
    const card = document.createElement("article");
    card.className = "card-item";
    if (idx === selectedIndex) {
      card.classList.add("highlight");
    }

    const classification = classifyByIndex(idx);
    const displayDate = `${formatMonthDay(date.month, date.day)}`;

    card.innerHTML = `
      <h3 class="card-title">${displayDate}</h3>
      <div class="card-meta">Two Buckets: ${classification.halves}</div>
      <div class="card-meta">Three Buckets: ${classification.thirds}</div>
      <div class="card-meta">Four Buckets: ${classification.fourths}</div>
    `;

    breakdownCards.append(card);
  });
}

function formatMonthDay(monthIndex, day) {
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
  return `${monthNames[monthIndex]} ${day}`;
}

function updateYearControls(year) {
  yearInput.value = String(year);
}

function setYear(year) {
  updateYearControls(year);
  const mardi = mardiGrasDate(year);
  const index = findDateIndex(mardi);
  const classification = classifyByIndex(index);

  mardiDate.textContent = formatDate(mardi);
  mardiWeekday.textContent = formatWeekday(mardi);
  halvesResult.textContent = classification.halves;
  thirdsResult.textContent = classification.thirds;
  fourthsResult.textContent = classification.fourths;

  updateTimelineMarker(index, mardi);
  renderBreakdownTable(index);
  renderBreakdownCards(index);
}

function updateTimelineMarker(index, date) {
  if (!timelineMarker || !timelineMarkerLabel || index < 0) {
    return;
  }

  const percent = (index / (possibleDates.length - 1)) * 100;
  timelineMarker.style.left = `${percent}%`;
  timelineMarkerLabel.textContent = formatDate(date);
}

function init() {
  const today = new Date();
  const todayUtc = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  );
  const thisYear = todayUtc.getUTCFullYear();
  const thisMardi = mardiGrasDate(thisYear);

  const defaultYear = todayUtc > thisMardi ? thisYear + 1 : thisYear;

  updateYearControls(defaultYear);
  setYear(defaultYear);

  yearDown.addEventListener("click", () => {
    setYear(Number(yearInput.value) - 1);
  });

  yearUp.addEventListener("click", () => {
    setYear(Number(yearInput.value) + 1);
  });

  yearInput.addEventListener("change", (event) => {
    const value = Number(event.target.value);
    if (!Number.isNaN(value)) {
      setYear(value);
    }
  });

  const updateCompact = () => {
    const panel = document.querySelector(".year-panel");
    if (!panel) return;
    const shouldCompact = window.matchMedia("(max-width: 720px)").matches && window.scrollY > 140;
    panel.classList.toggle("compact", shouldCompact);
  };

  updateCompact();
  window.addEventListener("scroll", updateCompact, { passive: true });
  window.addEventListener("resize", updateCompact);
}

init();
