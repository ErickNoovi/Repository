//MODAL's
const modallogin = document.getElementById("modalloginid");
const modalreg = document.getElementById("modalregisterid");

//BUTTON's trocar modal
const loginchange = document.getElementById("linkregisterid");
const registerchange = document.getElementById("linkforloginid");

//Inputs


//Trocar de login para register
loginchange.addEventListener('click', () => {
    modallogin.classList.remove('active');
    modalreg.classList.add('active')
})

registerchange.addEventListener('click', () => {
    modalreg.classList.remove('active');
    modallogin.classList.add('active')
})

/*Quando houver texto no input*/
const input = document.querySelectorAll('input')

input.forEach(input => {
    input.addEventListener('input', () => {
        if (input.value.trim() !== ""){
            input.classList.add('digitado');
        } else{
            input.classList.remove('digitado')
        }
    })
})