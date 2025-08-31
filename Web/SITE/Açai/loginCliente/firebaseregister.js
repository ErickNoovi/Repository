  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
  import { getDatabase, ref, get, child, set } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

  const firebaseConfig = {
    databaseURL: "https://pagina-acai-default-rtdb.europe-west1.firebasedatabase.app/"
  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  const btnRegister = document.getElementById("btnregisterid");
  const inputUser = document.getElementById("userinputregisterid");
  const inputPassword = document.getElementById("passwordinputregisterid");
  const inputConfirm = document.getElementById("confirmpasswordinputregisterid");
  const spanMensagem = document.getElementById("textocupancy");

  btnRegister.addEventListener("click", async () => {
    const usuario = inputUser.value.trim();
    const senha = inputPassword.value.trim();
    const confirmar = inputConfirm.value.trim();

    if (!usuario || !senha || !confirmar) {
      spanMensagem.textContent = "Preencha todos os campos!";
      spanMensagem.style.color = '#eb2d2d' 
      return;
    }

    if (senha !== confirmar) {
      spanMensagem.textContent = "As senhas não coincidem!";
      spanMensagem.style.color = '#eb2d2d' 
      return;
    }

    try {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, "clientes"));

      let usuarioJaExiste = false;
      let novoNumero = 1;

      if (snapshot.exists()) {
        const clientes = snapshot.val();

        // Verifica se o nome de usuário já existe
        for (let key in clientes) {
          if (clientes[key].usuario.toLowerCase() === usuario.toLowerCase()) {
            usuarioJaExiste = true;
            break;
          }
        }

        if (usuarioJaExiste) {
          spanMensagem.textContent = "Nome de usuário já existe!";
          spanMensagem.style.color = '#eb2d2d'
          return;
        }

        // Se não existir, calcula o próximo cliente
        const numerosExistentes = Object.keys(clientes)
          .map(key => parseInt(key.replace("cliente", "")))
          .filter(n => !isNaN(n));
        if (numerosExistentes.length > 0) {
          novoNumero = Math.max(...numerosExistentes) + 1;
        }
      }

      const novoClienteNome = "cliente" + novoNumero;
      const novoClienteRef = ref(db, "clientes/" + novoClienteNome);

      await set(novoClienteRef, {
        usuario: usuario,
        senha: senha
      });

      spanMensagem.textContent = "Registrado com sucesso";
      spanMensagem.style.color = '#85ea59' 
      inputUser.value = "";
      inputPassword.value = "";
      inputConfirm.value = "";
    } catch (error) {
      console.error("Erro ao registrar:", error);
      spanMensagem.textContent = "Erro ao registrar. Tente novamente.";
    }
  });