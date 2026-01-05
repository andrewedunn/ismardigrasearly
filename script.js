const MS_DAY = 24 * 60 * 60 * 1000;

const yearInput = document.getElementById("yearInput");
const yearDown = document.getElementById("yearDown");
const yearUp = document.getElementById("yearUp");
const mardiDate = document.getElementById("mardiDate");
const mardiWeekday = document.getElementById("mardiWeekday");
const halvesResult = document.getElementById("halvesResult");
const thirdsResult = document.getElementById("thirdsResult");
const fourthsResult = document.getElementById("fourthsResult");
const moodResult = document.getElementById("moodResult");
const breakdownTable = document.querySelector("#breakdownTable tbody");
const breakdownCards = document.getElementById("breakdownCards");
const nextTable = document.querySelector("#nextTable tbody");
const nextCards = document.getElementById("nextCards");
const summaryGrid = document.getElementById("summaryGrid");

const moodLabels = [
  "Blink and you'll miss it",
  "Plenty of time",
  "Endless Carnival",
  "Are we still doing this?",
];

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
    thirds = "Mid";
  }

  let fourths = "Very Late";
  let mood = moodLabels[3];
  if (number <= 9) {
    fourths = "Very Early";
    mood = moodLabels[0];
  } else if (number <= 18) {
    fourths = "Early";
    mood = moodLabels[1];
  } else if (number <= 27) {
    fourths = "Late";
    mood = moodLabels[2];
  }

  return { halves, thirds, fourths, mood };
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
      <td>${classification.mood}</td>
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
      <div class="card-meta">Halves: ${classification.halves}</div>
      <div class="card-meta">Thirds: ${classification.thirds}</div>
      <div class="card-meta">Fourths: ${classification.fourths}</div>
      <div class="card-meta">Mood: ${classification.mood}</div>
    `;

    breakdownCards.append(card);
  });
}

function buildNextData(currentYear) {
  const summaryCounts = {
    [moodLabels[0]]: 0,
    [moodLabels[1]]: 0,
    [moodLabels[2]]: 0,
    [moodLabels[3]]: 0,
  };
  const items = [];

  for (let offset = 0; offset < 50; offset += 1) {
    const year = currentYear + offset;
    const mardi = mardiGrasDate(year);
    const index = findDateIndex(mardi);
    const classification = classifyByIndex(index);

    summaryCounts[classification.mood] += 1;
    items.push({ year, mardi, classification });
  }

  return { items, summaryCounts };
}

function renderNextTable(items, selectedYear) {
  nextTable.innerHTML = "";

  items.forEach((item) => {
    const row = document.createElement("tr");
    row.dataset.year = String(item.year);
    if (item.year === selectedYear) {
      row.classList.add("highlight");
    }

    row.innerHTML = `
      <td>${item.year}</td>
      <td>${formatDate(item.mardi)}</td>
      <td>${item.classification.fourths}</td>
      <td>${item.classification.mood}</td>
    `;

    row.addEventListener("click", () => setYear(item.year));
    nextTable.append(row);
  });
}

function renderNextCards(items, selectedYear) {
  nextCards.innerHTML = "";

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card-item";
    card.dataset.year = String(item.year);
    if (item.year === selectedYear) {
      card.classList.add("highlight");
    }

    card.innerHTML = `
      <h3 class="card-title">${item.year} · ${formatDate(item.mardi)}</h3>
      <div class="card-meta">Fourths: ${item.classification.fourths}</div>
      <div class="card-meta">Mood: ${item.classification.mood}</div>
    `;

    card.addEventListener("click", () => setYear(item.year));
    nextCards.append(card);
  });
}

function renderSummary(counts) {
  summaryGrid.innerHTML = "";
  const total = Object.values(counts).reduce((sum, value) => sum + value, 0);

  moodLabels.forEach((mood) => {
    const card = document.createElement("div");
    card.className = "summary-card";

    const count = counts[mood];
    const percent = total ? Math.round((count / total) * 100) : 0;

    card.innerHTML = `
      <strong>${mood}</strong>
      <div>${count} of ${total} years</div>
      <div class="bar" style="width: ${percent}%;"></div>
    `;

    summaryGrid.append(card);
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
  moodResult.textContent = classification.mood;

  renderBreakdownTable(index);
  renderBreakdownCards(index);
  const nextData = buildNextData(new Date().getUTCFullYear());
  renderNextTable(nextData.items, year);
  renderNextCards(nextData.items, year);
  renderSummary(nextData.summaryCounts);
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
