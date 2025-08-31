const searchBtn = document.getElementById('btnSearch')
const searchBar = document.getElementById('inputBoxId')
const inputSearch = document.getElementById('inputSearch')

//Quando clicar no botão de "Pesquisa", mostra input
searchBtn.addEventListener('click', () => {
    searchBtn.style.display = 'none'
    searchBar.classList.add('active')
    inputSearch.focus()
})

//Quando o input de "Pesquisa" perder foco, ele oculta input
inputSearch.addEventListener('blur', () => {
    searchBar.classList.remove('active')
    searchBtn.style.display = 'flex'
})
