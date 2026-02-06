// Controle de Metas Financeiras - Equilíbrio Finance

let metas = [];
let metaEditando = null;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    carregarMetas();
    configurarPrazoMinimo();
    configurarEventos();
});

// Carregar metas do localStorage
function carregarMetas() {
    const dados = localStorage.getItem('equilibrio_metas');
    if (dados) {
        metas = JSON.parse(dados);
        atualizarInterface();
    }
}

// Salvar metas no localStorage
function salvarMetas() {
    localStorage.setItem('equilibrio_metas', JSON.stringify(metas));
}

// Configurar prazo mínimo (hoje)
function configurarPrazoMinimo() {
    const prazoInput = document.getElementById('prazo');
    const hoje = new Date();
    prazoInput.min = hoje.toISOString().split('T')[0];
}

// Configurar eventos
function configurarEventos() {
    // Formulário
    document.getElementById('formMeta').addEventListener('submit', adicionarMeta);
    
    // Máscaras de valor
    document.getElementById('valorAlvo').addEventListener('blur', function() {
        aplicarMascaraMoeda(this);
    });
    
    document.getElementById('valorAtual').addEventListener('blur', function() {
        aplicarMascaraMoeda(this);
    });
    
    // Filtros
    document.getElementById('filtroStatus').addEventListener('change', renderizarLista);
    document.getElementById('filtroCategoria').addEventListener('change', renderizarLista);
}

// Aplicar máscara de moeda
function aplicarMascaraMoeda(input) {
    let valor = input.value.replace(/\D/g, '');
    valor = (parseInt(valor) / 100).toFixed(2);
    input.value = formatCurrency(parseFloat(valor));
}

// Adicionar ou atualizar meta
function adicionarMeta(e) {
    e.preventDefault();
    
    const nome = document.getElementById('nomeMeta').value.trim();
    const valorAlvoStr = document.getElementById('valorAlvo').value;
    const valorAtualStr = document.getElementById('valorAtual').value;
    const prazo = document.getElementById('prazo').value;
    const categoria = document.getElementById('categoria').value;
    const descricao = document.getElementById('descricao').value.trim();
    
    // Converter valores
    const valorAlvo = parseFloat(valorAlvoStr.replace(/[^\d,]/g, '').replace(',', '.'));
    const valorAtual = parseFloat(valorAtualStr.replace(/[^\d,]/g, '').replace(',', '.'));
    
    if (!valorAlvo || valorAlvo <= 0) {
        showToast('Digite um valor alvo válido', 'error');
        return;
    }
    
    if (valorAtual < 0) {
        showToast('O valor atual não pode ser negativo', 'error');
        return;
    }
    
    if (valorAtual > valorAlvo) {
        showToast('O valor atual não pode ser maior que o valor alvo', 'error');
        return;
    }
    
    if (metaEditando) {
        // Atualizar meta existente
        const index = metas.findIndex(m => m.id === metaEditando);
        if (index !== -1) {
            const concluida = valorAtual >= valorAlvo;
            metas[index] = {
                ...metas[index],
                nome,
                valorAlvo,
                valorAtual,
                prazo,
                categoria,
                descricao,
                concluida,
                dataAtualizacao: new Date().toISOString()
            };
            showToast('Meta atualizada com sucesso!', 'success');
            metaEditando = null;
        }
    } else {
        // Criar nova meta
        const concluida = valorAtual >= valorAlvo;
        const meta = {
            id: Date.now(),
            nome,
            valorAlvo,
            valorAtual,
            prazo,
            categoria,
            descricao,
            concluida,
            criadaEm: new Date().toISOString(),
            dataAtualizacao: new Date().toISOString()
        };
        
        metas.push(meta);
        showToast('Meta criada com sucesso!', 'success');
    }
    
    salvarMetas();
    atualizarInterface();
    limparFormulario();
}

// Limpar formulário
function limparFormulario() {
    document.getElementById('formMeta').reset();
    document.getElementById('valorAtual').value = 'R$ 0,00';
    configurarPrazoMinimo();
    metaEditando = null;
    
    const btnSubmit = document.querySelector('#formMeta button[type="submit"]');
    btnSubmit.textContent = 'Criar Meta';
}

// Remover meta
function removerMeta(id) {
    if (!confirm('Tem certeza que deseja remover esta meta?')) {
        return;
    }
    
    metas = metas.filter(m => m.id !== id);
    salvarMetas();
    atualizarInterface();
    showToast('Meta removida com sucesso!', 'success');
}

// Editar meta
function editarMeta(id) {
    const meta = metas.find(m => m.id === id);
    if (!meta) return;
    
    document.getElementById('nomeMeta').value = meta.nome;
    document.getElementById('valorAlvo').value = formatCurrency(meta.valorAlvo);
    document.getElementById('valorAtual').value = formatCurrency(meta.valorAtual);
    document.getElementById('prazo').value = meta.prazo;
    document.getElementById('categoria').value = meta.categoria;
    document.getElementById('descricao').value = meta.descricao || '';
    
    metaEditando = id;
    
    const btnSubmit = document.querySelector('#formMeta button[type="submit"]');
    btnSubmit.textContent = 'Atualizar Meta';
    
    // Scroll para o formulário
    document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth' });
}

// Adicionar progresso
function adicionarProgresso(id) {
    const valorStr = prompt('Quanto você guardou para esta meta?');
    if (!valorStr) return;
    
    const valor = parseFloat(valorStr.replace(/[^\d,]/g, '').replace(',', '.'));
    
    if (!valor || valor <= 0) {
        showToast('Digite um valor válido', 'error');
        return;
    }
    
    const index = metas.findIndex(m => m.id === id);
    if (index !== -1) {
        metas[index].valorAtual += valor;
        
        // Verificar se atingiu a meta
        if (metas[index].valorAtual >= metas[index].valorAlvo) {
            metas[index].concluida = true;
            metas[index].dataConclusao = new Date().toISOString();
            showToast('🎉 Parabéns! Meta concluída!', 'success');
        } else {
            showToast('Progresso adicionado com sucesso!', 'success');
        }
        
        metas[index].dataAtualizacao = new Date().toISOString();
        salvarMetas();
        atualizarInterface();
    }
}

// Atualizar interface
function atualizarInterface() {
    atualizarResumo();
    renderizarLista();
}

// Atualizar resumo
function atualizarResumo() {
    const metasAtivas = metas.filter(m => !m.concluida);
    const metasConcluidas = metas.filter(m => m.concluida);
    
    const valorTotal = metas.reduce((sum, m) => sum + m.valorAlvo, 0);
    const valorConquistado = metas.reduce((sum, m) => sum + m.valorAtual, 0);
    
    document.getElementById('totalMetas').textContent = metasAtivas.length;
    document.getElementById('valorTotalMetas').textContent = formatCurrency(valorTotal);
    document.getElementById('valorConquistado').textContent = formatCurrency(valorConquistado);
    document.getElementById('metasConcluidas').textContent = metasConcluidas.length;
}

// Renderizar lista
function renderizarLista() {
    const filtroStatus = document.getElementById('filtroStatus').value;
    const filtroCategoria = document.getElementById('filtroCategoria').value;
    
    let metasFiltradas = [...metas];
    
    // Filtrar por status
    if (filtroStatus === 'ativas') {
        metasFiltradas = metasFiltradas.filter(m => !m.concluida);
    } else if (filtroStatus === 'concluidas') {
        metasFiltradas = metasFiltradas.filter(m => m.concluida);
    }
    
    // Filtrar por categoria
    if (filtroCategoria !== 'todas') {
        metasFiltradas = metasFiltradas.filter(m => m.categoria === filtroCategoria);
    }
    
    const container = document.getElementById('listaMetas');
    
    if (metasFiltradas.length === 0) {
        container.innerHTML = `
            <div class="lista-vazia">
                <p>Nenhuma meta encontrada</p>
                <p class="texto-secundario">Ajuste os filtros ou crie uma nova meta</p>
            </div>
        `;
        return;
    }
    
    // Ordenar: não concluídas primeiro, depois por prazo mais próximo
    const ordenadas = metasFiltradas.sort((a, b) => {
        if (a.concluida !== b.concluida) {
            return a.concluida ? 1 : -1;
        }
        return new Date(a.prazo) - new Date(b.prazo);
    });
    
    const categoriaIcons = {
        'viagem': '✈️',
        'casa': '🏠',
        'veiculo': '🚗',
        'reserva': '🏦',
        'estudos': '📚',
        'aposentadoria': '👴',
        'investimento': '📈',
        'outras': '🎯'
    };
    
    container.innerHTML = ordenadas.map(meta => {
        const progresso = (meta.valorAtual / meta.valorAlvo) * 100;
        const falta = meta.valorAlvo - meta.valorAtual;
        
        // Calcular dias restantes
        const hoje = new Date();
        const prazoDate = new Date(meta.prazo);
        const diasRestantes = Math.ceil((prazoDate - hoje) / (1000 * 60 * 60 * 24));
        
        // Calcular valor mensal necessário
        const mesesRestantes = Math.max(1, Math.ceil(diasRestantes / 30));
        const valorMensal = falta / mesesRestantes;
        
        let statusClass = '';
        let statusText = '';
        
        if (meta.concluida) {
            statusClass = 'status-concluida';
            statusText = '✅ Concluída';
        } else if (diasRestantes < 0) {
            statusClass = 'status-atrasada';
            statusText = '⚠️ Prazo expirado';
        } else if (diasRestantes < 30) {
            statusClass = 'status-urgente';
            statusText = `⏰ ${diasRestantes} dias restantes`;
        } else {
            statusClass = 'status-normal';
            statusText = `📅 ${Math.floor(diasRestantes / 30)} meses restantes`;
        }
        
        return `
            <div class="meta-card ${meta.concluida ? 'meta-concluida' : ''}">
                <div class="meta-header">
                    <div class="meta-titulo">
                        <span class="meta-icon">${categoriaIcons[meta.categoria]}</span>
                        <div>
                            <h3>${meta.nome}</h3>
                            ${meta.descricao ? `<p class="meta-descricao">${meta.descricao}</p>` : ''}
                        </div>
                    </div>
                    <span class="meta-status ${statusClass}">${statusText}</span>
                </div>
                
                <div class="meta-valores">
                    <div class="valor-item">
                        <span class="valor-label">Guardado</span>
                        <span class="valor-destaque">${formatCurrency(meta.valorAtual)}</span>
                    </div>
                    <div class="valor-item">
                        <span class="valor-label">Meta</span>
                        <span class="valor-destaque">${formatCurrency(meta.valorAlvo)}</span>
                    </div>
                    ${!meta.concluida ? `
                    <div class="valor-item">
                        <span class="valor-label">Falta</span>
                        <span class="valor-destaque">${formatCurrency(falta)}</span>
                    </div>
                    ` : ''}
                </div>
                
                <div class="meta-progresso">
                    <div class="progresso-info">
                        <span>${progresso.toFixed(1)}% alcançado</span>
                        ${!meta.concluida && valorMensal > 0 ? `
                        <span class="texto-secundario">Guardar ${formatCurrency(valorMensal)}/mês</span>
                        ` : ''}
                    </div>
                    <div class="barra-progresso">
                        <div class="barra-preenchida" style="width: ${Math.min(100, progresso)}%"></div>
                    </div>
                </div>
                
                <div class="meta-acoes">
                    ${!meta.concluida ? `
                    <button onclick="adicionarProgresso(${meta.id})" class="btn btn-sm btn-primary">
                        💰 Adicionar Progresso
                    </button>
                    ` : ''}
                    <button onclick="editarMeta(${meta.id})" class="btn btn-sm btn-secondary">
                        ✏️ Editar
                    </button>
                    <button onclick="removerMeta(${meta.id})" class="btn btn-sm btn-danger">
                        🗑️ Remover
                    </button>
                </div>
            </div>
        `;
    }).join('');
}
