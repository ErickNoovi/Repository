  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
  import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

  // Firebase config (mesmo da parte de registro)
  const firebaseConfig = {
    databaseURL: "https://pagina-acai-default-rtdb.europe-west1.firebasedatabase.app/"
  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  // Elementos do DOM
  const btnLogin = document.getElementById("btnloginid");
  const inputUserLogin = document.getElementById("userinputloginid");
  const inputPassLogin = document.getElementById("passwordinputloginid");
  const spanLogin = document.getElementById("textocupancylogin");

  btnLogin.addEventListener("click", async () => {
    const usuario = inputUserLogin.value.trim();
    const senha = inputPassLogin.value.trim();

    if (!usuario || !senha) {
      spanLogin.textContent = "Preencha todos os campos!";
      spanLogin.style.color = '#eb2d2d'
      return;
    }

    try {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, "clientes"));

      let loginValido = false;

      if (snapshot.exists()) {
        const clientes = snapshot.val();

        for (let key in clientes) {
          if (
            clientes[key].usuario.toLowerCase() === usuario.toLowerCase() &&
            clientes[key].senha === senha
          ) {
            loginValido = true;
            break;
          }
        }
      }

      if (loginValido) {
        spanLogin.textContent = "Login com sucesso!";
        spanLogin.style.color = '#85ea59'
        localStorage.setItem("clienteLogado", usuario)
        // Redireciona para outra página após 1 segundo
        setTimeout(() => {
          window.location.href = "/../html/home.html"; // Altere para o destino desejado
        }, 1000);
      } else {
        spanLogin.textContent = "Credenciais incorretas.";
        spanLogin.style.color = '#eb2d2d'
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      spanLogin.textContent = "Erro ao acessar dados. Tente novamente.";
      spanLogin.style.color = 'orange'
    }
  });