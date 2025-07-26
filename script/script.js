function generateCards() {
  const container = document.getElementById("card-container");
  container.innerHTML = "";

  const network = "سكاي نت";
  const duration = document.getElementById("duration").value;
  const info = document.getElementById("info").value;
  const background = document.getElementById("bg-select").value;
  const prefix = document.getElementById("prefix").value;
  const pages = parseInt(document.getElementById("pages").value);
  const comment = document.getElementById("comment").value;
  const profile = document.getElementById("profile").value;
  const limit = document.getElementById("limit").value;
  const server = document.getElementById("server").value;

  let scriptText = "";
  window.generatedUsers = [];

  function generateCode() {
    const rand = Math.floor(100000 + Math.random() * 900000);
    return prefix + rand;
  }

  for (let p = 0; p < pages; p++) {
    const page = document.createElement("div");
    page.className = "page";

    for (let i = 0; i < 56; i++) {
      const code = generateCode();
      window.generatedUsers.push(code);
      const card = document.createElement("div");
      card.className = "card-wrapper";
      card.innerHTML = `
        <div class="card" style="background-image: url('img/${background}')">
          <div class="duration">${duration}</div>
          <div class="network-name">${network}</div>
          <div class="code">${code}</div>
          <div class="info">${info}</div>
          <div class="username-label">الرمز  :  </div>
        </div>
      `;
      page.appendChild(card);
    }
    container.appendChild(page);
  }
}

function downloadPDF() {
  const element = document.getElementById("card-container");
  const opt = {
    margin: 0,
    filename: 'skynet_cards.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };
  html2pdf().set(opt).from(element).save();
}

function copyScriptToClipboard() {
  if (!window.generatedUsers || window.generatedUsers.length === 0) {
    alert("لم يتم توليد الكروت بعد");
    return;
  }

  const usersList = window.generatedUsers.map(u => `"${u}"`).join(";");
  const profile = document.getElementById("profile").value;
  const limit = document.getElementById("limit").value;
  const server = document.getElementById("server").value;
  const comment = document.getElementById("comment").value;

  const scriptText = `:foreach user in={${usersList}} do={ /ip hotspot user add name=$user password="" profile=${profile} ${limit} server=${server} comment="${comment}" }`;
  navigator.clipboard.writeText(scriptText)
    .then(() => alert("✅ تم نسخ السكربت"))
    .catch(err => alert("❌ فشل النسخ: " + err));
}

function downloadText() {
  if (!window.generatedUsers || window.generatedUsers.length === 0) {
    alert("لم يتم توليد الكروت بعد");
    return;
  }

  const profile = document.getElementById("profile").value;
  const limit = document.getElementById("limit").value;
  const server = document.getElementById("server").value;
  const comment = document.getElementById("comment").value;

  let scriptText = "";
  const chunkSize = 56;

  for (let i = 0; i < window.generatedUsers.length; i += chunkSize) {
    const chunk = window.generatedUsers.slice(i, i + chunkSize);
    const usersList = chunk.map(u => `"${u}"`).join(";");
    scriptText += `:foreach user in={${usersList}} do={ /ip hotspot user add name=$user password="" profile=${profile} ${limit} server=${server} comment="${comment}" }\n\n`;
  }

  const blob = new Blob([scriptText], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "mikrotik_script.txt";
  a.click();
}

// ميزة التعديل التلقائي حسب الباقة
document.addEventListener("DOMContentLoaded", () => {
  const infoSelect = document.getElementById("info");
  if (infoSelect) {
    infoSelect.addEventListener("change", function () {
      const value = this.value;
      if (value.includes("٣٠٠٠") || value.includes("3000")) {
        document.getElementById("duration").value = "30 يوم";
        document.getElementById("comment").value = "3000";
        document.getElementById("limit").value = "limit-bytes-total=9659M limit-uptime=30d";
        document.getElementById("size-select").value = "٩ جيجا / 30 يوم";
      } else if (value.includes("٥٠٠") || value.includes("500")) {
        document.getElementById("duration").value = "7 يوم";
        document.getElementById("comment").value = "500";
        document.getElementById("limit").value = "limit-bytes-total=1074M limit-uptime=7d";
        document.getElementById("size-select").value = "١ جيجا / 7 يوم";
      } else if (value.includes("١٠٠٠") || value.includes("1000")) {
        document.getElementById("duration").value = "15 يوم";
        document.getElementById("comment").value = "1000";
        document.getElementById("limit").value = "limit-bytes-total=2148M limit-uptime=15d";
        document.getElementById("size-select").value = "٢ جيجا / 15 يوم";
      } else if (value.includes("١٦٠٠") || value.includes("1600")) {
        document.getElementById("duration").value = "20 يوم";
        document.getElementById("comment").value = "1600";
        document.getElementById("limit").value = "limit-bytes-total=3072M limit-uptime=20d";
        document.getElementById("size-select").value = "٣ جيجا / 20 يوم";
      } else if (value.includes("٢٠٠٠") || value.includes("2000")) {
        document.getElementById("duration").value = "25 يوم";
        document.getElementById("comment").value = "2000";
        document.getElementById("limit").value = "limit-bytes-total=5000M limit-uptime=25d";
        document.getElementById("size-select").value = "٥ جيجا / 25 يوم";
      }
    });
  }
}
);
