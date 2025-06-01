function saveSleep() {
  const bedTime = document.getElementById("bedTime");
  const wakeTime = document.getElementById("wakeTime");

  if (!bedTime.value || !wakeTime.value) {
    alert("Vul beide tijden in.");
    return;
  }

  const date = new Date().toLocaleDateString();
  const sleepData = JSON.parse(localStorage.getItem("sleepData")) || [];

  sleepData.push({ bedTime: bedTime.value, wakeTime: wakeTime.value, date });
  localStorage.setItem("sleepData", JSON.stringify(sleepData));

  bedTime.value = "";
  wakeTime.value = "";
  showMessage("Slaapgegevens opgeslagen!");

  updateDateSelector();
  renderSleepData();
}

function calculateSleepHours(bedTime, wakeTime) {
  const [bedHour, bedMin] = bedTime.split(":").map(Number);
  const [wakeHour, wakeMin] = wakeTime.split(":").map(Number);

  let bed = new Date();
  bed.setHours(bedHour, bedMin, 0);

  let wake = new Date();
  wake.setHours(wakeHour, wakeMin, 0);
  if (wake <= bed) wake.setDate(wake.getDate() + 1);

  const diff = (wake - bed) / (1000 * 60 * 60);
  return Math.round(diff * 10) / 10;
}

function renderSleepData() {
  const sleepLog = document.getElementById("sleepLog");
  const sleepData = JSON.parse(localStorage.getItem("sleepData")) || [];
  const selectedDate = document.getElementById("dateSelector").value;

  sleepLog.innerHTML = "";

  sleepData
    .filter(entry => !selectedDate || entry.date === selectedDate)
    .forEach(entry => {
      const hours = calculateSleepHours(entry.bedTime, entry.wakeTime);
      const emoji = hours >= 8 ? "😄" : "😴";
      sleepLog.innerHTML += `
        <div>
          <strong>${entry.date}</strong><br>
          ${entry.bedTime} - ${entry.wakeTime} = ${hours} uur ${emoji}
          <hr>
        </div>`;
    });
}

function updateDateSelector() {
  const sleepData = JSON.parse(localStorage.getItem("sleepData")) || [];
  const dates = [...new Set(sleepData.map(entry => entry.date))];
  const selector = document.getElementById("dateSelector");
  const currentValue = selector.value;
  selector.innerHTML = '<option value="">-- Alle data --</option>';
  dates.forEach(date => {
    const option = document.createElement("option");
    option.value = date;
    option.textContent = date;
    if (date === currentValue) option.selected = true;
    selector.appendChild(option);
  });
}

function showMessage(text) {
  const msg = document.getElementById("message");
  msg.textContent = text;
  msg.classList.remove("hidden");

  setTimeout(() => {
    msg.classList.add("hidden");
  }, 3000);
}

function setTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);
  document.getElementById("toggleTheme").textContent = theme === "dark" ? "☀️ Lichte modus" : "🌙 Donkere modus";
}

document.getElementById("toggleTheme").addEventListener("click", () => {
  const currentTheme = document.body.classList.contains("dark") ? "light" : "dark";
  setTheme(currentTheme);
});

document.getElementById("resetButton").addEventListener("click", () => {
  const confirmReset = confirm("Weet je zeker dat je alle slaapdata wilt verwijderen?");
  if (confirmReset) {
    localStorage.removeItem("sleepData");
    updateDateSelector();
    renderSleepData();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  setTheme(savedTheme);

  updateDateSelector();
  renderSleepData();

  document.getElementById("bedTime").focus();
});
