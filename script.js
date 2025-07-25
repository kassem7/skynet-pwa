document.addEventListener('DOMContentLoaded', function () {
  const infoSelect = document.getElementById('info');
  const limitSelect = document.getElementById('limit');
  const commentSelect = document.getElementById('comment');

  const mappings = {
    '٥٠٠ ريال -- الحجم: ١ جيجا': {
      limit: 'limit-bytes-total=1024M limit-uptime=7d',
      comment: '500'
    },
    '١٠٠٠ ريال -- الحجم: ٢ جيجا': {
      limit: 'limit-bytes-total=2143M limit-uptime=15d',
      comment: '1000'
    },
    '١٥٠٠ ريال -- الحجم: ٣ جيجا': {
      limit: 'limit-bytes-total=3072M limit-uptime=15d',
      comment: '1500'
    },
    '٢٠٠٠ ريال -- الحجم: ٥ جيجا': {
      limit: 'limit-bytes-total=5000M limit-uptime=30d',
      comment: '2000'
    },
    '٣٠٠٠ ريال -- الحجم: ٩ جيجا': {
      limit: 'limit-bytes-total=9659M limit-uptime=30d',
      comment: '3000'
    }
  };

  infoSelect.addEventListener('change', function () {
    const selected = infoSelect.value;
    if (mappings[selected]) {
      limitSelect.value = mappings[selected].limit;
      commentSelect.value = mappings[selected].comment;

      const durationSelect = document.getElementById('duration');
      if (mappings[selected].limit.includes('7d')) {
        durationSelect.value = '7 يوم';
      } else if (mappings[selected].limit.includes('15d')) {
        durationSelect.value = '15 يوم';
      } else if (mappings[selected].limit.includes('30d')) {
        durationSelect.value = '30 يوم';
      }
    }
  });
});

let generatedCodes = new Set();

function generateUniqueCode(prefix) {
  let code;
  do {
    code = prefix + Math.floor(100000 + Math.random() * 899999);
  } while (generatedCodes.has(code));
  generatedCodes.add(code);
  return code;
}

function generateCards() {
  const container = document.getElementById("card-container");
  container.innerHTML = "";
  generatedCodes.clear();

  const background = document.getElementById("bg-select").value;
  const network = document.getElementById("network-name").value;
  const duration = document.getElementById("duration").value;
  const info = document.getElementById("info").value;
  const prefix = document.getElementById("prefix").value || "w";
  const pages = parseInt(document.getElementById("pages").value);
  const cardsPerPage = 9 * 4;

  for (let p = 0; p < pages; p++) {
    const page = document.createElement("div");
    page.className = "page";
    for (let i = 0; i < cardsPerPage; i++) {
      const code = generateUniqueCode(prefix);
      const card = document.createElement("div");
      card.className = "card-wrapper";
      card.innerHTML = `
        <div class="card" style="background-image: url(${background})">
          <div class="duration">${duration}</div>
          <div class="network">${network}</div>
          <div class="code">${code}</div>
          <div class="info">${info}</div>
        </div>
      `;
      page.appendChild(card);
    }
    container.appendChild(page);
  }

  alert(`✅ تم توليد ${generatedCodes.size} كرت في ${pages} صفحة`);
}

function downloadPDF() {
  const element = document.getElementById("card-container");
  const opt = {
    margin: 0,
    filename: 'كروت_سكاي_نت_A4.pdf',
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save();
}

function downloadText() {
  const cards = document.querySelectorAll('.card');
  let codes = [];

  cards.forEach(card => {
    const code = card.querySelector('.code')?.textContent.trim();
    if (code) codes.push(`"${code}"`);
  });

  if (codes.length === 0) {
    alert("لم يتم العثور على رموز.");
    return;
  }

  const comment = document.getElementById("comment").value || "";
  const profile = document.getElementById("profile").value || "default";
  const limit = document.getElementById("limit").value || "";
  const server = document.getElementById("server").value || "sky.net";

  const script = `:foreach user in={${codes.join(";")}} do={
  /ip hotspot user add name=$user password="" profile=${profile} ${limit} server=${server} comment="${comment}"
}`;

  const blob = new Blob([script], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'mikrotik_script.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function copyScriptToClipboard() {
  const cards = document.querySelectorAll('.card');
  let codes = [];
  cards.forEach(card => {
    const code = card.querySelector('.code')?.textContent.trim();
    if (code) codes.push(`"${code}"`);
  });
  if (codes.length === 0) {
    alert("لم يتم العثور على رموز.");
    return;
  }
  const comment = document.getElementById("comment").value || "";
  const profile = document.getElementById("profile").value || "default";
  const limit = document.getElementById("limit").value || "";
  const server = document.getElementById("server").value || "sky.net";
  const script = `:foreach user in={${codes.join(";")}} do={
  /ip hotspot user add name=$user password="" profile=${profile} ${limit} server=${server} comment="${comment}"
}`;
  navigator.clipboard.writeText(script).then(() => {
    alert("✅ تم نسخ السكربت إلى الحافظة");
  }, () => {
    alert("❌ لم يتم النسخ. جرّب من متصفح آخر");
  });
}

