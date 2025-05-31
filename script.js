function saveSleep() {
  const bedTime = document.getElementById("bedTime").value;
  const wakeTime = document.getElementById("wakeTime").value;

  if (!bedTime || !wakeTime) {
    alert("Vul beide tijden in.");
    return;
  }

  const date = new Date().toLocaleDateString();
  const sleepData = JSON.parse(localStorage.getItem("sleepData")) || [];

  sleepData.push({ bedTime, wakeTime, date });
  localStorage.setItem("sleepData", JSON.stringify(sleepData));

  renderSleepData();
}

function calculateSleepHours(start, end) {
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);

  const startDate = new Date();
  startDate.setHours(startH, startM);

  const endDate = new Date();
  endDate.setHours(endH, endM);

  if (endDate <= startDate) {
    endDate.setDate(endDate.getDate() + 1);
  }

  const diffMs = endDate - startDate;
  return diffMs / (1000 * 60 * 60); 
}

function renderSleepData() {
  const sleepLog = document.getElementById("sleepLog");
  sleepLog.innerHTML = "";

  const sleepData = JSON.parse(localStorage.getItem("sleepData")) || [];

  if (sleepData.length === 0) {
    sleepLog.innerHTML = "<p>Geen slaapgegevens gevonden.</p>";
    return;
  }

  sleepData.forEach(entry => {
    const hours = calculateSleepHours(entry.bedTime, entry.wakeTime);
    const emoji = hours >= 8 ? "😄" : "😴";
    const message = hours >= 8 ? "Goed geslapen!" : "Je hebt wat meer slaap nodig";

    const div = document.createElement("div");
    div.innerHTML = `
      <p><strong>${entry.date}</strong></p>
      <p>Van ${entry.bedTime} tot ${entry.wakeTime}</p>
      <p>${hours.toFixed(1)} uur slaap ${emoji}</p>
      <p><em>${message}</em></p>
      <hr />
    `;
    sleepLog.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", renderSleepData);
