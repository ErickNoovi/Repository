function resetInputs() {
  // Limpar text inputs
  document.getElementById("nomeid").value = "";
  document.getElementById("telefoneid").value = "";
  document.getElementById("enderecoid").value = "";
  document.getElementById("bairroid").value = "";
  document.getElementById("numeroid").value = "";
  document.getElementById("inputtrocoid").value = "";
  document.getElementById("textareaid").value = "";

  // Desmarcar radios de copo
  document.querySelectorAll('input[name="Copo"]').forEach(input => input.checked = false);

  // Desmarcar checkboxes de adicionais
  document.querySelectorAll('.sabor').forEach(input => input.checked = false);

  // Desmarcar radios de método de pagamento
  document.querySelectorAll('input[name="metodoPagamento"]').forEach(input => input.checked = false);

  // Atualiza estado (desabilita adicionais se copo não estiver selecionado e atualiza preço)
  verificarCopoSelecionado();
}

// Importações do Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

// Configuração do seu Firebase
 const firebaseConfig = {
  apiKey: "AIzaSyCoWX6eMyX8Lt8XGjv2U6l6_LoS64sQsRs",
  authDomain: "pagina-acai.firebaseapp.com",
  databaseURL: "https://pagina-acai-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "pagina-acai",
  storageBucket: "pagina-acai.firebasestorage.app",
  messagingSenderId: "1077707724551",
  appId: "1:1077707724551:web:b5a19fc61fc95ca7d997a2",
  measurementId: "G-FSRNPWF2XR"
  };

// Inicialização do Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

window.EnviarPedido = async function(){
  const nome = document.getElementById("nomeid").value.trim();
  const telefone = document.getElementById("telefoneid").value.trim();
  const endereco = document.getElementById("enderecoid").value.trim();
  const bairro = document.getElementById("bairroid").value.trim();
  const numeroCasa = document.getElementById("numeroid").value.trim();

  const copoSelecionado = document.querySelector('input[name="Copo"]:checked');
  const tamanhoCopo = copoSelecionado ? copoSelecionado.value : null; 

  if (!nome||!telefone||!endereco||!bairro||!numeroCasa||!tamanhoCopo){
    return alert ('Preencha todos os campos!')
  }

  const precoTotal = document.getElementById("precoTotal").innerText;
  const adicionais = Array.from(document.querySelectorAll('.sabor:checked'))
  .map(el => el.parentElement.textContent.trim())
  .join(', ');

  const pagamento = document.querySelector('input[name="metodoPagamento"]:checked')?.value;

  if (!pagamento) {
    alert ('Escolha metodo de pagamento');
    return;
  }

  let troco = '';
  if (pagamento === 'dinheiro') {
    troco = document.getElementById('inputtrocoid').value.trim();

    if (!troco) {
      alert('Por favor, informe o valor do troco.');
      return;
    }
  }
  
  const nomeFormatado = nome.trim().toLowerCase();
  const telefoneTres = telefone.trim().substring(0, 14);
  const ClienteId = nomeFormatado + telefoneTres;

  const agora = new Date();
  const dataEnv = agora.toLocaleDateString('pt-BR');
  const horaEnv = agora.toLocaleTimeString('pt-BR');
  const obsCliente = document.getElementById('textareaid').value;
  const statusPagamento = 'Pendente...';

  const dados = {
    nome,
    telefone,
    endereco,
    bairro,
    numeroCasa,
    tamanhoCopo,
    dataEnv,
    horaEnv,
    precoTotal,
    adicionais,
    pagamento,
    troco,
    obsCliente,
    statusPagamento
  };

  try {
    // Mantém o envio padrão para testes
    await set(ref(db, 'pedidos/' + ClienteId), dados);

    // --- ADICIONA envio do pedido dentro do cliente logado ---
    const clienteLogado = localStorage.getItem("clienteLogado");

    if (clienteLogado) {
      const clientesRef = ref(db, 'clientes');
      const snapshot = await get(clientesRef);

      if (snapshot.exists()) {
        const clientes = snapshot.val();
        let chaveDoCliente = null;

        for (const chave in clientes) {
          if (clientes[chave].usuario === clienteLogado) {
            chaveDoCliente = chave;
            break;
          }
        }

        if (chaveDoCliente) {
          const pedidosRef = ref(db, `clientes/${chaveDoCliente}/pedidos`);
          const pedidosSnapshot = await get(pedidosRef);
          const pedidosExistentes = pedidosSnapshot.exists() ? Object.keys(pedidosSnapshot.val()) : [];
          const proximoId = `pedido${pedidosExistentes.length + 1}`;

          await set(ref(db, `clientes/${chaveDoCliente}/pedidos/${proximoId}`), dados);
        } else {
          console.warn("Cliente não encontrado dentro de 'clientes/'.");
        }
      } else {
        console.warn("Nenhum cliente encontrado no banco.");
      }
    } else {
      console.warn("Nenhum clienteLogado encontrado no localStorage.");
    }

    localStorage.setItem("pedido", JSON.stringify(dados));

    alert('Pedido enviado com sucesso!');
    resetInputs();

    if (pagamento === 'pix') {
      location.href = "pix.html";
      return;
    }

    location.href = "status.html";

  } catch (error) {
    console.error(error);
    alert('Erro ao enviar seu pedido, tente novamente...');
  }
};

function verificarCopoSelecionado() {
  const copoSelecionado = document.querySelector('input[name="Copo"]:checked');
  const adicionais = document.querySelectorAll('.sabor');

  const habilitar = !!copoSelecionado; // true se um copo estiver selecionado

  adicionais.forEach(adicional => {
    adicional.disabled = !habilitar;

    // Desmarca se estiver desabilitado
    if (!habilitar) adicional.checked = false;
  });

  atualizarPreco(); // Garante que o preço seja atualizado
}

// Evento quando algum copo é selecionado
document.querySelectorAll('input[name="Copo"]').forEach(input => {
  input.addEventListener('change', verificarCopoSelecionado);
});

// Chama no carregamento inicial
verificarCopoSelecionado();


// Preços base dos copos
const precosCopo = {
  "300ML": 9.00,
  "400ML": 14.00,
  "500ML": 18.00
};

function atualizarPreco() {
  // 1. Verifica o copo selecionado
  const copoSelecionado = document.querySelector('input[name="Copo"]:checked');
  const tamanho = copoSelecionado ? copoSelecionado.value : null;
  const precoBase = tamanho ? precosCopo[tamanho] : 0;

  // 2. Soma os preços dos adicionais (checkboxes com class="sabor")
  const adicionaisSelecionados = document.querySelectorAll('.sabor:checked');
  let precoAdicionais = 0;
  adicionaisSelecionados.forEach(item => {
    precoAdicionais += parseFloat(item.dataset.preco);
  });

  // 3. Total geral
  const total = precoBase + precoAdicionais;

  // 4. Atualiza os valores no HTML
  document.getElementById("precoBase").innerText = precoBase.toFixed(2);
  document.getElementById("precoAdicionais").innerText = precoAdicionais.toFixed(2);
  document.getElementById("precoTotal").innerText = total.toFixed(2);
}

// Atualiza sempre que um copo ou adicional é selecionado/desmarcado
document.querySelectorAll('input[name="Copo"]').forEach(input => {
  input.addEventListener('change', atualizarPreco);
});
document.querySelectorAll('.sabor').forEach(input => {
  input.addEventListener('change', atualizarPreco);
});

// Atualiza na primeira carga
atualizarPreco();


//Verifica se há usuario logado COM endereço definido
window.addEventListener('DOMContentLoaded', async () => {
    const clienteLogado = localStorage.getItem('clienteLogado');

    if (!clienteLogado) {
      console.warn('Nenhum cliente logado.');
      return;
    }

    try {
      const clientesRef = ref(db, 'clientes');
      const snapshot = await get(clientesRef);

      if (snapshot.exists()) {
        const dados = snapshot.val();
        let clienteEncontrado = null;

        for (const chave in dados) {
          if (dados[chave].usuario === clienteLogado) {
            clienteEncontrado = dados[chave];
            break;
          }
        }

        if (clienteEncontrado) {
          // Se campos já estiverem preenchidos, mostrar nos inputs
          const { nome, telefone, endereco, bairro, numero } = clienteEncontrado;

          if (nome) document.getElementById('nomeid').value = nome;
          if (telefone) document.getElementById('telefoneid').value = telefone;
          if (endereco) document.getElementById('enderecoid').value = endereco;
          if (bairro) document.getElementById('bairroid').value = bairro;
          if (numero) document.getElementById('numeroid').value = numero;
        } else {
          console.warn('Cliente não encontrado no banco.');
        }
      }
    } catch (err) {
      console.error('Erro ao buscar dados do cliente:', err);
    }
  });
