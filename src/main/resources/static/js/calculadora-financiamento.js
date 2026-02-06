// Simulador de Financiamento - Equilíbrio Finance

let graficoFinanciamento = null;

// Formatação de moeda
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

// Converter string monetária para número
function converterParaNumero(valorStr) {
    return parseFloat(valorStr.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
}

// Aplicar máscara de moeda
function aplicarMascaraMoeda(input) {
    let valor = input.value.replace(/\D/g, '');
    valor = (parseInt(valor) / 100).toFixed(2);
    input.value = formatarMoeda(valor);
}

// Atualizar valor do prazo
document.getElementById('prazo').addEventListener('input', function() {
    const meses = this.value;
    const anos = Math.floor(meses / 12);
    const mesesRestantes = meses % 12;
    
    let texto = '';
    if (anos > 0) texto += `${anos} ${anos > 1 ? 'anos' : 'ano'}`;
    if (mesesRestantes > 0) texto += (texto ? ' e ' : '') + `${mesesRestantes} ${mesesRestantes > 1 ? 'meses' : 'mês'}`;
    
    document.getElementById('prazoValor').textContent = texto;
});

// Aplicar máscaras nos inputs de valor
document.getElementById('valorBem').addEventListener('blur', function() {
    aplicarMascaraMoeda(this);
});

document.getElementById('entrada').addEventListener('blur', function() {
    aplicarMascaraMoeda(this);
});

// Sugestões de taxa por tipo de financiamento
document.getElementById('tipoFinanciamento').addEventListener('change', function() {
    const tipo = this.value;
    const taxaInput = document.getElementById('taxaJuros');
    
    switch(tipo) {
        case 'imovel':
            taxaInput.value = '9.5';
            break;
        case 'veiculo':
            taxaInput.value = '18.0';
            break;
        case 'pessoal':
            taxaInput.value = '45.0';
            break;
    }
});

// Calcular pelo Sistema PRICE
function calcularPRICE(valorFinanciado, taxaMensal, prazoMeses) {
    const coeficiente = (taxaMensal * Math.pow(1 + taxaMensal, prazoMeses)) / 
                       (Math.pow(1 + taxaMensal, prazoMeses) - 1);
    const parcela = valorFinanciado * coeficiente;
    const totalPago = parcela * prazoMeses;
    const totalJuros = totalPago - valorFinanciado;
    
    // Gerar amortização detalhada
    const amortizacoes = [];
    let saldoDevedor = valorFinanciado;
    
    for (let i = 1; i <= prazoMeses; i++) {
        const juros = saldoDevedor * taxaMensal;
        const amortizacao = parcela - juros;
        saldoDevedor -= amortizacao;
        
        amortizacoes.push({
            mes: i,
            parcela: parcela,
            juros: juros,
            amortizacao: amortizacao,
            saldoDevedor: Math.max(0, saldoDevedor)
        });
    }
    
    return {
        parcela: parcela,
        primeiraParcela: parcela,
        ultimaParcela: parcela,
        totalPago: totalPago,
        totalJuros: totalJuros,
        amortizacoes: amortizacoes
    };
}

// Calcular pelo Sistema SAC
function calcularSAC(valorFinanciado, taxaMensal, prazoMeses) {
    const amortizacaoConstante = valorFinanciado / prazoMeses;
    let saldoDevedor = valorFinanciado;
    let totalJuros = 0;
    
    const amortizacoes = [];
    
    for (let i = 1; i <= prazoMeses; i++) {
        const juros = saldoDevedor * taxaMensal;
        const parcela = amortizacaoConstante + juros;
        
        amortizacoes.push({
            mes: i,
            parcela: parcela,
            juros: juros,
            amortizacao: amortizacaoConstante,
            saldoDevedor: saldoDevedor - amortizacaoConstante
        });
        
        totalJuros += juros;
        saldoDevedor -= amortizacaoConstante;
    }
    
    const primeiraParcela = amortizacoes[0].parcela;
    const ultimaParcela = amortizacoes[prazoMeses - 1].parcela;
    const totalPago = valorFinanciado + totalJuros;
    
    return {
        parcela: primeiraParcela,
        primeiraParcela: primeiraParcela,
        ultimaParcela: ultimaParcela,
        totalPago: totalPago,
        totalJuros: totalJuros,
        amortizacoes: amortizacoes
    };
}

// Criar gráfico de evolução
function criarGraficoFinanciamento(amortizacoes, sistema) {
    const ctx = document.getElementById('graficoFinanciamento');
    
    if (graficoFinanciamento) {
        graficoFinanciamento.destroy();
    }
    
    // Pegar dados a cada 6 meses ou menos se prazo for curto
    const totalMeses = amortizacoes.length;
    const intervalo = totalMeses > 60 ? 6 : (totalMeses > 24 ? 3 : 1);
    
    const labels = [];
    const dadosParcela = [];
    const dadosJuros = [];
    const dadosAmortizacao = [];
    
    for (let i = 0; i < amortizacoes.length; i += intervalo) {
        const item = amortizacoes[i];
        labels.push(`Mês ${item.mes}`);
        dadosParcela.push(item.parcela.toFixed(2));
        dadosJuros.push(item.juros.toFixed(2));
        dadosAmortizacao.push(item.amortizacao.toFixed(2));
    }
    
    // Adicionar último mês se não foi incluído
    if ((amortizacoes.length - 1) % intervalo !== 0) {
        const ultimo = amortizacoes[amortizacoes.length - 1];
        labels.push(`Mês ${ultimo.mes}`);
        dadosParcela.push(ultimo.parcela.toFixed(2));
        dadosJuros.push(ultimo.juros.toFixed(2));
        dadosAmortizacao.push(ultimo.amortizacao.toFixed(2));
    }
    
    graficoFinanciamento = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Valor da Parcela',
                    data: dadosParcela,
                    borderColor: '#FF8C00',
                    backgroundColor: 'rgba(255, 140, 0, 0.1)',
                    tension: 0.1,
                    fill: true
                },
                {
                    label: 'Juros',
                    data: dadosJuros,
                    borderColor: '#dc3545',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    tension: 0.1,
                    fill: true
                },
                {
                    label: 'Amortização',
                    data: dadosAmortizacao,
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    tension: 0.1,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `Evolução do Financiamento - Sistema ${sistema}`,
                    font: { size: 16, weight: 'bold' }
                },
                legend: {
                    display: true,
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': R$ ' + 
                                   parseFloat(context.parsed.y).toLocaleString('pt-BR', {
                                       minimumFractionDigits: 2,
                                       maximumFractionDigits: 2
                                   });
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + value.toLocaleString('pt-BR');
                        }
                    }
                }
            }
        }
    });
}

// Calcular e exibir comparação entre sistemas
function exibirComparacao(valorFinanciado, taxaMensal, prazoMeses) {
    const resultadoPRICE = calcularPRICE(valorFinanciado, taxaMensal, prazoMeses);
    const resultadoSAC = calcularSAC(valorFinanciado, taxaMensal, prazoMeses);
    
    document.getElementById('totalPRICE').textContent = formatarMoeda(resultadoPRICE.totalPago);
    document.getElementById('totalSAC').textContent = formatarMoeda(resultadoSAC.totalPago);
    
    const economia = resultadoPRICE.totalPago - resultadoSAC.totalPago;
    const economiaPercentual = ((economia / resultadoPRICE.totalPago) * 100).toFixed(2);
    
    document.getElementById('economiaInfo').innerHTML = 
        `💰 Economia no SAC: <strong>${formatarMoeda(economia)}</strong> (${economiaPercentual}% menos)`;
    
    document.getElementById('comparacaoSistemas').style.display = 'block';
}

// Processar formulário
document.getElementById('formFinanciamento').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Coletar dados
    const valorBem = converterParaNumero(document.getElementById('valorBem').value);
    const entrada = converterParaNumero(document.getElementById('entrada').value);
    const taxaAnual = parseFloat(document.getElementById('taxaJuros').value);
    const prazoMeses = parseInt(document.getElementById('prazo').value);
    const sistema = document.getElementById('sistema').value;
    
    // Validações
    if (valorBem <= 0) {
        showToast('Informe o valor do bem', 'error');
        return;
    }
    
    if (entrada >= valorBem) {
        showToast('A entrada não pode ser maior ou igual ao valor do bem', 'error');
        return;
    }
    
    if (taxaAnual <= 0) {
        showToast('Informe uma taxa de juros válida', 'error');
        return;
    }
    
    // Calcular
    const valorFinanciado = valorBem - entrada;
    const taxaMensal = Math.pow(1 + (taxaAnual / 100), 1/12) - 1; // Taxa equivalente mensal
    
    let resultado;
    if (sistema === 'price') {
        resultado = calcularPRICE(valorFinanciado, taxaMensal, prazoMeses);
    } else {
        resultado = calcularSAC(valorFinanciado, taxaMensal, prazoMeses);
    }
    
    // Calcular CET aproximado (simplificado: taxa anual equivalente)
    const cetAnual = ((resultado.totalPago / valorFinanciado) ** (1/prazoMeses) - 1) * 12 * 100;
    
    // Exibir resultados
    document.getElementById('valorFinanciado').textContent = formatarMoeda(valorFinanciado);
    document.getElementById('primeiraParcela').textContent = formatarMoeda(resultado.primeiraParcela);
    document.getElementById('ultimaParcela').textContent = formatarMoeda(resultado.ultimaParcela);
    document.getElementById('totalJuros').textContent = formatarMoeda(resultado.totalJuros);
    document.getElementById('totalPagar').textContent = formatarMoeda(resultado.totalPago);
    document.getElementById('cet').textContent = cetAnual.toFixed(2) + '% ao ano';
    
    // Exibir resultado
    document.getElementById('resultado').style.display = 'none';
    document.getElementById('resultadoFinanciamento').style.display = 'block';
    
    // Criar gráfico
    criarGraficoFinanciamento(resultado.amortizacoes, sistema.toUpperCase());
    
    // Exibir comparação
    exibirComparacao(valorFinanciado, taxaMensal, prazoMeses);
    
    // Scroll suave para resultado
    document.getElementById('resultadoFinanciamento').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
    });
});
