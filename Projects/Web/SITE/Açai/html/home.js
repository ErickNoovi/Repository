const boxAnimation1 = document.getElementById('section1-boximg1id');

boxAnimation1.addEventListener('mouseenter', () => {
    boxAnimation1.classList.add('animar')

    setTimeout(() => boxAnimation1.classList.remove('animar'), 1000)
})


//Alterar para cliente ou logar
const btnLogar = document.getElementById("buttonLogar");
const loginHeader = document.getElementById("cabecalhologinid");

document.addEventListener('DOMContentLoaded', () => {
    const userLogged = localStorage.getItem("clienteLogado")

    if (!userLogged){
        btnLogar.textContent = 'Fazer login'

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

 let teclasPressionadas = new Set();

  document.addEventListener('keydown', (event) => {
    teclasPressionadas.add(event.key.toLowerCase());

    if (
      teclasPressionadas.has('control') &&
      teclasPressionadas.has('alt') &&
      teclasPressionadas.has('shift') &&
      teclasPressionadas.has('p') &&
      teclasPressionadas.has('e')
    ) {
      // Redirecionar
      location.href = "getPedidos.html";
    }
  });

  document.addEventListener('keyup', (event) => {
    teclasPressionadas.delete(event.key.toLowerCase());
  });

  //Cards de destaques
  const copo1 = document.getElementById("copo1");
  const copo2 = document.getElementById("copo2");
  const copo3 = document.getElementById("copo3");

  copo1.addEventListener('mouseenter', () => {

    if(copo2.classList.contains('destaque')){
      copo2.classList.remove('destaque')
      copo1.classList.add('destaque')
    }

    if (copo3.classList.contains('destaque')){
      copo3.classList.remove('destaque')
      copo1.classList.add('destaque')
    }
  });

  copo2.addEventListener('mouseenter', () => {

    if(copo1.classList.contains('destaque')){
      copo1.classList.remove('destaque')
      copo2.classList.add('destaque')
    }

    if (copo3.classList.contains('destaque')){
      copo3.classList.remove('destaque')
      copo2.classList.add('destaque')
    }
  });

  copo3.addEventListener('mouseenter', () => {

    if(copo1.classList.contains('destaque')){
      copo1.classList.remove('destaque')
      copo3.classList.add('destaque')
    }

    if (copo2.classList.contains('destaque')){
      copo2.classList.remove('destaque')
      copo3.classList.add('destaque')
    }
  });

  
  