// Controle de Receitas - Equilíbrio Finance

let receitas = [];
let graficoReceitas = null;
let receitaEditando = null;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    carregarReceitas();
    configurarData();
    configurarEventos();
    popularFiltroMeses();
});

// Carregar receitas do localStorage
function carregarReceitas() {
    const dados = localStorage.getItem('equilibrio_receitas');
    if (dados) {
        receitas = JSON.parse(dados);
        atualizarInterface();
    }
}

// Salvar receitas no localStorage
function salvarReceitas() {
    localStorage.setItem('equilibrio_receitas', JSON.stringify(receitas));
}

// Configurar data atual no input
function configurarData() {
    const dataInput = document.getElementById('data');
    const hoje = new Date();
    dataInput.value = hoje.toISOString().split('T')[0];
    dataInput.max = hoje.toISOString().split('T')[0];
}

// Configurar eventos
function configurarEventos() {
    // Formulário
    document.getElementById('formReceita').addEventListener('submit', adicionarReceita);
    
    // Máscara de valor
    document.getElementById('valor').addEventListener('blur', function() {
        aplicarMascaraMoeda(this);
    });
    
    // Filtros
    document.getElementById('filtroMes').addEventListener('change', aplicarFiltros);
    document.getElementById('filtroCategoria').addEventListener('change', aplicarFiltros);
    
    // Exportar
    document.getElementById('btnExportar').addEventListener('click', exportarReceitas);
}

// Aplicar máscara de moeda
function aplicarMascaraMoeda(input) {
    let valor = input.value.replace(/\D/g, '');
    valor = (parseInt(valor) / 100).toFixed(2);
    input.value = formatCurrency(parseFloat(valor));
}

// Adicionar receita
function adicionarReceita(e) {
    e.preventDefault();
    
    const descricao = document.getElementById('descricao').value.trim();
    const valorStr = document.getElementById('valor').value;
    const categoria = document.getElementById('categoria').value;
    const data = document.getElementById('data').value;
    const recorrente = document.getElementById('recorrente').checked;
    const observacoes = document.getElementById('observacoes').value.trim();
    
    // Converter valor
    const valor = parseFloat(valorStr.replace(/[^\d,]/g, '').replace(',', '.'));
    
    if (!valor || valor <= 0) {
        showToast('Digite um valor válido', 'error');
        return;
    }
    
    if (receitaEditando) {
        // Atualizar receita existente
        const index = receitas.findIndex(r => r.id === receitaEditando);
        if (index !== -1) {
            receitas[index] = {
                ...receitas[index],
                descricao,
                valor,
                categoria,
                data,
                recorrente,
                observacoes
            };
            showToast('Receita atualizada com sucesso!', 'success');
            receitaEditando = null;
        }
    } else {
        // Criar nova receita
        const receita = {
            id: Date.now(),
            descricao,
            valor,
            categoria,
            data,
            recorrente,
            observacoes,
            criadoEm: new Date().toISOString()
        };
        
        receitas.push(receita);
        showToast('Receita adicionada com sucesso!', 'success');
    }
    
    salvarReceitas();
    atualizarInterface();
    limparFormulario();
}

// Limpar formulário
function limparFormulario() {
    document.getElementById('formReceita').reset();
    configurarData();
    receitaEditando = null;
    
    const btnSubmit = document.querySelector('#formReceita button[type="submit"]');
    btnSubmit.textContent = 'Adicionar Receita';
}

// Remover receita
function removerReceita(id) {
    if (!confirm('Tem certeza que deseja remover esta receita?')) {
        return;
    }
    
    receitas = receitas.filter(r => r.id !== id);
    salvarReceitas();
    atualizarInterface();
    showToast('Receita removida com sucesso!', 'success');
}

// Editar receita
function editarReceita(id) {
    const receita = receitas.find(r => r.id === id);
    if (!receita) return;
    
    document.getElementById('descricao').value = receita.descricao;
    document.getElementById('valor').value = formatCurrency(receita.valor);
    document.getElementById('categoria').value = receita.categoria;
    document.getElementById('data').value = receita.data;
    document.getElementById('recorrente').checked = receita.recorrente;
    document.getElementById('observacoes').value = receita.observacoes || '';
    
    receitaEditando = id;
    
    const btnSubmit = document.querySelector('#formReceita button[type="submit"]');
    btnSubmit.textContent = 'Atualizar Receita';
    
    // Scroll para o formulário
    document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth' });
}

// Atualizar interface
function atualizarInterface() {
    const receitasFiltradas = aplicarFiltros();
    atualizarResumo(receitasFiltradas);
    atualizarGrafico(receitasFiltradas);
    renderizarLista(receitasFiltradas);
}

// Aplicar filtros
function aplicarFiltros() {
    const filtroMes = document.getElementById('filtroMes').value;
    const filtroCategoria = document.getElementById('filtroCategoria').value;
    
    let receitasFiltradas = [...receitas];
    
    // Filtrar por mês
    if (filtroMes !== 'todos') {
        receitasFiltradas = receitasFiltradas.filter(r => {
            const mesAno = r.data.substring(0, 7);
            return mesAno === filtroMes;
        });
    }
    
    // Filtrar por categoria
    if (filtroCategoria !== 'todas') {
        receitasFiltradas = receitasFiltradas.filter(r => r.categoria === filtroCategoria);
    }
    
    return receitasFiltradas;
}

// Atualizar resumo
function atualizarResumo(receitasFiltradas) {
    const total = receitasFiltradas.reduce((sum, r) => sum + r.valor, 0);
    const fontes = new Set(receitasFiltradas.map(r => r.categoria)).size;
    
    // Calcular média mensal (últimos 6 meses)
    const hoje = new Date();
    const seisMesesAtras = new Date(hoje.getFullYear(), hoje.getMonth() - 6, 1);
    
    const receitasRecentes = receitas.filter(r => {
        const dataReceita = new Date(r.data);
        return dataReceita >= seisMesesAtras;
    });
    
    const mesesComReceitas = new Set(receitasRecentes.map(r => r.data.substring(0, 7))).size;
    const totalRecente = receitasRecentes.reduce((sum, r) => sum + r.valor, 0);
    const media = mesesComReceitas > 0 ? totalRecente / mesesComReceitas : 0;
    
    document.getElementById('totalReceitas').textContent = formatCurrency(total);
    document.getElementById('totalFontes').textContent = fontes;
    document.getElementById('mediaMensal').textContent = formatCurrency(media);
}

// Atualizar gráfico
function atualizarGrafico(receitasFiltradas) {
    const ctx = document.getElementById('graficoReceitas');
    
    if (graficoReceitas) {
        graficoReceitas.destroy();
    }
    
    // Agrupar por categoria
    const porCategoria = {};
    receitasFiltradas.forEach(r => {
        porCategoria[r.categoria] = (porCategoria[r.categoria] || 0) + r.valor;
    });
    
    const categorias = {
        'salario': { label: 'Salário', cor: '#3B82F6' },
        'freelance': { label: 'Freelance', cor: '#8B5CF6' },
        'investimentos': { label: 'Investimentos', cor: '#10B981' },
        'aluguel': { label: 'Aluguel', cor: '#F59E0B' },
        'vendas': { label: 'Vendas', cor: '#EF4444' },
        'bonus': { label: 'Bônus', cor: '#EC4899' },
        'pensao': { label: 'Pensão/Aposentadoria', cor: '#6366F1' },
        'outras': { label: 'Outras', cor: '#6B7280' }
    };
    
    const labels = [];
    const dados = [];
    const cores = [];
    
    Object.entries(porCategoria).forEach(([cat, valor]) => {
        labels.push(categorias[cat].label);
        dados.push(valor.toFixed(2));
        cores.push(categorias[cat].cor);
    });
    
    if (dados.length === 0) {
        labels.push('Sem dados');
        dados.push(1);
        cores.push('#E5E7EB');
    }
    
    graficoReceitas = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: dados,
                backgroundColor: cores,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const valor = parseFloat(context.raw);
                            const total = context.dataset.data.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
                            const percentual = ((valor / total) * 100).toFixed(1);
                            return `${context.label}: ${formatCurrency(valor)} (${percentual}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Renderizar lista
function renderizarLista(receitasFiltradas) {
    const container = document.getElementById('listaReceitas');
    
    if (receitasFiltradas.length === 0) {
        container.innerHTML = `
            <div class="lista-vazia">
                <p>Nenhuma receita encontrada</p>
                <p class="texto-secundario">Ajuste os filtros ou adicione uma nova receita</p>
            </div>
        `;
        return;
    }
    
    // Ordenar por data (mais recentes primeiro)
    const ordenadas = [...receitasFiltradas].sort((a, b) => {
        return new Date(b.data) - new Date(a.data);
    });
    
    const categoriaIcons = {
        'salario': '💼',
        'freelance': '💻',
        'investimentos': '📈',
        'aluguel': '🏠',
        'vendas': '🛒',
        'bonus': '🎁',
        'pensao': '👥',
        'outras': '💵'
    };
    
    container.innerHTML = ordenadas.map(receita => `
        <div class="item-receita">
            <div class="item-info">
                <div class="item-categoria">${categoriaIcons[receita.categoria]}</div>
                <div class="item-detalhes">
                    <div class="item-header">
                        <strong>${receita.descricao}</strong>
                        ${receita.recorrente ? '<span class="badge-recorrente">Recorrente</span>' : ''}
                    </div>
                    <small class="item-data">${formatDate(receita.data)}</small>
                    ${receita.observacoes ? `<p class="item-obs">${receita.observacoes}</p>` : ''}
                </div>
            </div>
            <div class="item-acoes">
                <span class="item-valor">${formatCurrency(receita.valor)}</span>
                <div class="item-botoes">
                    <button onclick="editarReceita(${receita.id})" class="btn-icon" title="Editar">
                        ✏️
                    </button>
                    <button onclick="removerReceita(${receita.id})" class="btn-icon" title="Remover">
                        🗑️
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Popular filtro de meses
function popularFiltroMeses() {
    const select = document.getElementById('filtroMes');
    const meses = new Set();
    
    receitas.forEach(r => {
        meses.add(r.data.substring(0, 7));
    });
    
    const mesesOrdenados = Array.from(meses).sort().reverse();
    
    mesesOrdenados.forEach(mesAno => {
        const [ano, mes] = mesAno.split('-');
        const data = new Date(ano, mes - 1);
        const nomeMes = data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        
        const option = document.createElement('option');
        option.value = mesAno;
        option.textContent = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);
        select.appendChild(option);
    });
}

// Exportar para CSV
function exportarReceitas() {
    if (receitas.length === 0) {
        showToast('Não há receitas para exportar', 'error');
        return;
    }
    
    const receitasFiltradas = aplicarFiltros();
    
    if (receitasFiltradas.length === 0) {
        showToast('Nenhuma receita encontrada com os filtros aplicados', 'error');
        return;
    }
    
    // Criar CSV
    let csv = 'Data,Descrição,Categoria,Valor,Recorrente,Observações\n';
    
    receitasFiltradas.forEach(r => {
        const linha = [
            r.data,
            `"${r.descricao}"`,
            r.categoria,
            r.valor.toFixed(2).replace('.', ','),
            r.recorrente ? 'Sim' : 'Não',
            `"${r.observacoes || ''}"`
        ].join(',');
        csv += linha + '\n';
    });
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `receitas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Receitas exportadas com sucesso!', 'success');
}
