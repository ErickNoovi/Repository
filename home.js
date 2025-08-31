//Header
const header = document.getElementById('headerid')

//Modal de contato
const modalContato = document.getElementById('modalContato')
const modalContatoBox = document.getElementById('modalContatoBox')

//Modal Sobre
const modalSobre = document.getElementById('modalSobre')
const modalSobreBox = document.getElementById('modalSobreBox')

const btnContato = document.querySelectorAll('.btnContato')
const btnFechar = document.getElementById('btnFechar')
const btnSobre = document.querySelectorAll('.btnSobre')
const btnFecharSobre = document.getElementById('btnFechar2')

//Se clicar nos botões com a classe: "btnContato", abre o modal de contato
btnContato.forEach(botao => {
    botao.addEventListener("click", () => {
        modalContato.classList.add('active')
        document.body.style.overflow = 'hidden'
    })
})

//Se clicar nos botões com a classe: "btnSobre", abre o modal de sobre min
btnSobre.forEach(botao => {
    botao.addEventListener("click", () => {
        modalSobre.classList.add('active')
        document.body.style.overflow = 'hidden'
    })
})

//Fecha modal Sobre
btnFecharSobre.addEventListener('click', () => {
    modalSobre.classList.remove('active')
    document.body.style.overflow = 'auto'
})

//Fecha modal de contato
btnFechar.addEventListener('click', () => {
    modalContato.classList.remove('active')
    document.body.style.overflow = 'auto'
})

// Fecha modal clicando fora do conteúdo
document.addEventListener('click', (e) => {

    // Se o modal estiver aberto (se tiver a classe "ACTIVE")
    if (modalContato.classList.contains('active')) {
        //Verifica se o clique foi fora do modal
        if (!modalContatoBox.contains(e.target) && ![...btnContato].some(b => b.contains(e.target))) {
            modalContato.classList.remove('active')
            document.body.style.overflow = 'auto'
        }
    }

    // Se o modal estiver aberto (se tiver a classe "ACTIVE")
    if (modalSobre.classList.contains('active')) {
        //Verifica se o clique foi fora do modal
        if (!modalSobreBox.contains(e.target) && ![...btnSobre].some(b => b.contains(e.target))) {
            modalSobre.classList.remove('active')
            document.body.style.overflow = 'auto'
        }
    }

})

//LINKS DOS CARDS

const loader = document.getElementById("loader");
const card1 = document.getElementById('card1');

//Pagina de projetos
card1.addEventListener('click', () => {
    loader.classList.add('active')

    setTimeout(() => {
        window.location = 'projetos/projetos.html'
    }, 1500)

})