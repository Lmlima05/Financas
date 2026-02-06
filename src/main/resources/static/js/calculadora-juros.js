// ====================================
// CALCULADORA DE JUROS COMPOSTOS
// ====================================

let chartJuros = null;

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('formJuros').addEventListener('submit', calcularJurosCompostos);
});

function atualizarPeriodo(valor) {
    document.getElementById('periodoValue').textContent = valor;
}

function calcularJurosCompostos(e) {
    e.preventDefault();
    
    const valorInicial = parseFloat(document.getElementById('valorInicial').value);
    const aporteMensal = parseFloat(document.getElementById('aporteMensal').value) || 0;
    const taxaAnual = parseFloat(document.getElementById('taxaAnual').value);
    const periodoAnos = parseInt(document.getElementById('periodo').value);
    
    if (!isValidNumber(valorInicial) || valorInicial < 0) {
        showToast('Insira um valor inicial válido', 'error');
        return;
    }
    
    if (!isValidNumber(taxaAnual) || taxaAnual <= 0) {
        showToast('Insira uma taxa de juros válida', 'error');
        return;
    }
    
    // Converter taxa anual para mensal
    const taxaMensal = Math.pow(1 + (taxaAnual / 100), 1/12) - 1;
    const periodoMeses = periodoAnos * 12;
    
    // Calcular evolução mês a mês
    let saldo = valorInicial;
    const evolucao = [{ mes: 0, saldo: valorInicial, investido: valorInicial }];
    let totalInvestido = valorInicial;
    
    for (let mes = 1; mes <= periodoMeses; mes++) {
        // Aplicar juros
        saldo = saldo * (1 + taxaMensal);
        
        // Adicionar aporte
        saldo += aporteMensal;
        totalInvestido += aporteMensal;
        
        // Guardar evolução (só a cada 6 meses para não sobrecarregar o gráfico)
        if (mes % 6 === 0 || mes === periodoMeses) {
            evolucao.push({ 
                mes: mes, 
                saldo: saldo,
                investido: totalInvestido
            });
        }
    }
    
    const valorFinal = saldo;
    const jurosGanhos = valorFinal - totalInvestido;
    const rentabilidade = ((valorFinal / totalInvestido - 1) * 100);
    
    // Atualizar interface
    document.getElementById('valorFinal').textContent = formatCurrency(valorFinal);
    document.getElementById('totalInvestido').textContent = formatCurrency(totalInvestido);
    document.getElementById('jurosGanhos').textContent = formatCurrency(jurosGanhos);
    document.getElementById('rentabilidade').textContent = rentabilidade.toFixed(1) + '%';
    
    // Criar gráfico
    criarGraficoEvolucao(evolucao);
    
    // Mostrar resultado
    const resultadoCard = document.getElementById('resultado');
    resultadoCard.style.display = 'block';
    
    // Scroll suave
    resultadoCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    showToast('Simulação calculada com sucesso!', 'success');
}

function criarGraficoEvolucao(evolucao) {
    const canvas = document.getElementById('chartJuros');
    const ctx = canvas.getContext('2d');
    
    // Destruir gráfico anterior
    if (chartJuros) {
        chartJuros.destroy();
    }
    
    // Preparar dados
    const labels = evolucao.map(e => {
        if (e.mes === 0) return 'Início';
        const anos = Math.floor(e.mes / 12);
        const meses = e.mes % 12;
        if (meses === 0) return `${anos}a`;
        return `${anos}a ${meses}m`;
    });
    
    const dadosSaldo = evolucao.map(e => e.saldo);
    const dadosInvestido = evolucao.map(e => e.investido);
    
    // Criar gráfico
    chartJuros = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Valor Total',
                    data: dadosSaldo,
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Total Investido',
                    data: dadosInvestido,
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 12,
                            family: 'Inter'
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + (value / 1000).toFixed(0) + 'k';
                        }
                    }
                }
            }
        }
    });
}
