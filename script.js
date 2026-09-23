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
const kingCakeDaysEl = document.getElementById("kingCakeDays");
const kingCakeEndEl = document.getElementById("kingCakeEnd");

function renderBreakdownTable(selectedIndex) {
  breakdownTable.innerHTML = "";

  possibleDates.forEach((date, idx) => {
    const row = document.createElement("tr");
    if (idx === selectedIndex) {
      row.classList.add("highlight");
    }

    const classification = classifyByIndex(idx);
    const displayDate = `${formatMonthDay(date.month, date.day)}`;

    const cakeDays = kingCakeDaysForDate(date.month, date.day);

    row.innerHTML = `
      <td>${displayDate}</td>
      <td>${cakeDays}</td>
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

    const cakeDays = kingCakeDaysForDate(date.month, date.day);

    card.innerHTML = `
      <h3 class="card-title">${displayDate}</h3>
      <div class="card-meta">King Cake Days: ${cakeDays}</div>
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

function setYear(year, updateUrl = false) {
  if (!validYear(year)) {
    yearInput.value = yearInput.dataset.selectedYear;
    return;
  }
  yearInput.dataset.selectedYear = String(year);
  updateYearControls(year);
  const answer = yearAnswer(year);
  document.title = answer;
  document.getElementById("yearAnswer").textContent = answer;
  document.querySelector('meta[name="description"]').content = yearDescription(year);
  if (updateUrl) {
    const url = STATIC_YEARS.includes(year) ? `/${year}` : `/?year=${year}`;
    if (url !== window.location.pathname + window.location.search) {
      window.history.pushState({}, "", url);
    }
  }
  const queryYear = new URLSearchParams(window.location.search).get("year");
  const canonical = window.location.pathname === "/" && !validYear(queryYear)
    ? "https://ismardigrasearly.com/"
    : STATIC_YEARS.includes(year)
      ? `https://ismardigrasearly.com/${year}`
      : "https://ismardigrasearly.com/";
  document.querySelector('link[rel="canonical"]').href = canonical;
  document.querySelector('meta[property="og:url"]').content = canonical;
  for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) {
    document.querySelector(selector).content = answer;
  }
  for (const selector of ['meta[property="og:description"]', 'meta[name="twitter:description"]']) {
    document.querySelector(selector).content = yearDescription(year);
  }
  const mardi = mardiGrasDate(year);
  const index = findDateIndex(mardi);
  const classification = classifyByIndex(index);

  mardiDate.textContent = formatDate(mardi);
  mardiWeekday.textContent = formatWeekday(mardi);
  halvesResult.textContent = classification.halves;
  thirdsResult.textContent = classification.thirds;
  fourthsResult.textContent = classification.fourths;

  const cakeDays = kingCakeDays(mardi);
  kingCakeDaysEl.textContent = cakeDays;
  kingCakeEndEl.textContent = formatDate(mardi);

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

  const readYear = () => {
    const pathYear = window.location.pathname.match(/^\/(\d{4})(?:\.html|\/)?$/)?.[1];
    const queryYear = new URLSearchParams(window.location.search).get("year");
    // A year path is authoritative even if a conflicting query is appended.
    return validYear(pathYear) ? Number(pathYear)
      : validYear(queryYear) ? Number(queryYear) : defaultYear;
  };
  const selectedYear = readYear();
  if (validYear(new URLSearchParams(window.location.search).get("year")) && STATIC_YEARS.includes(selectedYear)) {
    window.history.replaceState({}, "", `/${selectedYear}${window.location.hash}`);
  }
  setYear(selectedYear);
  window.addEventListener("popstate", () => setYear(readYear()));

  yearDown.addEventListener("click", () => {
    setYear(Number(yearInput.value) - 1, true);
  });

  yearUp.addEventListener("click", () => {
    setYear(Number(yearInput.value) + 1, true);
  });

  yearInput.addEventListener("change", (event) => {
    const value = Number(event.target.value);
    setYear(value, true);
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
