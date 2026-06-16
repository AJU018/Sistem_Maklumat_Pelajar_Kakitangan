const API_URL = "https://jsonplaceholder.typicode.com/users";

let penggunaTempatan =
  JSON.parse(localStorage.getItem("penggunaTempatan")) || [];

/* DAFTAR */
const daftarForm = document.getElementById("daftarForm");

if (daftarForm) {
  daftarForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nama = document.getElementById("nama").value.trim();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const mesej = document.getElementById("mesej");

    if (nama === "" || username === "" || email === "") {
      mesej.textContent = "Sila isi semua maklumat.";
      mesej.className = "error";
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: nama,
          username: username,
          email: email
        })
      });

      if (!response.ok) {
        throw new Error("Gagal menghantar data ke API.");
      }

      const data = await response.json();

      const penggunaBaru = {
        id: data.id,
        name: nama,
        username: username,
        email: email,
        phone: "-",
        address: {
          street: "-",
          city: "-"
        }
      };

      penggunaTempatan.push(penggunaBaru);
      localStorage.setItem("penggunaTempatan", JSON.stringify(penggunaTempatan));

      mesej.className = "success";
      mesej.innerHTML = `
        <h3>Pendaftaran Berjaya!</h3>
        <p>Data berjaya dihantar ke API dan disimpan sementara.</p>

        <div class="card">
          <h3>${penggunaBaru.name}</h3>
          <p><strong>ID:</strong> ${penggunaBaru.id}</p>
          <p><strong>Username:</strong> ${penggunaBaru.username}</p>
          <p><strong>Email:</strong> ${penggunaBaru.email}</p>
        </div>
      `;

      daftarForm.reset();

    } catch (error) {
      mesej.textContent = "Ralat: " + error.message;
      mesej.className = "error";
    }
  });
}

/* LOGIN */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("loginUsername").value.trim();
    const email = document.getElementById("loginEmail").value.trim();
    const loginMesej = document.getElementById("loginMesej");

    if (username === "" || email === "") {
      loginMesej.textContent = "Sila isi username dan email.";
      loginMesej.className = "error";
      return;
    }

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Gagal mendapatkan data API.");
      }

      const dataAPI = await response.json();
      const semuaData = [...dataAPI, ...penggunaTempatan];

      const userMatch = semuaData.find(user =>
        user.username.toLowerCase() === username.toLowerCase() &&
        user.email.toLowerCase() === email.toLowerCase()
      );

      if (userMatch) {
        loginMesej.textContent = "Log masuk berjaya. Selamat datang " + userMatch.name;
        loginMesej.className = "success";
      } else {
        loginMesej.textContent = "Username atau email tidak sepadan.";
        loginMesej.className = "error";
      }

    } catch (error) {
      loginMesej.textContent = "Ralat: " + error.message;
      loginMesej.className = "error";
    }
  });
}

/* CARIAN */
async function dapatkanData() {
  const status = document.getElementById("status");
  const senarai = document.getElementById("senaraiPelajar");

  status.textContent = "Sedang mendapatkan data...";
  status.className = "";
  senarai.innerHTML = "";

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Gagal mendapatkan data daripada API.");
    }

    const dataAPI = await response.json();
    const semuaData = [...dataAPI, ...penggunaTempatan];

    semuaData.forEach(user => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <h3>${user.name}</h3>
        <p><strong>Username:</strong> ${user.username}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Telefon:</strong> ${user.phone || "-"}</p>
        <p><strong>Alamat:</strong> ${user.address?.street || "-"}, ${user.address?.city || "-"}</p>
      `;

      senarai.appendChild(card);
    });

    status.textContent = "Data berjaya dipaparkan.";
    status.className = "success";

  } catch (error) {
    status.textContent = "Ralat: " + error.message;
    status.className = "error";
  }
}