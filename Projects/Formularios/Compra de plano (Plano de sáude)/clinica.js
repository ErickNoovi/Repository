document.addEventListener('DOMContentLoaded', () => {
    let planoCliente = localStorage.getItem('planoCliente')

    if (planoCliente === 'basico' || planoCliente === 'intermediario' || planoCliente === 'premium') {
        window.location.href = 'submit.html'
    }
    else { }
})

const btnEnviar = document.getElementById("formBtn")

const campos = [
    "nome",
    "sobreNome",
    "email",
    "telefone",
    "rua",
    "numero",
    "bairro",
    "cep",
    "cpf",
    "dataNascimento"
]

const selectCampo = ["sexo", "estadoCivil"]

for (let nome of campos) {
    const input = document.querySelector(`input[name="${nome}"]`)
    const span = document.querySelector(`.input-group.${nome} .erro-msg`)

    input.addEventListener('input', async () => {

        let erro = ''

        switch (nome) {
            case 'nome':
                if (!input.value.trim()) {
                    erro = `Preencha o campo.`
                }
                else if (input.value.length <= 3) {
                    erro = `Nome muito curto.`
                }
                else if (/\d/.test(input.value)) {
                    erro = 'Campo inválido.'
                }
                else {
                    erro = ''
                }
                break;

            case 'sobreNome':
                if (!input.value.trim()) {
                    erro = `Preencha o campo.`
                }
                else if (input.value.length <= 3) {
                    erro = `Nome muito curto.`
                }
                else if (/\d/.test(input.value)) {
                    erro = 'Campo Inválido.'
                }
                else {
                    erro = ''
                }
                break;

            case 'email':
                if (!input.value) {
                    erro = 'Preencha o campo.'
                }
                else if (!input.value.includes('@') || !input.value.includes('.')) {
                    erro = 'Email inválido.'
                }
                else {
                    erro = ''
                }
                break;

            case 'telefone':
                if (!input.value) {
                    erro = 'Preencha o campo.'
                }
                else if (input.value.length !== 14) {
                    erro = 'Campo inválido.'
                }
                else {
                    erro = ''
                }
                break;

            case 'rua':
                if (!input.value) {
                    erro = 'Preencha o campo'
                }
                break;

            case 'numero':
                if (!input.value) {
                    erro = 'Preencha o campo.'
                }
                else if (/[a-zA-Z]/.test(input.value)) {
                    erro = 'Numero inválido.'
                }
                else {
                    erro = ''
                }
                break;

            case 'bairro':
                if (!input.value) {
                    erro = 'Preencha o campo.'
                }
                break;

            case 'cep':
                const inputCep = input.value.replace(/\D/g, "")
                if (!inputCep) {
                    erro = 'Preencha o campo.'
                }
                else if (inputCep.length !== 8) {
                    erro = 'Cep inválido.'
                }
                else {
                    erro = ''
                    //Quando estiver válido, busca na API
                    try {
                        const response = await fetch(`https://viacep.com.br/ws/${inputCep}/json/`)
                        const data = await response.json()

                        if (!data.erro && data.localidade) {
                            const cepFormatado = `${inputCep.slice(0, 5)}-${inputCep.slice(5)}`

                            input.value = `${cepFormatado} (${data.localidade})`
                        } else {
                            erro = 'Cep não encontrado.'
                        }
                    } catch (e) { erro = 'Erro, consulte o nosso suporte: emaia@noovi.com.br' }
                }
                break;

            case 'cpf':
                if (!input.value) {
                    erro = 'Preencha o campo.'
                }
                else if (input.value.length !== 14) {
                    erro = 'CPF inválido.'
                }
                else {
                    erro = ''
                }
                break;

            case 'dataNascimento':
                const dataNasc = input.value
                if (!dataNasc) {
                    erro = 'Preencha o campo.'
                }
                else if (!validarIdade(dataNasc)) {
                    erro = 'Apenas para maiores de 18 anos!'
                }
                else {
                    erro = ''
                }
                break;
        }

        if (erro) {
            input.classList.add('active')
            span.innerHTML = `${erro}`
            span.style.display = 'flex'
        } else {
            input.classList.remove('active')
            span.innerHTML = ''
            span.style.display = 'none'
        }

    })
}


//Valida idade
function validarIdade(data) {
    const hoje = new Date()

    const [dia, mes, ano] = data.split("/")

    const nascimento = new Date(ano, mes - 1, dia)

    let idade = hoje.getFullYear() - nascimento.getFullYear()
    const mesAtual = hoje.getMonth()
    const diaAtual = hoje.getDate()

    if (mesAtual < (mes - 1) || (mesAtual === (mes - 1) && diaAtual < dia)) {
        idade--
    }

    return idade >= 18
}

let usuario = {}

btnEnviar.addEventListener('click', async () => {

    let formValido = true
    let primeiroErro = null; //Para guardar primeiro campo que der erro


    for (let nome of campos) {
        const input = document.querySelector(`input[name="${nome}"]`)
        const span = document.querySelector(`.input-group.${nome} .erro-msg`)

        let erro = ''
        const valor = input.value

        switch (nome) {
            case 'nome':
                if (!valor.trim()) {
                    erro = 'Preencha o campo.'
                }
                else if (valor.length <= 3) {
                    erro = 'Nome muito curto.'
                }
                else if (/\d/.test(valor)) {
                    erro = 'Nome inválido,'
                }
                break;

            case 'sobreNome':
                if (!valor.trim()) {
                    erro = 'Preencha o campo.'
                }
                else if (/\d/.test(valor)) {
                    erro = 'Nome inválido.'
                }
                else if (valor.length <= 3) {
                    erro = 'Nome muito curto.'
                }
                break;

            case 'email':
                if (!valor) {
                    erro = 'Preencha o campo.'
                }
                else if (!valor.includes('@') || !valor.includes('.')) {
                    erro = 'Email inválido.'
                }
                break;

            case 'telefone':
                if (!valor) {
                    erro = 'Preencha o campo.'
                }
                else if (valor.length !== 14) {
                    erro = 'Telefone inválido.'
                }
                break;

            case 'rua':
                if (!valor) {
                    erro = 'Preencha o campo.'
                }
                break;

            case 'numero':
                if (!valor) {
                    erro = 'Preencha o campo.'
                }
                else if (/[a-zA-Z]/.test(valor)) {
                    erro = 'Numero inválido'
                }
                break;

            case 'bairro':
                if (!valor) {
                    erro = 'Preencha o campo.'
                }
                break;

            case 'cep':
                const inputCep = input.value.replace(/\D/g, "")
                if (!inputCep) {
                    erro = 'Preencha o campo.'
                }
                else if (inputCep.length !== 8) {
                    erro = 'Cep inválido'
                }
                else {

                    try {
                        const response = await fetch(`https://viacep.com.br/ws/${inputCep}/json/`)
                        const dados = await response.json()

                        if (!dados.erro && dados.localidade) {
                            // Reformatar valor exibido
                            const cepFormatado = `${inputCep.slice(0, 5)}-${inputCep.slice(5)}`;
                            input.value = `${cepFormatado} (${dados.localidade})`;
                        }
                        else {
                            erro = 'Cep não encontrado.'
                        }

                    } catch (e) { erro = 'Erro, consulte o nosso suporte: emaia@noovi.com.br' }
                }
                break;

            case 'cpf':
                if (!valor) {
                    erro = 'Preencha o campo.'
                }
                else if (valor.length !== 14) {
                    erro = 'Cpf inválido.'
                }
                else {
                    erro = ''
                }
                break;

            case 'dataNascimento':
                if (!valor) {
                    erro = 'Preencha o campo.'
                }
                else if (!validarIdade(valor)) {
                    erro = 'Apenas para maiores de 18 anos!'
                }
                else {
                    erro = ''
                }
                break;
        }
        if (erro) {
            input.classList.add('active')
            span.innerHTML = `${erro}`
            span.style.display = 'flex'

            formValido = false
            if (!primeiroErro) {
                primeiroErro = input
            }
        }
        else {
            input.classList.remove('active')
            span.innerHTML = ''
            span.style.display = 'none'
        }
    }

    //Valida selects
    for (let selects of selectCampo) {
        const select = document.querySelector(`select[name="${selects}"]`)
        const span = document.querySelector(`.input-group.${selects} .erro-msg`)

        let erro = ''

        const valor = select.value

        if (!valor || valor === "0") {
            erro = 'Selecione uma opção.'
        }
        else {
            erro = ''
        }

        if (erro) {
            select.classList.add('active')
            span.innerHTML = erro
            span.style.display = 'flex'

            formValido = false
            if (!primeiroErro) {
                primeiroErro = select
            }
        } else {
            select.classList.remove('active')
            span.innerHTML = ''
            span.style.display = 'none'
        }
    }


    if (formValido) {
        const nome = document.getElementById("nome").value;
        const sobreNome = document.getElementById("sobreNome").value;
        const telefone = document.getElementById("telefone").value;
        const email = document.getElementById("email").value;
        const rua = document.getElementById("rua").value;
        const numero = document.getElementById("numero").value;
        const bairro = document.getElementById("bairro").value;
        const cep = document.getElementById("cep").value;
        const cpf = document.getElementById("cpf").value;
        const dataNasc = document.getElementById("dataNascimento").value;
        const sexoSelect = document.getElementById("sexo").value;
        const estadoCivil = document.getElementById("estadoCivil").value

        const content1 = document.getElementById("content1")
        const content2 = document.getElementById("content2")

        if (content1.classList.contains('active')) {
            content1.classList.remove('active')
            content2.classList.add('active')
        }

        usuario = [nome, sobreNome, telefone, email, rua, numero, bairro, cep, cpf, dataNasc, sexoSelect, estadoCivil]

    } else {
        primeiroErro.focus()
    }
})

const plano1 = document.getElementById("btnCard1")
const plano2 = document.getElementById("btnCard2")
const plano3 = document.getElementById("btnCard3")

//Botão "Escolher plano" do Plano Básico
plano1.addEventListener("click", () => {

    const pagamento = document.getElementById("pagamento")
    const span = document.querySelector('.erro-pag')

    pagamento.addEventListener('change', () => {
        let erro = ''

        const valor = pagamento.value

        // Exemplo: valor não pode ser vazio ou "0" (opção padrão)
        if (!valor || valor === "0") {
            erro = 'Selecione uma opção.'
        } else {
            erro = ''
        }

        if (erro) {
            pagamento.classList.add('active')
            span.style.display = 'flex'
            span.textContent = erro
        } else {
            pagamento.classList.remove('active')
            span.style.display = 'none'
            span.textContent = ''
        }
    })

    if (!pagamento.value) {
        span.classList.add('active')
        return
    }

    const valorPlano = pagamento.value

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const plano = {
        nome: "Plano Básico",
        valorMensal: "R$ 150,00",
        vencimento: "Todo dia 10",
        contrato: "BSC-2025-001"
    };

    // === Cabeçalho ===
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Clínica Vitalis", 105, 20, { align: "center" });

    doc.setDrawColor(0);
    doc.line(20, 25, 190, 25);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text(plano.nome, 105, 35, { align: "center" });

    // === Retângulo 1: Dados lado a lado ===
    const rect1X = 20;
    const rect1Y = 45;
    const rect1Width = 170;
    const rect1Height = 70;
    doc.rect(rect1X, rect1Y, rect1Width, rect1Height, "S");

    doc.setFontSize(12);
    const lineHeight = 7;

    // Posições para layout lado a lado
    const leftX = rect1X + 5;
    const rightX = rect1X + rect1Width / 2 + 5;
    let currentLeftY = rect1Y + 10;
    let currentRightY = rect1Y + 10;

    // Função para escrever label em negrito + valor
    function writeLabelValue(x, y, label, value) {
        doc.setFont("helvetica", "bold");
        doc.text(label, x, y);
        doc.setFont("helvetica", "normal");
        doc.text(value, x + 35, y);
        return y + lineHeight;
    }

    // === Coluna Esquerda: Dados do Usuário ===
    doc.setFont("helvetica", "bold");
    doc.text("Dados do Beneficiário:", leftX, currentLeftY);
    currentLeftY += lineHeight;
    doc.setFont("helvetica", "normal");

    currentLeftY = writeLabelValue(leftX, currentLeftY, "Nome:", `${usuario[0]} ${usuario[1]}`);
    currentLeftY = writeLabelValue(leftX, currentLeftY, "Telefone:", `${usuario[2]}`);
    currentLeftY = writeLabelValue(leftX, currentLeftY, "Email:", `${usuario[3]}`);
    currentLeftY = writeLabelValue(leftX, currentLeftY, "CEP:", `${usuario[7]}`);
    currentLeftY = writeLabelValue(leftX, currentLeftY, "Nascimento:", `${usuario[9]}`);
    currentLeftY = writeLabelValue(leftX, currentLeftY, "Sexo:", `${usuario[10]}`);
    currentLeftY = writeLabelValue(leftX, currentLeftY, "Bairro:", `${usuario[6]}`);
    currentLeftY = writeLabelValue(leftX, currentLeftY, "Estado Civil:", `${usuario[11]}`);

    // === Coluna Direita: Informações do Plano ===
    doc.setFont("helvetica", "bold");
    doc.text("Informações do Plano:", rightX, currentRightY);
    currentRightY += lineHeight;
    doc.setFont("helvetica", "normal");

    currentRightY = writeLabelValue(rightX, currentRightY, "Plano:", plano.nome);
    currentRightY = writeLabelValue(rightX, currentRightY, "Valor Mensal:", plano.valorMensal);
    currentRightY = writeLabelValue(rightX, currentRightY, "Vencimento:", plano.vencimento);
    currentRightY = writeLabelValue(rightX, currentRightY, "Contrato:", plano.contrato);
    currentRightY = writeLabelValue(rightX, currentRightY, "Pagamento:", valorPlano)

    // === Retângulo 2: Cobertura e Benefícios ===
    const rect2X = 20;
    const rect2Y = rect1Y + rect1Height + 10;
    const rect2Width = 170;
    const rect2Height = 55;
    doc.rect(rect2X, rect2Y, rect2Width, rect2Height, "S");

    const coberturaTexto = [
        "• Consultas médicas básicas (Clínico Geral)",
        "• Exames laboratoriais essenciais (sangue, urina)",
        "• Atendimento emergencial simples",
        "• Limite: até 2 consultas por mês",
        "• Benefícios extras: Telemedicina (consulta online)",
        "• Preço: R$ 150,00 por mês"
    ];

    const coberturaLineHeight = 7;
    let coberturaY = rect2Y + 10;

    doc.setFont("helvetica", "bold");
    doc.text("Cobertura e Benefícios:", rect2X + 5, coberturaY);
    coberturaY += lineHeight;

    doc.setFont("helvetica", "normal");
    for (const linha of coberturaTexto) {
        const linhasQuebradas = doc.splitTextToSize(linha, rect2Width - 10);
        doc.text(linhasQuebradas, rect2X + 5, coberturaY);
        coberturaY += linhasQuebradas.length * coberturaLineHeight;
    }

    // === Rodapé: Termos e Condições ===
    const termosY = rect2Y + rect2Height + 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Termos e Condições", 105, termosY, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const termosTexto = `
Ao aderir ao Plano Básico de Saúde da Clínica Vitalis, o beneficiário concorda com
as coberturas e limitações descritas neste documento. O uso dos serviços está
sujeito às carências e políticas vigentes.

Para informações detalhadas sobre coberturas completas, exclusões e orientações,
consulte o manual do beneficiário ou o site oficial da Clínica Vitalis.
`;
    doc.text(doc.splitTextToSize(termosTexto, 170), 25, termosY + 8);

    doc.save("Plano_Basico_Saude.pdf");

    let planoCliente = "basico"

    localStorage.setItem('planoCliente', planoCliente)

    setTimeout(() => {
        window.location = 'submit.html'
    }, 1500)
});

//Botão "Escolher plano" do Plano Intermediário
plano2.addEventListener("click", () => {

    const pagamento = document.getElementById("pagamento")
    const span = document.querySelector('.erro-pag')

    pagamento.addEventListener('change', () => {
        let erro = ''

        const valor = pagamento.value

        // Exemplo: valor não pode ser vazio ou "0" (opção padrão)
        if (!valor || valor === "0") {
            erro = 'Selecione uma opção.'
        } else {
            erro = ''
        }

        if (erro) {
            pagamento.classList.add('active')
            span.style.display = 'flex'
            span.textContent = erro
        } else {
            pagamento.classList.remove('active')
            span.style.display = 'none'
            span.textContent = ''
        }
    })

    if (!pagamento.value) {
        span.classList.add('active')
        return
    }

    const valorPlano = pagamento.value

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const plano = {
        nome: "Plano Intermediário",
        valorMensal: "R$ 350,00",
        vencimento: "Todo dia 10",
        contrato: "BIC-2026-33"
    };

    // === Cabeçalho ===
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Clínica Vitalis", 105, 20, { align: "center" });

    doc.setDrawColor(0);
    doc.line(20, 25, 190, 25);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text(plano.nome, 105, 35, { align: "center" });

    // === Retângulo 1: Dados lado a lado ===
    const rect1X = 20;
    const rect1Y = 45;
    const rect1Width = 170;
    const rect1Height = 70;
    doc.rect(rect1X, rect1Y, rect1Width, rect1Height, "S");

    doc.setFontSize(12);
    const lineHeight = 7;

    // Posições para layout lado a lado
    const leftX = rect1X + 5;
    const rightX = rect1X + rect1Width / 2 + 5;
    let currentLeftY = rect1Y + 10;
    let currentRightY = rect1Y + 10;

    // Função para escrever label em negrito + valor
    function writeLabelValue(x, y, label, value) {
        doc.setFont("helvetica", "bold");
        doc.text(label, x, y);
        doc.setFont("helvetica", "normal");
        doc.text(value, x + 35, y);
        return y + lineHeight;
    }

    // === Coluna Esquerda: Dados do Usuário ===
    doc.setFont("helvetica", "bold");
    doc.text("Dados do Beneficiário:", leftX, currentLeftY);
    currentLeftY += lineHeight;
    doc.setFont("helvetica", "normal");

    currentLeftY = writeLabelValue(leftX, currentLeftY, "Nome:", `${usuario[0]} ${usuario[1]}`);
    currentLeftY = writeLabelValue(leftX, currentLeftY, "Telefone:", `${usuario[2]}`);
    currentLeftY = writeLabelValue(leftX, currentLeftY, "Email:", `${usuario[3]}`);
    currentLeftY = writeLabelValue(leftX, currentLeftY, "CEP:", `${usuario[7]}`);
    currentLeftY = writeLabelValue(leftX, currentLeftY, "Nascimento:", `${usuario[9]}`);
    currentLeftY = writeLabelValue(leftX, currentLeftY, "Sexo:", `${usuario[10]}`);
    currentLeftY = writeLabelValue(leftX, currentLeftY, "Bairro:", `${usuario[6]}`);
    currentLeftY = writeLabelValue(leftX, currentLeftY, "Estado Civil:", `${usuario[11]}`);

    // === Coluna Direita: Informações do Plano ===
    doc.setFont("helvetica", "bold");
    doc.text("Informações do Plano:", rightX, currentRightY);
    currentRightY += lineHeight;
    doc.setFont("helvetica", "normal");

    currentRightY = writeLabelValue(rightX, currentRightY, "Plano:", plano.nome);
    currentRightY = writeLabelValue(rightX, currentRightY, "Valor Mensal:", plano.valorMensal);
    currentRightY = writeLabelValue(rightX, currentRightY, "Vencimento:", plano.vencimento);
    currentRightY = writeLabelValue(rightX, currentRightY, "Contrato:", plano.contrato);
    currentRightY = writeLabelValue(rightX, currentRightY, "Pagamento:", valorPlano)

    // === Retângulo 2: Cobertura e Benefícios ===
    const rect2X = 20;
    const rect2Y = rect1Y + rect1Height + 10;
    const rect2Width = 170;
    const rect2Height = 55;
    doc.rect(rect2X, rect2Y, rect2Width, rect2Height, "S");

    const coberturaTexto = [
        "• Consultas com especialistas (ex: cardiologista, ortopedista)",
        "• Exames laboratoriais + imagem (raio-x, ultrassom)",
        "• Atendimento emergencial completo",
        "• Consultas ilimitadas dentro da rede",
        "• Atendimento domiciliar, descontos em farmácias parcerias",
        "• Preço: R$ 350,00 por mês"
    ];

    const coberturaLineHeight = 7;
    let coberturaY = rect2Y + 10;

    doc.setFont("helvetica", "bold");
    doc.text("Cobertura e Benefícios:", rect2X + 5, coberturaY);
    coberturaY += lineHeight;

    doc.setFont("helvetica", "normal");
    for (const linha of coberturaTexto) {
        const linhasQuebradas = doc.splitTextToSize(linha, rect2Width - 10);
        doc.text(linhasQuebradas, rect2X + 5, coberturaY);
        coberturaY += linhasQuebradas.length * coberturaLineHeight;
    }

    // === Rodapé: Termos e Condições ===
    const termosY = rect2Y + rect2Height + 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Termos e Condições", 105, termosY, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const termosTexto = `
Ao aderir ao Plano Básico de Saúde da Clínica Vitalis, o beneficiário concorda com
as coberturas e limitações descritas neste documento. O uso dos serviços está
sujeito às carências e políticas vigentes.

Para informações detalhadas sobre coberturas completas, exclusões e orientações,
consulte o manual do beneficiário ou o site oficial da Clínica Vitalis.
`;
    doc.text(doc.splitTextToSize(termosTexto, 170), 25, termosY + 8);

    doc.save("Plano_Intermediario_Saude.pdf");

    let planoCliente = "intermediario"

    localStorage.setItem('planoCliente', planoCliente)

    setTimeout(() => {
        window.location = 'submit.html'
    }, 1500)

});

//Botão "Escolher plano" do Plano Premium
plano3.addEventListener("click", () => {

    const pagamento = document.getElementById("pagamento")
    const span = document.querySelector('.erro-pag')

    pagamento.addEventListener('change', () => {
        let erro = ''

        const valor = pagamento.value

        // Exemplo: valor não pode ser vazio ou "0" (opção padrão)
        if (!valor || valor === "0") {
            erro = 'Selecione uma opção.'
        } else {
            erro = ''
        }

        if (erro) {
            pagamento.classList.add('active')
            span.style.display = 'flex'
            span.textContent = erro
        } else {
            pagamento.classList.remove('active')
            span.style.display = 'none'
            span.textContent = ''
        }
    })

    if (!pagamento.value) {
        span.classList.add('active')
        return
    }

    const valorPlano = pagamento.value

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const plano = {
        nome: "Plano Premium",
        valorMensal: "R$ 700,00",
        vencimento: "Todo dia 10",
        contrato: "PPC-2028-73"
    };

    // === Cabeçalho ===
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Clínica Vitalis", 105, 20, { align: "center" });

    doc.setDrawColor(0);
    doc.line(20, 25, 190, 25);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text(plano.nome, 105, 35, { align: "center" });

    // === Retângulo 1: Dados lado a lado ===
    const rect1X = 20;
    const rect1Y = 45;
    const rect1Width = 170;
    const rect1Height = 70;
    doc.rect(rect1X, rect1Y, rect1Width, rect1Height, "S");

    doc.setFontSize(12);
    const lineHeight = 7;

    // Posições para layout lado a lado
    const leftX = rect1X + 5;
    const rightX = rect1X + rect1Width / 2 + 5;
    let currentLeftY = rect1Y + 10;
    let currentRightY = rect1Y + 10;

    // Função para escrever label em negrito + valor
    function writeLabelValue(x, y, label, value) {
        doc.setFont("helvetica", "bold");
        doc.text(label, x, y);
        doc.setFont("helvetica", "normal");
        doc.text(value, x + 35, y);
        return y + lineHeight;
    }

    // === Coluna Esquerda: Dados do Usuário ===
    doc.setFont("helvetica", "bold");
    doc.text("Dados do Beneficiário:", leftX, currentLeftY);
    currentLeftY += lineHeight;
    doc.setFont("helvetica", "normal");

    currentLeftY = writeLabelValue(leftX, currentLeftY, "Nome:", `${usuario[0]} ${usuario[1]}`);
    currentLeftY = writeLabelValue(leftX, currentLeftY, "Telefone:", `${usuario[2]}`);
    currentLeftY = writeLabelValue(leftX, currentLeftY, "Email:", `${usuario[3]}`);
    currentLeftY = writeLabelValue(leftX, currentLeftY, "CEP:", `${usuario[7]}`);
    currentLeftY = writeLabelValue(leftX, currentLeftY, "Nascimento:", `${usuario[9]}`);
    currentLeftY = writeLabelValue(leftX, currentLeftY, "Sexo:", `${usuario[10]}`);
    currentLeftY = writeLabelValue(leftX, currentLeftY, "Bairro:", `${usuario[6]}`);
    currentLeftY = writeLabelValue(leftX, currentLeftY, "Estado Civil:", `${usuario[11]}`);

    // === Coluna Direita: Informações do Plano ===
    doc.setFont("helvetica", "bold");
    doc.text("Informações do Plano:", rightX, currentRightY);
    currentRightY += lineHeight;
    doc.setFont("helvetica", "normal");

    currentRightY = writeLabelValue(rightX, currentRightY, "Plano:", plano.nome);
    currentRightY = writeLabelValue(rightX, currentRightY, "Valor Mensal:", plano.valorMensal);
    currentRightY = writeLabelValue(rightX, currentRightY, "Vencimento:", plano.vencimento);
    currentRightY = writeLabelValue(rightX, currentRightY, "Contrato:", plano.contrato);
    currentRightY = writeLabelValue(rightX, currentRightY, "Pagamento:", valorPlano)

    // === Retângulo 2: Cobertura e Benefícios ===
    const rect2X = 20;
    const rect2Y = rect1Y + rect1Height + 10;
    const rect2Width = 170;
    const rect2Height = 55;
    doc.rect(rect2X, rect2Y, rect2Width, rect2Height, "S");

    const coberturaTexto = [
        "• Cobertura completa, incluindo procedimentos e cirurgias",
        "• Todos os exames, inclusive avançados (ressonância, tomografia)",
        "• Atendimento emergencial 24h e internação hospitalar",
        "• Consultas e procedimentos ilimitados",
        "• Suporte 24h, nutricionista, psicólogo e app exclusivo",
        "• Preço: R$ 700,00 por mês"
    ];

    const coberturaLineHeight = 7;
    let coberturaY = rect2Y + 10;

    doc.setFont("helvetica", "bold");
    doc.text("Cobertura e Benefícios:", rect2X + 5, coberturaY);
    coberturaY += lineHeight;

    doc.setFont("helvetica", "normal");
    for (const linha of coberturaTexto) {
        const linhasQuebradas = doc.splitTextToSize(linha, rect2Width - 10);
        doc.text(linhasQuebradas, rect2X + 5, coberturaY);
        coberturaY += linhasQuebradas.length * coberturaLineHeight;
    }

    // === Rodapé: Termos e Condições ===
    const termosY = rect2Y + rect2Height + 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Termos e Condições", 105, termosY, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const termosTexto = `
Ao aderir ao Plano Básico de Saúde da Clínica Vitalis, o beneficiário concorda com
as coberturas e limitações descritas neste documento. O uso dos serviços está
sujeito às carências e políticas vigentes.

Para informações detalhadas sobre coberturas completas, exclusões e orientações,
consulte o manual do beneficiário ou o site oficial da Clínica Vitalis.
`;
    doc.text(doc.splitTextToSize(termosTexto, 170), 25, termosY + 8);

    doc.save("Plano_Premium_Saude.pdf");

    let planoCliente = "premium"

    localStorage.setItem('planoCliente', planoCliente)

    setTimeout(() => {
        window.location = 'submit.html'
    }, 1500)

});