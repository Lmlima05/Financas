// ====================================
// CALCULADORA DE ORÇAMENTO - REGRA 50-30-20
// ====================================

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('formOrcamento').addEventListener('submit', calcularOrcamento);
    document.getElementById('metodo').addEventListener('change', atualizarDescricoes);
});

function atualizarDescricoes() {
    const metodo = document.getElementById('metodo').value;
    let regra;
    
    switch(metodo) {
        case '60-20-20':
            regra = { essenciais: 60, lazer: 20, poupanca: 20 };
            break;
        case '70-20-10':
            regra = { essenciais: 70, lazer: 20, poupanca: 10 };
            break;
        default:
            regra = { essenciais: 50, lazer: 30, poupanca: 20 };
    }
    
    // Atualizar percentuais na interface (se resultado estiver visível)
    if (document.getElementById('resultado').style.display !== 'none') {
        document.getElementById('percEssenciais').textContent = regra.essenciais;
        document.getElementById('percLazer').textContent = regra.lazer;
        document.getElementById('percPoupanca').textContent = regra.poupanca;
    }
}

function calcularOrcamento(e) {
    e.preventDefault();
    
    const salario = parseFloat(document.getElementById('salario').value);
    const metodo = document.getElementById('metodo').value;
    
    if (!isValidNumber(salario) || salario <= 0) {
        showToast('Insira um salário válido', 'error');
        return;
    }
    
    // Definir regra baseada no método
    let regra;
    let dicaTexto;
    
    switch(metodo) {
        case '60-20-20':
            regra = { essenciais: 0.60, lazer: 0.20, poupanca: 0.20 };
            dicaTexto = 'Esta regra é ideal para quem tem custos fixos mais altos, como aluguel ou financiamento.';
            break;
        case '70-20-10':
            regra = { essenciais: 0.70, lazer: 0.20, poupanca: 0.10 };
            dicaTexto = 'Esta regra é mais conservadora. Recomendada se você está pagando dívidas ou tem muitos gastos essenciais.';
            break;
        default:
            regra = { essenciais: 0.50, lazer: 0.30, poupanca: 0.20 };
            dicaTexto = 'A regra 50-30-20 é equilibrada e funciona bem para a maioria das pessoas. Ajuste conforme sua realidade!';
    }
    
    // Calcular valores
    const valorEssenciais = salario * regra.essenciais;
    const valorLazer = salario * regra.lazer;
    const valorPoupanca = salario * regra.poupanca;
    
    // Atualizar interface
    document.getElementById('valorSalario').textContent = formatCurrency(salario);
    
    document.getElementById('percEssenciais').textContent = (regra.essenciais * 100).toFixed(0);
    document.getElementById('valorEssenciais').textContent = formatCurrency(valorEssenciais);
    
    document.getElementById('percLazer').textContent = (regra.lazer * 100).toFixed(0);
    document.getElementById('valorLazer').textContent = formatCurrency(valorLazer);
    
    document.getElementById('percPoupanca').textContent = (regra.poupanca * 100).toFixed(0);
    document.getElementById('valorPoupanca').textContent = formatCurrency(valorPoupanca);
    
    document.getElementById('dicaTexto').textContent = dicaTexto;
    
    // Mostrar resultado
    const resultadoCard = document.getElementById('resultado');
    resultadoCard.style.display = 'block';
    
    // Scroll suave para o resultado
    resultadoCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    showToast('Orçamento calculado com sucesso!', 'success');
}
