const dataKonserAwal = [
  {
    id: "hindia",
    nama: "Hindia Live in Jakarta",
    kota: "Jakarta",
    tanggal: "24 Oktober 2026",
    harga: 250000,
    gambar: "assets/images/hindia.jpg",
    deskripsi:
      "Nikmati penampilan Hindia secara langsung bersama lagu-lagu favorit dalam malam penuh energi.",
    lineup: "Hindia",
  },
  {
    id: "forrevenge",
    nama: "for Revenge Live in Bandung",
    kota: "Bandung",
    tanggal: "02 November 2026",
    harga: 175000,
    gambar: "assets/images/forrevenge.jpg",
    deskripsi:
      "Saksikan for Revenge membawakan lagu-lagu terbaik mereka dalam suasana konser yang intim.",
    lineup: "for Revenge",
  },
  {
    id: "alkateri",
    nama: "Alkateri Live in Yogyakarta",
    kota: "Yogyakarta",
    tanggal: "16 November 2026",
    harga: 150000,
    gambar: "assets/images/alkateri.jpg",
    deskripsi:
      "Nikmati penampilan Alkateri dan suasana musik malam yang seru bersama teman-temanmu.",
    lineup: "Alkateri",
  },
];

function getKonser() {
  const data = localStorage.getItem("dhoneKonser");
  return data ? JSON.parse(data) : dataKonserAwal;
}

function simpanKonser(data) {
  localStorage.setItem("dhoneKonser", JSON.stringify(data));
}
function concertCard(item) {
  return `<article class="card">
    <img class="poster-image" src="${item.gambar}" alt="Konser ${item.nama}" />
    <div class="card-body">
      <h3>${item.nama}</h3>
      <p class="info">📍 ${item.kota}</p>
      <p class="info">🗓 ${item.tanggal}</p>
      <p class="price">Mulai ${formatRupiah(item.harga)}</p>
      <a class="btn" href="detail-konser.html?id=${item.id}">Lihat Detail</a>
    </div>
  </article>`;
}
function showConcerts(id) {
  let target = document.getElementById(id);
  if (target) target.innerHTML = getKonser().map(concertCard).join("");
}
function searchConcert() {
  let key = document.getElementById("search").value.toLowerCase();
  let target = document.getElementById("concert-list");
  let hasil = getKonser().filter((x) =>
    (x.nama + x.kota).toLowerCase().includes(key),
  );
  target.innerHTML = hasil.length
    ? hasil.map(concertCard).join("")
    : '<p class="empty">Konser tidak ditemukan.</p>';
}
function registerForm(e) {
  e.preventDefault();
  localStorage.setItem("dhoneUser", document.getElementById("nama").value);
  alert("Registrasi berhasil. Silakan login.");
  location.href = "login.html";
}
function loginForm(e) {
  e.preventDefault();
  localStorage.setItem("dhoneLogin", "true");
  alert("Login berhasil!");
  location.href = "index.html";
}
function orderTicket(e) {
  e.preventDefault();
  const concertId = new URLSearchParams(location.search).get("id");
  const concert =
    getKonser().find((item) => item.id === concertId) || getKonser()[0];

  const pesanan = {
    kode: "DHN-" + Date.now().toString().slice(-6),
    konser: concert.nama,
    kategori: "Festival",
    harga: concert.harga,
    nama: document.getElementById("nama-pembeli").value,
    email: document.getElementById("email-pembeli").value,
    hp: document.getElementById("hp-pembeli").value,
    jumlah: Number(document.getElementById("jumlah").value),
  };

  localStorage.setItem("dhoneOrder", JSON.stringify(pesanan));
  location.href = "pembayaran.html";
}

function renderConcertDetail() {
  const target = document.getElementById("concert-detail");
  if (!target) return;

  const concertId = new URLSearchParams(location.search).get("id");
  const concert =
    getKonser().find((item) => item.id === concertId) || getKonser()[0];
  document.title = `${concert.nama} - Dhone`;

  target.innerHTML = `
    <div>
      <img class="detail-poster" src="${concert.gambar}" alt="Konser ${concert.nama}" />
      <h1>${concert.nama}</h1>
      <p>${concert.deskripsi}</p>
      <p><b>🗓 ${concert.tanggal} | 19.00 WIB</b></p>
      <p><b>📍 ${concert.kota}</b></p>
      <h3>Penampil</h3>
      <p>${concert.lineup}</p>
    </div>
    <form class="order-box" onsubmit="orderTicket(event)">
      <h2>Pesan Tiket</h2>
      <p>Kategori: <b>Festival</b></p>
      <p class="price">${formatRupiah(concert.harga)} / tiket</p>
      <p class="info">Sisa kuota: 120 tiket</p>
      <hr />
      <h3>Data Pembeli</h3>
      <div class="form-group"><label for="nama-pembeli">Nama Lengkap</label><input id="nama-pembeli" type="text" required placeholder="Masukkan nama lengkap" /></div>
      <div class="form-group"><label for="email-pembeli">Email</label><input id="email-pembeli" type="email" required placeholder="nama@email.com" /></div>
      <div class="form-group"><label for="hp-pembeli">Nomor HP / WhatsApp</label><input id="hp-pembeli" type="tel" required placeholder="Contoh: 081234567890" /></div>
      <div class="form-group"><label for="jumlah">Jumlah tiket</label><input id="jumlah" type="number" min="1" max="5" value="1" required /></div>
      <button class="btn" style="width: 100%" type="submit">Pesan Sekarang</button>
    </form>
  `;
}

function getPesanan() {
  const data = localStorage.getItem("dhoneOrder");
  return data ? JSON.parse(data) : null;
}

function formatRupiah(nominal) {
  return "Rp" + nominal.toLocaleString("id-ID");
}

function renderPaymentSummary() {
  const target = document.getElementById("order-summary");
  const pesanan = getPesanan();
  if (!target || !pesanan) return;

  target.innerHTML = `
    <p><b>${pesanan.konser}</b><br />${pesanan.kategori} — ${pesanan.jumlah} Tiket</p>
    <p>Pembeli: <b>${pesanan.nama}</b><br />${pesanan.email}<br />${pesanan.hp}</p>
    <p>Total pembayaran: <b class="price">${formatRupiah(pesanan.harga * pesanan.jumlah)}</b></p>
  `;
}
function savePayment(e) {
  e.preventDefault();
  localStorage.setItem("dhonePaid", "true");
  document.getElementById("payment-success").style.display = "block";
  e.target.reset();
}

function kirimPermintaanEO(e) {
  e.preventDefault();
  const permintaan = JSON.parse(localStorage.getItem("dhoneEO")) || [];
  permintaan.push({
    nama: document.getElementById("eo-nama").value,
    hp: document.getElementById("eo-hp").value,
    acara: document.getElementById("eo-acara").value,
    tanggal: document.getElementById("eo-tanggal").value,
    status: "Menunggu Tanggapan",
  });
  localStorage.setItem("dhoneEO", JSON.stringify(permintaan));
  alert("Permintaan penawaran berhasil dikirim!");
  e.target.reset();
}

function renderAdmin() {
  const concertTarget = document.getElementById("admin-concert-list");
  if (!concertTarget || localStorage.getItem("dhoneAdminLogin") !== "true")
    return;

  const daftarKonser = getKonser();
  const pesanan = getPesanan();
  const daftarEO = JSON.parse(localStorage.getItem("dhoneEO")) || [];
  document.getElementById("total-konser").textContent = daftarKonser.length;
  document.getElementById("total-pesanan").textContent = pesanan ? 1 : 0;
  document.getElementById("total-eo").textContent = daftarEO.length;
  document.getElementById("total-omzet").textContent = pesanan
    ? formatRupiah(pesanan.harga * pesanan.jumlah)
    : "Rp0";

  concertTarget.innerHTML = daftarKonser
    .map(
      (item) =>
        `<tr><td>${item.nama}</td><td>${item.kota}</td><td>${item.tanggal}</td><td>${formatRupiah(item.harga)}</td><td><button class="btn btn-small btn-danger" onclick="hapusKonser('${item.id}')">Hapus</button></td></tr>`,
    )
    .join("");
  document.getElementById("admin-order-list").innerHTML = pesanan
    ? `<tr><td>${pesanan.kode}</td><td>${pesanan.nama}<br /><small>${pesanan.email}</small></td><td>${pesanan.konser}</td><td>${pesanan.jumlah}</td><td>${localStorage.getItem("dhonePaid") ? "Sudah upload" : "Belum bayar"}</td><td><button class="btn btn-small" onclick="verifikasiPesanan()">Verifikasi</button></td></tr>`
    : '<tr><td colspan="6" class="empty">Belum ada pesanan masuk.</td></tr>';
  document.getElementById("admin-eo-list").innerHTML = daftarEO.length
    ? daftarEO
        .map(
          (item) =>
            `<tr><td>${item.nama}</td><td>${item.acara}</td><td>${item.tanggal}</td><td>${item.hp}</td><td><span class="status">${item.status}</span></td></tr>`,
        )
        .join("")
    : '<tr><td colspan="5" class="empty">Belum ada permintaan EO.</td></tr>';
}

function tambahKonser(e) {
  e.preventDefault();
  const daftarKonser = getKonser();
  daftarKonser.push({
    id: "konser-" + Date.now(),
    nama: document.getElementById("admin-nama-konser").value,
    kota: document.getElementById("admin-kota").value,
    tanggal: document.getElementById("admin-tanggal").value,
    harga: Number(document.getElementById("admin-harga").value),
    gambar:
      document.getElementById("admin-gambar").value ||
      "assets/images/hindia.jpg",
    deskripsi: "Informasi konser terbaru dari Dhone.com.",
    lineup: "Akan diinformasikan",
  });
  simpanKonser(daftarKonser);
  e.target.reset();
  renderAdmin();
  alert("Konser berhasil ditambahkan.");
}

function hapusKonser(id) {
  if (!confirm("Hapus konser ini?")) return;
  simpanKonser(getKonser().filter((item) => item.id !== id));
  renderAdmin();
}

function verifikasiPesanan() {
  if (!getPesanan()) return;
  localStorage.setItem("dhoneVerified", "true");
  alert("Pembayaran pesanan berhasil diverifikasi.");
  renderAdmin();
}

function loginAdmin(e) {
  e.preventDefault();
  const email = document.getElementById("admin-email").value;
  const password = document.getElementById("admin-password").value;
  const error = document.getElementById("admin-login-error");

  if (email === "admin@dhone.com" && password === "admin123") {
    localStorage.setItem("dhoneAdminLogin", "true");
    tampilkanDashboardAdmin();
    return;
  }

  error.textContent = "Email atau kata sandi admin salah.";
}

function tampilkanDashboardAdmin() {
  const loginArea = document.getElementById("admin-login-area");
  const dashboard = document.getElementById("admin-dashboard");
  if (!loginArea || !dashboard) return;
  loginArea.style.display = "none";
  dashboard.style.display = "block";
  renderAdmin();
}

function cekLoginAdmin() {
  if (localStorage.getItem("dhoneAdminLogin") === "true") {
    tampilkanDashboardAdmin();
  }
}

function logoutAdmin() {
  localStorage.removeItem("dhoneAdminLogin");
  location.reload();
}
function renderHistory() {
  let target = document.getElementById("history");
  if (!target) return;
  const pesanan = getPesanan();
  target.innerHTML =
    localStorage.getItem("dhonePaid") && pesanan
      ? `<tr><td>${pesanan.kode}</td><td>${pesanan.konser}</td><td>${pesanan.nama}</td><td>${pesanan.jumlah} Tiket</td><td><span class="status">Menunggu Verifikasi</span></td></tr>`
      : '<tr><td colspan="5" class="empty">Belum ada pesanan. Yuk pilih konser!</td></tr>';
}
document.addEventListener("DOMContentLoaded", () => {
  showConcerts("featured");
  showConcerts("concert-list");
  renderConcertDetail();
  renderPaymentSummary();
  renderHistory();
  cekLoginAdmin();
  renderAdmin();
});
