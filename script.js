let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 50.0, lng: 20.0 },
    zoom: 4,
  });
}

document.getElementById("vacationForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const budget = parseInt(document.getElementById("budget").value);
  const month = document.getElementById("month").value;
  const type = document.getElementById("type").value;
  const climate = document.getElementById("climate").value;
  const airport = document.getElementById("airport").value;

  let suggestion = "Nie znaleziono dopasowania.";
  let country = null;

  if (budget >= 3000 && type === "pla¿a" && climate === "ciep³o") {
    suggestion = "Polecamy Grecjê.";
    country = { name: "Grecja", lat: 39.0, lng: 22.0 };
  } else if (budget < 2000 && type === "góry" && climate === "umiarkowanie") {
    suggestion = "Spróbuj Tatr w Polsce.";
    country = { name: "Polska", lat: 49.3, lng: 20.0 };
  } else if (budget >= 2500 && type === "zwiedzanie") {
    suggestion = "W³ochy to œwietna opcja.";
    country = { name: "W³ochy", lat: 42.0, lng: 12.0 };
  }

  if (country) {
    const flightPrice = getFakeFlightPrice(airport, country.name);
    suggestion += `\nSzacunkowy koszt lotu z ${airport}: ${flightPrice} PLN.`;
  }

  document.getElementById("result").innerText = suggestion;

  if (country) {
    map.setCenter({ lat: country.lat, lng: country.lng });
    map.setZoom(5);
    new google.maps.Marker({ position: { lat: country.lat, lng: country.lng }, map: map });
    saveToHistory(country.name);
  }
});

function getFakeFlightPrice(airport, country) {
  const basePrices = {
    "Grecja": 900,
    "W³ochy": 700,
    "Polska": 200,
  };
  const multiplier = airport === "WAW" ? 1 : 1.2;
  return basePrices[country] ? basePrices[country] * multiplier : "brak danych";
}

function saveToHistory(countryName) {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.unshift(countryName);
  localStorage.setItem("history", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  const list = document.getElementById("history");
  list.innerHTML = "";
  history.slice(0, 5).forEach(item => {
    const li = document.createElement("li");
    li.innerText = item;
    list.appendChild(li);
  });
}

window.onload = renderHistory;

function downloadPDF() {
  const text = document.getElementById("result").innerText;
  const blob = new Blob([text], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "rekomendacja_wakacyjna.pdf";
  a.click();
}
window.onload = renderHistory;