const lua = document.getElementById('moonid')
const janelaReflexo = document.getElementById('reflectWindow')
const janelaBrilho = document.querySelectorAll('.l1')
const lightWall1 = document.getElementById('wallLight1')
const reflectMoon = document.querySelector('.reflectMoon')
const stars = document.querySelectorAll(".star")
const cloud = document.getElementById('cloudId')
const firefly = document.getElementById('fireflys')

lua.addEventListener('click', () => {
    document.documentElement.classList.toggle('escurecer')

    if (document.documentElement.classList.contains('escurecer')) {

        stars.forEach(star => {
            star.style.transition = "0.5s ease"
            star.style.opacity = 0
        })

        cloud.classList.add('active')
        firefly.classList.add('desactive')

        janelaReflexo.style.transition = "0.5s ease"
        janelaReflexo.style.opacity = 0

        reflectMoon.style.opacity = 0
        reflectMoon.style.transition = "0.5s ease"

        lightWall1.style.opacity = 0
        janelaBrilho.forEach(el => {
            el.style.opacity = 0
        })
    }
    else {
        stars.forEach(star => {
            star.style.transition = "2s ease"
            star.style.opacity = 1
        })

        cloud.classList.remove('active')
        firefly.classList.remove('desactive')

        janelaReflexo.style.transition = "2s ease"
        janelaReflexo.style.opacity = 1

        reflectMoon.style.transition = "3s ease"
        reflectMoon.style.opacity = 1

        lightWall1.style.opacity = 1
        janelaBrilho.forEach(el => {
            el.style.opacity = 1
        })
    }
})