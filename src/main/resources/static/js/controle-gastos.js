// ====================================
// CONTROLE DE GASTOS - LocalStorage
// ====================================

let despesas = [];
let chart = null;

// Categorias com ícones
const categoriaIcons = {
    moradia: '🏠',
    transporte: '🚗',
    alimentacao: '🍔',
    saude: '🏥',
    educacao: '📚',
    lazer: '🎮',
    vestuario: '👕',
    outros: '📦'
};

const categoriaNomes = {
    moradia: 'Moradia',
    transporte: 'Transporte',
    alimentacao: 'Alimentação',
    saude: 'Saúde',
    educacao: 'Educação',
    lazer: 'Lazer',
    vestuario: 'Vestuário',
    outros: 'Outros'
};

// ====================================
// INIT
// ====================================
document.addEventListener('DOMContentLoaded', function() {
    carregarDespesas();
    setDataAtual();
    setMesFiltroAtual();
    
    // Event Listeners
    document.getElementById('formDespesa').addEventListener('submit', adicionarDespesa);
    document.getElementById('filtroMes').addEventListener('change', aplicarFiltros);
    document.getElementById('filtroCategoria').addEventListener('change', aplicarFiltros);
    
    atualizarInterface();
});

// ====================================
// LOCALSTORAGE
// ====================================
function carregarDespesas() {
    const data = localStorage.getItem('equilibrio_despesas');
    despesas = data ? JSON.parse(data) : [];
}

function salvarDespesas() {
    localStorage.setItem('equilibrio_despesas', JSON.stringify(despesas));
}

// ====================================
// ADICIONAR DESPESA
// ====================================
function adicionarDespesa(e) {
    e.preventDefault();
    
    const despesa = {
        id: Date.now(),
        descricao: document.getElementById('descricao').value,
        valor: parseFloat(document.getElementById('valor').value),
        data: document.getElementById('data').value,
        categoria: document.getElementById('categoria').value,
        tipo: document.getElementById('tipo').value,
        criado: new Date().toISOString()
    };
    
    despesas.push(despesa);
    salvarDespesas();
    
    // Reset form
    document.getElementById('formDespesa').reset();
    setDataAtual();
    
    // Atualizar interface
    atualizarInterface();
    
    showToast('Despesa adicionada com sucesso!', 'success');
}

// ====================================
// REMOVER DESPESA
// ====================================
function removerDespesa(id) {
    if (confirm('Tem certeza que deseja remover esta despesa?')) {
        despesas = despesas.filter(d => d.id !== id);
        salvarDespesas();
        atualizarInterface();
        showToast('Despesa removida', 'success');
    }
}

// ====================================
// FILTROS
// ====================================
function aplicarFiltros() {
    atualizarInterface();
}

function limparFiltros() {
    document.getElementById('filtroMes').value = '';
    document.getElementById('filtroCategoria').value = '';
    setMesFiltroAtual();
    atualizarInterface();
}

function getDespesasFiltradas() {
    let filtradas = [...despesas];
    
    const filtroMes = document.getElementById('filtroMes').value;
    const filtroCategoria = document.getElementById('filtroCategoria').value;
    
    if (filtroMes) {
        filtradas = filtradas.filter(d => d.data.startsWith(filtroMes));
    }
    
    if (filtroCategoria) {
        filtradas = filtradas.filter(d => d.categoria === filtroCategoria);
    }
    
    return filtradas;
}

// ====================================
// INTERFACE
// ====================================
function atualizarInterface() {
    const filtradas = getDespesasFiltradas();
    
    atualizarResumo(filtradas);
    renderizarLista(filtradas);
    atualizarGrafico(filtradas);
}

function atualizarResumo(despesas) {
    const totalDespesas = despesas.reduce((sum, d) => sum + d.valor, 0);
    
    // Por enquanto receitas é zero (implementar depois)
    const totalReceitas = 0;
    const saldo = totalReceitas - totalDespesas;
    
    document.getElementById('totalReceitas').textContent = formatCurrency(totalReceitas);
    document.getElementById('totalDespesas').textContent = formatCurrency(totalDespesas);
    document.getElementById('saldoMes').textContent = formatCurrency(saldo);
    
    // Mudar cor do saldo
    const saldoElement = document.getElementById('saldoMes');
    saldoElement.style.color = saldo >= 0 ? 'var(--success)' : 'var(--danger)';
}

function renderizarLista(despesas) {
    const lista = document.getElementById('listaDespesas');
    
    if (despesas.length === 0) {
        lista.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">📝</span>
                <p>Nenhuma despesa encontrada</p>
                <p class="empty-subtitle">Adicione uma despesa ou ajuste os filtros</p>
            </div>
        `;
        return;
    }
    
    // Ordenar por data (mais recente primeiro)
    const ordenadas = [...despesas].sort((a, b) => new Date(b.data) - new Date(a.data));
    
    lista.innerHTML = ordenadas.map(despesa => `
        <div class="despesa-item">
            <div class="despesa-info">
                <div class="despesa-icon">${categoriaIcons[despesa.categoria]}</div>
                <div class="despesa-details">
                    <div class="despesa-descricao">${despesa.descricao}</div>
                    <div class="despesa-meta">
                        ${categoriaNomes[despesa.categoria]} • ${formatDate(despesa.data)} • ${despesa.tipo === 'fixa' ? 'Fixa' : 'Variável'}
                    </div>
                </div>
            </div>
            <div class="despesa-valor">${formatCurrency(despesa.valor)}</div>
            <div class="despesa-actions">
                <button class="btn-icon" onclick="removerDespesa(${despesa.id})" title="Remover">
                    🗑️
                </button>
            </div>
        </div>
    `).join('');
}

// ====================================
// GRÁFICO
// ====================================
function atualizarGrafico(despesas) {
    const canvas = document.getElementById('chartDespesas');
    const noDataMsg = document.getElementById('noDataMessage');
    
    if (despesas.length === 0) {
        noDataMsg.style.display = 'block';
        canvas.style.display = 'none';
        if (chart) {
            chart.destroy();
            chart = null;
        }
        return;
    }
    
    noDataMsg.style.display = 'none';
    canvas.style.display = 'block';
    
    // Agrupar por categoria
    const porCategoria = {};
    despesas.forEach(d => {
        if (!porCategoria[d.categoria]) {
            porCategoria[d.categoria] = 0;
        }
        porCategoria[d.categoria] += d.valor;
    });
    
    const labels = Object.keys(porCategoria).map(cat => categoriaNomes[cat]);
    const data = Object.values(porCategoria);
    const colors = [
        '#FF8C00', '#E67E00', '#FF6B6B', '#4ECDC4',
        '#45B7D1', '#96CEB4', '#FFEAA7', '#DFE6E9'
    ];
    
    // Destruir gráfico anterior
    if (chart) {
        chart.destroy();
    }
    
    // Criar novo gráfico
    const ctx = canvas.getContext('2d');
    chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12,
                            family: 'Inter'
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = formatCurrency(context.parsed);
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// ====================================
// EXPORTAR CSV
// ====================================
function exportarDespesas() {
    const filtradas = getDespesasFiltradas();
    
    if (filtradas.length === 0) {
        showToast('Nenhuma despesa para exportar', 'error');
        return;
    }
    
    let csv = 'Data,Descrição,Categoria,Tipo,Valor\n';
    
    filtradas.forEach(d => {
        csv += `${d.data},${d.descricao},${categoriaNomes[d.categoria]},${d.tipo},${d.valor}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `despesas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Despesas exportadas com sucesso!', 'success');
}

// ====================================
// UTILS
// ====================================
function setDataAtual() {
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('data').value = hoje;
}

function setMesFiltroAtual() {
    const hoje = new Date();
    const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`;
    document.getElementById('filtroMes').value = mesAtual;
}
