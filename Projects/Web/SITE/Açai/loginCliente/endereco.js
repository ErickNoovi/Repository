document.addEventListener('DOMContentLoaded', () => {

    const userLogged = localStorage.getItem("clienteLogado")

    if (!userLogged){
        alert('Por favor, faça login para acessar!');
        window.location.href = '../html/home.html'
    }

})

//Botões Voltar e Salvar
const btnVoltar = document.getElementById("btnBackid");
btnVoltar.onclick = () => {
  window.location.href = '../html/home.html'
}

  // Import Firebase
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
  import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

  // Configuração Firebase
  const firebaseConfig = {
    databaseURL: "https://pagina-acai-default-rtdb.europe-west1.firebasedatabase.app/"
  };
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  // Botão de salvar
  document.getElementById('btnSaveid').addEventListener('click', async () => {
    const nome = document.getElementById('nomeinputid').value.trim();
    const telefone = document.getElementById('telefoneinputid').value.trim();
    const endereco = document.getElementById('enderecoinputid').value.trim();
    const bairro = document.getElementById('bairroinputid').value.trim();
    const numero = document.getElementById('numeroinputid').value.trim();

    // Verificação dos campos
    if (!nome || !telefone || !endereco || !bairro || !numero) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const clienteLogado = localStorage.getItem('clienteLogado');

    if (!clienteLogado) {
      alert('Nenhum cliente logado encontrado.');
      return;
    }

    try {
      const clientesRef = ref(db, 'clientes');
      const snapshot = await get(clientesRef);

      if (snapshot.exists()) {
        const dados = snapshot.val();
        let clienteEncontrado = null;
        let chaveCliente = null;

        // Procurar cliente com usuario correspondente ao clienteLogado
        for (const chave in dados) {
          if (dados[chave].usuario === clienteLogado) {
            clienteEncontrado = dados[chave];
            chaveCliente = chave;
            break;
          }
        }

        if (!clienteEncontrado || !chaveCliente) {
          alert('Cliente não encontrado!.');
          return;
        }

        // Atualizar dados no Firebase
        await update(ref(db, `clientes/${chaveCliente}`), {
          nome,
          telefone,
          endereco,
          bairro,
          numero
        });

        alert('Dados atualizados com sucesso!');
      } else {
        alert('Não há clientes cadastrados.');
      }
    } catch (error) {
      console.error('Erro ao buscar/atualizar dados:', error);
      alert('Ocorreu um erro ao salvar as informações.');
    }
  });

  const buttonLoggout = document.getElementById("btnLoggoutid");

  buttonLoggout.onclick = () => {
    localStorage.removeItem("clienteLogado")
    alert('Estamos finalizando...')
    location.reload()
  }
