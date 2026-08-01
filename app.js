const BRANDS = [
  { id: "apple", name: "Apple", color: "#A2AAAD", meta: "App Store & iTunes", amounts: [15,25,50,100,250] },
  { id: "roblox", name: "Roblox", color: "#E2231A", meta: "Robux", amounts: [10,25,50,100] },
  { id: "netflix", name: "Netflix", color: "#E50914", meta: "Abonnement", amounts: [15,30,50,100] },
  { id: "spotify", name: "Spotify", color: "#1DB954", meta: "Premium", amounts: [10,30,60] },
  { id: "steam", name: "Steam", color: "#1b2838", meta: "Wallet", amounts: [20,50,100] },
  { id: "amazon", name: "Amazon", color: "#FF9900", meta: "FR / EU", amounts: [25,50,100,200] },
  { id: "google", name: "Google Play", color: "#34A853", meta: "Play Store", amounts: [10,25,50,100] },
  { id: "psn", name: "PlayStation", color: "#003087", meta: "PSN", amounts: [20,50,100] },
  { id: "xbox", name: "Xbox", color: "#107C10", meta: "Microsoft", amounts: [25,50,100] },
  { id: "fortnite", name: "Fortnite", color: "#9D4DBB", meta: "V-Bucks", amounts: [10,25,50] },
  { id: "nintendo", name: "Nintendo", color: "#E60012", meta: "eShop", amounts: [15,25,50] },
  { id: "disney", name: "Disney+", color: "#113CCF", meta: "Streaming", amounts: [20,50,100] },
];

const brandsEl = document.getElementById("brands");
const stepBrand = document.getElementById("step-brand");
const stepAmount = document.getElementById("step-amount");
const stepResult = document.getElementById("step-result");
const selectedBrandName = document.getElementById("selected-brand-name");
const amountsEl = document.getElementById("amounts");
const codesPreview = document.getElementById("codes-preview");
const countdownEl = document.getElementById("countdown");
const progressBar = document.getElementById("progress-bar");
const stockCount = document.getElementById("stock-count");

let selected = null;
const TOTAL = 3600;
let left = Number(localStorage.getItem("rh_left") || TOTAL);

function logoHtml(b) {
  const initials = b.name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
  return `<div class="brand-logo" style="background:${b.color}">${initials}</div>`;
}

function renderBrands() {
  brandsEl.innerHTML = BRANDS.map(b => `
    <div class="brand" data-id="${b.id}">
      ${logoHtml(b)}
      <div class="brand-name">${b.name}</div>
      <div class="brand-meta">${b.meta}</div>
    </div>
  `).join("");
  brandsEl.querySelectorAll(".brand").forEach(el => {
    el.onclick = () => {
      selected = BRANDS.find(x => x.id === el.dataset.id);
      selectedBrandName.textContent = selected.name;
      renderAmounts();
      stepBrand.classList.add("hidden");
      stepAmount.classList.remove("hidden");
      stepResult.classList.add("hidden");
    };
  });
}

function renderAmounts() {
  amountsEl.innerHTML = selected.amounts.map(a => `
    <div class="amount" data-v="${a}">${a} €</div>
  `).join("");
  amountsEl.querySelectorAll(".amount").forEach(el => {
    el.onclick = () => {
      showResult(Number(el.dataset.v));
    };
  });
}

function randomCode(brand) {
  const block = () => Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,4);
  if (brand === "apple" || brand === "roblox") return `${block()}${block()}${block()}${block()}`;
  return `${block()}-${block()}-${block()}-${block()}`;
}

function showResult(amount) {
  stepAmount.classList.add("hidden");
  stepResult.classList.remove("hidden");
  const n = 5 + Math.floor(Math.random()*4);
  stockCount.textContent = n;
  const rows = [];
  for (let i=0;i<n;i++){
    const locked = i > 1;
    rows.push(`
      <div class="code-row">
        <span class="${locked ? "blur" : ""}">${randomCode(selected.id)}</span>
        <span class="badge-ok">${locked ? "LOCK" : amount + " € • OK"}</span>
      </div>
    `);
  }
  codesPreview.innerHTML = rows.join("");
}

function tick() {
  left -= 1;
  if (left < 0) {
    left = TOTAL;
    // fake restock flash
    if (!stepResult.classList.contains("hidden") && selected) {
      showResult(selected.amounts[0]);
    }
  }
  localStorage.setItem("rh_left", String(left));
  const m = String(Math.floor(left/60)).padStart(2,"0");
  const s = String(left%60).padStart(2,"0");
  countdownEl.textContent = `${m}:${s}`;
  progressBar.style.width = `${((TOTAL-left)/TOTAL)*100}%`;
}

document.getElementById("back-brand").onclick = () => {
  stepAmount.classList.add("hidden");
  stepBrand.classList.remove("hidden");
};
document.getElementById("back-amount").onclick = () => {
  stepResult.classList.add("hidden");
  stepAmount.classList.remove("hidden");
};

renderBrands();
setInterval(tick, 1000);
tick();
