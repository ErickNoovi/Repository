// Importa Firebase (módulo)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

// Configuração do Firebase (substitua pelas suas credenciais)
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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const container = document.getElementById('pedidos-container');
const mensagem = document.getElementById('mensagem');

async function carregarPedidos() {
  const clienteLogado = localStorage.getItem('clienteLogado');
  if (!clienteLogado) {
    mensagem.textContent = "Nenhum cliente logado. Faça login para ver seus pedidos.";
    return;
  }

  try {
    const clientesRef = ref(db, 'clientes');
    const snapshot = await get(clientesRef);

    if (!snapshot.exists()) {
      mensagem.textContent = "Nenhum cliente encontrado no banco de dados.";
      return;
    }

    const clientes = snapshot.val();
    let chaveDoCliente = null;

    // Encontra a chave do cliente logado
    for (const chave in clientes) {
      if (clientes[chave].usuario === clienteLogado) {
        chaveDoCliente = chave;
        break;
      }
    }

    if (!chaveDoCliente) {
      mensagem.textContent = "Cliente logado não encontrado no banco de dados.";
      return;
    }

    const pedidosRef = ref(db, `clientes/${chaveDoCliente}/pedidos`);
    const pedidosSnapshot = await get(pedidosRef);

    if (!pedidosSnapshot.exists()) {
      mensagem.textContent = "Nenhum pedido encontrado para esse cliente.";
      return;
    }

    const pedidos = pedidosSnapshot.val();

    container.innerHTML = ""; // Limpa container antes de mostrar

    let contador = 1;
    for (const pedidoKey in pedidos) {
      const p = pedidos[pedidoKey];

      const divPedido = document.createElement('div');
      divPedido.classList.add('pedido');

      const headerPedido = document.createElement('div');
      headerPedido.classList.add('pedido-header');
      headerPedido.textContent = `Pedido ${contador}`;

      const arrow = document.createElement('span');
      arrow.classList.add('arrow');
      arrow.textContent = '►';
      headerPedido.appendChild(arrow);

      const contentPedido = document.createElement('div');
      contentPedido.classList.add('pedido-content');

      contentPedido.innerHTML = `
        <p><span class="label">Nome:</span> <span class="valor">${p.nome || '-'}</span></p>
        <p><span class="label">Telefone:</span> <span class="valor">${p.telefone || '-'}</span></p>
        <p><span class="label">Endereço:</span> <span class="valor">${p.endereco || '-'}</span></p>
        <p><span class="label">Bairro:</span> <span class="valor">${p.bairro || '-'}</span></p>
        <p><span class="label">Número:</span> <span class="valor">${p.numeroCasa || '-'}</span></p>
        <p><span class="label">Tamanho do Copo:</span> <span class="valor">${p.tamanhoCopo || '-'}</span></p>
        <p><span class="label">Adicionais:</span> <span class="valor">${p.adicionais || 'Nenhum'}</span></p>
        <p><span class="label">Pagamento:</span> <span class="valor">${p.pagamento || '-'}</span></p>
        <p><span class="label">Troco:</span> <span class="valor">${p.troco || '-'}</span></p>
        <p><span class="label">Observação:</span> <span class="valor">${p.obsCliente || '-'}</span></p>
        <p><span class="label">Status Pagamento:</span> <span class="valor">${p.statusPagamento || '-'}</span></p>
        <p><span class="label">Data do Pedido:</span> <span class="valor">${p.dataEnv || '-'}</span></p>
        <p><span class="label">Hora do Pedido:</span> <span class="valor">${p.horaEnv || '-'}</span></p>
        <p><span class="label">Preço Total:</span> <span class="valor">R$ ${p.precoTotal || '0.00'}</span></p>
      `;

      // Evento de toggle abrir/fechar pedido
      headerPedido.addEventListener('click', () => {
        const aberto = contentPedido.classList.toggle('open');
        arrow.classList.toggle('open', aberto);
      });

      divPedido.appendChild(headerPedido);
      divPedido.appendChild(contentPedido);

      container.appendChild(divPedido);
      contador++;
    }

    mensagem.textContent = ""; // Limpa mensagens de erro/aviso

  } catch (err) {
    mensagem.textContent = "Erro ao carregar pedidos: " + err.message;
    console.error(err);
  }
}

window.addEventListener('DOMContentLoaded', carregarPedidos);


//Alterar para cliente ou logar
const btnLogar = document.getElementById("buttonLogar");
const loginHeader = document.getElementById("cabecalhologinid");

document.addEventListener('DOMContentLoaded', () => {
    const userLogged = localStorage.getItem("clienteLogado")

    if (!userLogged){
        btnLogar.textContent = 'Fazer login'
        loginHeader.style.border = '0.2vw solid #FFC107'

        btnLogar.onclick = () => {
            window.location.href = '../loginCliente/login.html' 
        }
    }

    if (userLogged){
        btnLogar.textContent = userLogged + " •";

        btnLogar.onclick = () => {
            window.location.href = '../loginCliente/endereco.html'
        }
    }
});