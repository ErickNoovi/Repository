  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
  import { getDatabase, ref, get, set, child, update, onValue } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

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

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getDatabase(app);


  const loginContainer = document.getElementById('loginContainer');
  const app2 = document.getElementById('app');
  const emailInput = document.getElementById('emailInput');
  const passwordInput = document.getElementById('passwordInput');
  const loginBtn = document.getElementById('loginBtn');
  const loginError = document.getElementById('loginError');
  const btnLogout = document.getElementById('buttonLogout');

  btnLogout.addEventListener('click', () => {
    localStorage.removeItem("usuarioLogado");
    location.reload();
  })

  //Caso houver usuarioLocal = admingeral, a pagina não solicita o login
  const usuarioLocal = localStorage.getItem('usuarioLogado');
  if (usuarioLocal === 'admingeral') {
    loginContainer.style.display = 'none';
    app2.style.display = 'block';
    carregarPedidos();
  }

  loginBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    try{
    
      const snapshot = await get(ref(db, 'login/admingeral'));

      if (snapshot.exists()) {
        const dados = snapshot.val();
        if (email === dados.admin && password === dados.senha) {
          localStorage.setItem('usuarioLogado', 'admingeral')
          loginError.style.display = 'none';
          loginContainer.style.display = 'none';
          app2.style.display = 'block';
          carregarPedidos();
        }
        else{
          console.error("Usuário 'admingeral' não encontrado")
          loginError.style.display = 'block'
        }
      }

    }catch{
      console.error("Erro ao acessar o banco:", error);
      loginError.textContent = 'Erro de conexão.';
      loginError.style.display = 'block';
    };
  });

  passwordInput.addEventListener('keypress', e => {
    if(e.key === 'Enter'){
      loginBtn.click();
    }
  });

  const firebaseUrlBase = 'https://pagina-acai-default-rtdb.europe-west1.firebasedatabase.app/pedidos';

  const filtroStatus = document.getElementById('filtroStatus');
  const totalValorEl = document.getElementById('totalValor');
  const pedidosContainer = document.getElementById('pedidosContainer');
  const exportCSVBtn = document.getElementById('exportCSV');

  // Variável global para armazenar pedidos atuais filtrados
  let pedidosFiltrados = [];

  filtroStatus.addEventListener('change', carregarPedidos);

  exportCSVBtn.addEventListener('click', () => {
    if(pedidosFiltrados.length === 0){
      alert('Não há pedidos para exportar.');
      return;
    }
    baixarCSV(pedidosFiltrados);
  });

  async function carregarPedidos() {
    pedidosContainer.innerHTML = '';
    totalValorEl.textContent = 'Carregando pedidos...';

    try {
      const response = await fetch(firebaseUrlBase + '.json');
      const data = await response.json();

      if (!data) {
        totalValorEl.textContent = 'Nenhum pedido encontrado.';
        pedidosFiltrados = [];
        return;
      }

      let pedidosArray = Object.entries(data).map(([key, pedido]) => {
        pedido._id = key;
        return pedido;
      });

      // Ordenar por dataEnv + horaEnv crescente (mais antigo primeiro)
      pedidosArray.sort((a, b) => {
        function parseDataHora(pedido) {
          if (!pedido.dataEnv || !pedido.horaEnv) return new Date(0);
          const [dia, mes, ano] = pedido.dataEnv.split('/');
          const [hora, minuto, segundo] = pedido.horaEnv.split(':');
          return new Date(ano, mes - 1, dia, hora, minuto, segundo);
        }
        return parseDataHora(a) - parseDataHora(b);
      });

      const filtro = filtroStatus.value;
      if(filtro === 'concluidos') {
        pedidosArray = pedidosArray.filter(p => p.StatusPagamento === 'Concluido!');
      } else if(filtro === 'naoConcluidos') {
        pedidosArray = pedidosArray.filter(p => p.StatusPagamento !== 'Concluido!');
      }

      pedidosFiltrados = pedidosArray; // guardar para exportar CSV

      let totalVendido = 0;
      pedidosArray.forEach(p => {
        const preco = parseFloat(String(p.precoTotal).replace(',', '.')) || 0;
        totalVendido += preco;
      });

      totalValorEl.textContent = `Total vendido: R$ ${totalVendido.toFixed(2).replace('.', ',')}`;

      if(pedidosArray.length === 0) {
        pedidosContainer.innerHTML = '<p>Nenhum pedido para mostrar.</p>';
        return;
      }

      pedidosArray.forEach(pedido => {
        const card = document.createElement('div');
        card.classList.add('card');

        if (pedido.StatusPagamento === 'Concluido!') {
          card.classList.add('concluido');
        }

        const header = document.createElement('div');
        header.classList.add('card-header');
        header.textContent = pedido.nome || 'Sem nome';

        const telefoneSpan = document.createElement('span');
        telefoneSpan.textContent = pedido.telefone || '';
        telefoneSpan.style.fontWeight = 'normal';
        telefoneSpan.style.fontSize = '0.9em';
        telefoneSpan.style.color = '#555';
        header.appendChild(telefoneSpan);

        card.appendChild(header);

        const detalhes = document.createElement('div');
        detalhes.classList.add('card-details');

        const camposExibir = ['endereco', 'bairro', 'numeroCasa', 'tamanhoCopo', 'adicionais', 'precoTotal', 'Pagamento', 'StatusPagamento', 'Troco', 'obsCliente', 'dataEnv', 'horaEnv'];
        camposExibir.forEach(campo => {
          if(pedido[campo]){
            const p = document.createElement('p');
            p.innerHTML = `<strong>${campo}:</strong> ${pedido[campo]}`;
            detalhes.appendChild(p);
          }
        });

        card.appendChild(detalhes);

        // Container para o botão Concluir Pedido
        let actions = null;
        if (pedido.StatusPagamento !== 'Concluido!') {
          actions = document.createElement('div');
          actions.classList.add('actions');

          const concluirBtn = document.createElement('button');
          concluirBtn.textContent = 'Concluir Pedido';
          concluirBtn.style.padding = '6px 10px';
          concluirBtn.style.backgroundColor = '#4CAF50';
          concluirBtn.style.color = 'white';
          concluirBtn.style.border = 'none';
          concluirBtn.style.borderRadius = '5px';
          concluirBtn.style.cursor = 'pointer';

          concluirBtn.addEventListener('click', async (e) => {
            e.stopPropagation(); // Evita abrir/fechar os detalhes
            if(confirm('Marcar este pedido como concluído?')) {
              try {
                await fetch(`${firebaseUrlBase}/${pedido._id}.json`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ StatusPagamento: 'Concluido!' })
                });
                carregarPedidos(); // Atualiza lista
              } catch (error) {
                alert('Erro ao concluir o pedido.');
                console.error(error);
              }
            }
          });

          actions.appendChild(concluirBtn);
          detalhes.appendChild(actions);
        }

        // Expansão ao clicar no card para mostrar/esconder detalhes e botão
        card.addEventListener('click', () => {
          const isVisible = detalhes.style.display === 'block';
          if(isVisible){
            detalhes.style.display = 'none';
            if(actions) actions.style.display = 'none';
          } else {
            detalhes.style.display = 'block';
            if(actions) actions.style.display = 'flex';
          }
        });

        pedidosContainer.appendChild(card);
      });

    } catch (error) {
      console.error(error);
      pedidosContainer.innerHTML = '<p>Erro ao carregar pedidos.</p>';
      totalValorEl.textContent = 'Erro ao carregar total vendido.';
    }
  }

  // Função para exportar CSV
  function baixarCSV(pedidos) {
    if(pedidos.length === 0) return;

    const headers = ['nome','telefone','endereco','bairro','numeroCasa','tamanhoCopo','adicionais','precoTotal','Pagamento', 'Troco','StatusPagamento','obsCliente','dataEnv','horaEnv'];
    const csvRows = [];
    csvRows.push(headers.join(','));

    pedidos.forEach(pedido => {
      const row = headers.map(h => {
        let val = pedido[h];
        if(val == null) val = '';
        // Escape aspas e vírgulas para CSV
        if(typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
          val = `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      });
      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `pedidos_acai_${new Date().toISOString().slice(0,10)}.csv`;
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
