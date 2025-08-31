document.addEventListener('DOMContentLoaded', () => {
  const formularioEnviado = localStorage.getItem('UserAuthForm')

  if (formularioEnviado) {
    window.location.href = 'submit.html'
  }
})

//Valida cidade em tempo real (input)
const cep = document.getElementById("cep")
const cidade = document.getElementById("cidade")

cep.addEventListener("input", async () => {
  const cepCidade = cep.value.trim()

  if (cepCidade.length === 9) {
    try {

      const response = await fetch(`https://viacep.com.br/ws/${cepCidade}/json/`)
      const dados = await response.json();

      if (dados.erro) {
        modal.classList.add('active')
        msgErro.innerHTML = "Cep inválido"
        input.focus()
        return;
      }

      cidade.value = `${dados.localidade} - ${dados.uf}`

    } catch (erro) {
      modal.classList.add('active')
      msgErro.innerHTML = `Cep inválido.`
    }
  } else {
    cidade.value = ''
  }
})

//Botão "Submit"
const submitBtn = document.getElementById("btnEnviar")
const modal = document.getElementById("modalError")
const fechar = document.getElementById("btnFechar")
const msgErro = document.getElementById("msgError")

//INPUTS RADIO
const inputExperiencia = document.querySelectorAll('input[name="experiencia"]')
const inputTrabalho = document.querySelectorAll('input[name="trabalho"]')

//TextArea
const txtAreaExperiencia = document.getElementById("descExperiencia")
const txtAreaTrabalho = document.getElementById("descTrabalho")

//Observa mudanças para ativar TextArea

//Textarea de experiência
inputExperiencia.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.value === 'Sim' && radio.checked) {
      txtAreaExperiencia.disabled = false;
    } else if (radio.value === 'Não' && radio.checked) {
      txtAreaExperiencia.disabled = true;
      txtAreaExperiencia.value = ''
    }
  })
})

//Textarea do trabalho
inputTrabalho.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.value === 'Sim' && radio.checked) {
      txtAreaTrabalho.disabled = false;
    } else if (radio.value === 'Não' && radio.checked) {
      txtAreaTrabalho.disabled = true;
      txtAreaTrabalho.value = ''
    }
  })
})

//Modal de alerta
fechar.onclick = () => {
  modal.classList.remove('active')
}

let erroTimeoutId = null;

const observer = new MutationObserver(() => {
  if (modal.classList.contains('active')) {
    if (erroTimeoutId) clearTimeout(erroTimeoutId)

    erroTimeoutId = setTimeout(() => {
      modal.classList.remove('active')
      erroTimeoutId = null
    }, 2500)
  }
})

observer.observe(modal, { attribute: true, attributeFilter: ['class'] })

//Valida todos os inputs
submitBtn.addEventListener('click', async () => {

  const campos = ["Nome", "Telefone", "Email", "dataNascimento", "Cpf", "Rua", "Bairro", "Cep", "Cidade"]

  // -- 1. Valida Informações e Endereço -- 
  for (let nome of campos) {
    const input = document.querySelector(`input[name="${nome}"]`)

    switch (nome) {

      //Valida campo Nome
      case 'Nome':
        if (!input.value.trim()) {
          modal.classList.add('active')
          msgErro.innerHTML = `Preencha o campo: <span>Nome</span>`
          input.focus()
          return;
        }

        if (/\d/.test(input.value)) {
          modal.classList.add('active')
          msgErro.innerHTML = `Nome inválido.`
          input.focus()
          return;
        }
        break;

      //Valida campo Telefone
      case 'Telefone':
        if (!input.value) {
          modal.classList.add('active')
          msgErro.innerHTML = `Preencha o campo: <span>Telefone</span>`
          input.focus()
          return;
        }

        if (input.value.length !== 15) {
          modal.classList.add('active')
          msgErro.innerHTML = `Telefone inválido.`
          input.focus()
          return;
        }
        break;

      //Valida campo Email
      case 'Email':
        if (!input.value) {
          modal.classList.add('active')
          msgErro.innerHTML = `Preencha o campo: <span>Email</span>`
          input.focus()
          return;
        }

        if (!input.value.includes('@') || !input.value.includes('.')) {
          modal.classList.add('active')
          msgErro.innerHTML = `Email inválido.`
          input.focus()
          return;
        }
        break;

      //Valida campo Data de nascimento
      case 'dataNascimento':
        if (!input.value) {
          modal.classList.add('active')
          msgErro.innerHTML = `Preencha o campo: <span>Data de nascimento</span>`
          input.focus()
          return;
        }

        if (input.value.length !== 10) {
          modal.classList.add('active')
          msgErro.innerHTML = `Data de nascimento inválida.`
          input.focus()
          return;
        } else {
          let idade = validarIdade(input.value)

          if (idade < 18) {
            modal.classList.add('active')
            msgErro.innerHTML = `Você precisa ter mais de 18 anos.`
            input.focus()
            return;
          }
        }
        break;

      //Valida campo Cpf
      case 'Cpf':
        if (!input.value) {
          modal.classList.add('active')
          msgErro.innerHTML = `Preencha o campo: <span>Cpf</span>`
          input.focus()
          return;
        }

        if (input.value.length !== 14) {
          modal.classList.add('active')
          msgErro.innerHTML = `Cpf inválido.`
          input.focus()
          return;
        }
        break;

      //Valida campo Rua
      case 'Rua':
        if (!input.value) {
          modal.classList.add('active')
          msgErro.innerHTML = `Preencha o campo: <span>Rua</span>`
          input.focus()
          return;
        }
        break;

      //Valida campo Bairro
      case 'Bairro':
        if (!input.value) {
          modal.classList.add('active')
          msgErro.innerHTML = `Preencha o campo: <span>Bairro</span>`
          input.focus()
          return;
        }
        break;

      //Valida campo Cep
      case 'Cep':
        if (!input.value) {
          modal.classList.add('active')
          msgErro.innerHTML = `Preencha o campo: <span>Cep</span>`
          input.focus()
          return;
        }

        if (input.value.length !== 9) {
          modal.classList.add('active')
          msgErro.innerHTML = `Cep inválido.`
          input.focus()
          return;
        }
        break

      case 'Cidade':
        if (!input.value) {
          modal.classList.add('active')
          msgErro.innerHTML - `Cep inválido.`
          cep.focus()
          return;
        }
        break

    } //Finaliza validações "Informações" && "Endereço"
  }

  // -- 2.Validações dos selects -- 

  // Select 1 = Escolaridade
  const escolaridade = document.getElementById("escolaridade") //Pega select
  const escolaridadeValue = escolaridade.value //Pega valor
  if (!escolaridadeValue) {
    modal.classList.add('active')
    msgErro.innerHTML = `Preencha o campo: <span>Escolaridade</span>`
    escolaridade.scrollIntoView({ behavior: "smooth", block: "center" })
    escolaridade.focus()
    return;
  }

  // Select 2 = Area do interesse
  const area = document.getElementById("areaInteresse")
  const areaValor = area.value;
  if (!areaValor) {
    modal.classList.add('active')
    msgErro.innerHTML = `Preencha o campo: <span>Area do interesse</span>`
    area.scrollIntoView({ behavior: "smooth", block: "center" })
    area.focus()
    return;
  }
  //Finaliza as validações de select

  // -- 3.Validações de Experiência e trabalho com programação--
  //Experiência
  const expValue = document.querySelector('input[name="experiencia"]:checked')
  if (!expValue) {
    modal.classList.add('active')
    msgErro.innerHTML = `Responda: <span>Experiência com programação?</span>`
    return;
  } else if (expValue && expValue.value === 'Sim') {
    if (txtAreaExperiencia.value.trim() === '') {
      modal.classList.add('active')
      msgErro.innerHTML = `Preencha o campo: <span>Quais experiências?</span>`
      txtAreaExperiencia.focus()
      return;
    }
  }

  //Trabalho
  const trabValue = document.querySelector('input[name="trabalho"]:checked')
  if (!trabValue) {
    modal.classList.add('active')
    msgErro.innerHTML = `Responda: <span>Trabalhou com programação?</span>`
    return;
  } else if (trabValue && trabValue.value === 'Sim') {
    if (txtAreaTrabalho.value.trim() === '') {
      modal.classList.add('active')
      msgErro.innerHTML = `Preencha o campo: <span>Em que empresa/projeto atuou?</span>`
      txtAreaTrabalho.focus()
      return;
    }
  }

  let today = new Date()

  const day = String(today.getDate()).padStart(2, '0')
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const year = String(today.getFullYear())

  const dateUser = `${day}/${month}/${year}`

  localStorage.setItem('UserAuthForm', dateUser)

  location.reload()
})

//Valida se o candidato é maior de idade
function validarIdade(data) {

  const partes = data.split("/");

  const dia = parseInt(partes[0], 10)
  const mes = parseInt(partes[1], 10) - 1; // Mês no javaScript começa em 0
  const ano = parseInt(partes[2], 10)

  const nascimento = new Date(ano, mes, dia)
  const hoje = new Date();

  let idade = hoje.getFullYear() - nascimento.getFullYear();

  //Caso não tenha feito aniversário esse ano, subtrai 1
  if (hoje.getMonth() < nascimento.getMonth() || (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate())) {
    idade--
  }

  return idade;
}