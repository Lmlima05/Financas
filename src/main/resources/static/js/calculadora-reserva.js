// ====================================
// CALCULADORA DE RESERVA DE EMERGÊNCIA
// ====================================

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('formReserva').addEventListener('submit', calcularReserva);
});

function atualizarMeses(valor) {
    document.getElementById('mesesValue').textContent = valor;
}

function calcularReserva(e) {
    e.preventDefault();
    
    const custoMensal = parseFloat(document.getElementById('custoMensal').value);
    const meses = parseInt(document.getElementById('meses').value);
    
    if (!isValidNumber(custoMensal) || custoMensal <= 0) {
        showToast('Insira um valor válido para o custo mensal', 'error');
        return;
    }
    
    // Cálculos
    const valorReserva = custoMensal * meses;
    const guardarPorMes = valorReserva / 12;
    
    // Exibir resultado
    document.getElementById('valorReserva').textContent = formatCurrency(valorReserva);
    document.getElementById('duracaoReserva').textContent = `${meses} meses`;
    document.getElementById('guardarMes').textContent = formatCurrency(guardarPorMes);
    
    // Mostrar card de resultado
    const resultadoCard = document.getElementById('resultado');
    resultadoCard.style.display = 'block';
    
    // Scroll suave para o resultado
    resultadoCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    showToast('Reserva calculada com sucesso!', 'success');
}
