// Função para formatar valores monetários
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Função para formatar números com separador de milhares
function formatarNumero(valor) {
    return valor.toLocaleString('pt-BR');
}

// Função para calcular a produção diária de energia
function calcularProducaoDiaria(potencia, horasSol) {
    return potencia * horasSol;
}

// Função para calcular a produção mensal
function calcularProducaoMensal(producaoDiaria) {
    return producaoDiaria * 30; // Considerando 30 dias
}

// Função para calcular a economia mensal
function calcularEconomiaMensal(producaoMensal, tarifa) {
    return producaoMensal * tarifa;
}

// Função para calcular o tempo de retorno do investimento (payback)
function calcularPayback(custoInstalacao, economiaMensal) {
    return custoInstalacao / economiaMensal;
}

// Função para calcular a redução de CO2
// Considerando que cada kWh de energia elétrica convencional emite aproximadamente 0.084 kg de CO2
function calcularReducaoCO2(producaoMensal) {
    return producaoMensal * 0.084;
}

// Função para atualizar os resultados na interface
function atualizarResultados(resultados) {
    // Atualizar economia mensal
    document.querySelector('#resultadoEconomia .valor').textContent = 
        formatarMoeda(resultados.economiaMensal);

    // Atualizar produção mensal
    document.querySelector('#resultadoProducao .valor').textContent = 
        formatarNumero(resultados.producaoMensal) + ' kWh';

    // Atualizar tempo de retorno
    const paybackMeses = resultados.payback;
    const paybackAnos = Math.floor(paybackMeses / 12);
    const paybackMesesRestantes = Math.round(paybackMeses % 12);
    
    let paybackTexto = '';
    if (paybackAnos > 0) {
        paybackTexto += `${paybackAnos} ${paybackAnos === 1 ? 'ano' : 'anos'}`;
        if (paybackMesesRestantes > 0) {
            paybackTexto += ` e ${paybackMesesRestantes} ${paybackMesesRestantes === 1 ? 'mês' : 'meses'}`;
        }
    } else {
        paybackTexto = `${paybackMesesRestantes} ${paybackMesesRestantes === 1 ? 'mês' : 'meses'}`;
    }
    
    document.querySelector('#resultadoPayback .valor').textContent = paybackTexto;

    // Atualizar redução de CO2
    document.querySelector('#resultadoCO2 .valor').textContent = 
        formatarNumero(resultados.reducaoCO2) + ' kg/mês';
}

// Função para animar os valores nos cards de resultado
function animarValores(valoresIniciais, valoresFinais, duracao = 1000) {
    const cards = document.querySelectorAll('.resultado-card');
    const inicio = performance.now();

    function atualizarValores(tempoAtual) {
        const progresso = (tempoAtual - inicio) / duracao;
        
        if (progresso < 1) {
            cards.forEach(card => {
                const valorElement = card.querySelector('.valor');
                const valorInicial = valoresIniciais[card.id];
                const valorFinal = valoresFinais[card.id];
                
                if (card.id === 'resultadoEconomia') {
                    valorElement.textContent = formatarMoeda(
                        valorInicial + (valorFinal - valorInicial) * progresso
                    );
                } else if (card.id === 'resultadoProducao') {
                    valorElement.textContent = formatarNumero(
                        valorInicial + (valorFinal - valorInicial) * progresso
                    ) + ' kWh';
                } else if (card.id === 'resultadoPayback') {
                    const paybackAtual = valorInicial + (valorFinal - valorInicial) * progresso;
                    const anos = Math.floor(paybackAtual / 12);
                    const meses = Math.round(paybackAtual % 12);
                    
                    let texto = '';
                    if (anos > 0) {
                        texto += `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
                        if (meses > 0) {
                            texto += ` e ${meses} ${meses === 1 ? 'mês' : 'meses'}`;
                        }
                    } else {
                        texto = `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
                    }
                    
                    valorElement.textContent = texto;
                } else if (card.id === 'resultadoCO2') {
                    valorElement.textContent = formatarNumero(
                        valorInicial + (valorFinal - valorInicial) * progresso
                    ) + ' kg/mês';
                }
            });

            requestAnimationFrame(atualizarValores);
        } else {
            atualizarResultados(valoresFinais);
        }
    }

    requestAnimationFrame(atualizarValores);
}

// Event listener para o formulário
document.getElementById('calculadoraForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Obter valores do formulário
    const consumoMensal = parseFloat(document.getElementById('consumoMensal').value);
    const tarifaEnergia = parseFloat(document.getElementById('tarifaEnergia').value);
    const potenciaSistema = parseFloat(document.getElementById('potenciaSistema').value);
    const horasSol = parseFloat(document.getElementById('horasSol').value);
    const custoInstalacao = parseFloat(document.getElementById('custoInstalacao').value);

    // Calcular resultados
    const producaoDiaria = calcularProducaoDiaria(potenciaSistema, horasSol);
    const producaoMensal = calcularProducaoMensal(producaoDiaria);
    const economiaMensal = calcularEconomiaMensal(producaoMensal, tarifaEnergia);
    const payback = calcularPayback(custoInstalacao, economiaMensal);
    const reducaoCO2 = calcularReducaoCO2(producaoMensal);

    // Preparar valores para animação
    const valoresIniciais = {
        'resultadoEconomia': 0,
        'resultadoProducao': 0,
        'resultadoPayback': 0,
        'resultadoCO2': 0
    };

    const valoresFinais = {
        'resultadoEconomia': economiaMensal,
        'resultadoProducao': producaoMensal,
        'resultadoPayback': payback,
        'resultadoCO2': reducaoCO2
    };

    // Animar os valores
    animarValores(valoresIniciais, valoresFinais);

    // Adicionar classe de animação ao botão
    const botao = this.querySelector('.calcular-button');
    botao.classList.add('calculando');
    
    // Remover classe após a animação
    setTimeout(() => {
        botao.classList.remove('calculando');
    }, 1000);
}); 