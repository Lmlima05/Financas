// Controle de Metas com integração de API
document.addEventListener('DOMContentLoaded', async function() {
    const metaForm = document.getElementById('meta-form');
    const listaMetas = document.getElementById('lista-metas');

    let metas = [];
    let metaEditando = null;

    // Carregar metas do servidor
    async function carregarMetas() {
        try {
            metas = await ApiService.getMetas();
            atualizarListaMetas();
        } catch (error) {
            console.error('Erro ao carregar metas:', error);
            mostrarNotificacao('Erro ao carregar metas', 'error');
        }
    }

    // Salvar nova meta
    metaForm?.addEventListener('submit', async function(e) {
        e.preventDefault();

        const meta = {
            titulo: document.getElementById('titulo').value,
            valorAlvo: parseFloat(document.getElementById('valor-alvo').value),
            valorAtual: parseFloat(document.getElementById('valor-atual')?.value || 0),
            dataInicio: document.getElementById('data-inicio').value,
            dataAlvo: document.getElementById('data-alvo').value,
            descricao: document.getElementById('descricao')?.value || '',
            status: 'EM_PROGRESSO'
        };

        try {
            if (metaEditando) {
                await ApiService.atualizarMeta(metaEditando, meta);
                mostrarNotificacao('Meta atualizada com sucesso!', 'success');
                metaEditando = null;
            } else {
                await ApiService.criarMeta(meta);
                mostrarNotificacao('Meta criada com sucesso!', 'success');
            }

            metaForm.reset();
            await carregarMetas();
        } catch (error) {
            console.error('Erro ao salvar meta:', error);
            mostrarNotificacao('Erro ao salvar meta', 'error');
        }
    });

    // Atualizar lista de metas
    function atualizarListaMetas() {
        if (!listaMetas) return;

        listaMetas.innerHTML = '';

        metas.forEach(meta => {
            const card = criarCardMeta(meta);
            listaMetas.appendChild(card);
        });
    }

    // Criar card HTML da meta
    function criarCardMeta(meta) {
        const progresso = meta.valorAlvo > 0 ? (meta.valorAtual / meta.valorAlvo * 100) : 0;
        const progressoFormatado = Math.min(progresso, 100).toFixed(1);
        
        const div = document.createElement('div');
        div.className = `meta-card ${meta.status === 'CONCLUIDA' ? 'concluida' : ''}`;
        div.innerHTML = `
            <div class="meta-header">
                <h3>${meta.titulo}</h3>
                <span class="meta-status ${meta.status.toLowerCase()}">${formatarStatus(meta.status)}</span>
            </div>
            ${meta.descricao ? `<p class="meta-descricao">${meta.descricao}</p>` : ''}
            <div class="meta-valores">
                <div class="valor-atual">
                    <span class="label">Valor Atual</span>
                    <span class="valor">${formatarMoeda(meta.valorAtual)}</span>
                </div>
                <div class="valor-alvo">
                    <span class="label">Valor Alvo</span>
                    <span class="valor">${formatarMoeda(meta.valorAlvo)}</span>
                </div>
            </div>
            <div class="meta-progresso">
                <div class="progresso-bar">
                    <div class="progresso-fill" style="width: ${progressoFormatado}%"></div>
                </div>
                <span class="progresso-texto">${progressoFormatado}%</span>
            </div>
            <div class="meta-datas">
                <span>Início: ${formatarData(meta.dataInicio)}</span>
                <span>Meta: ${formatarData(meta.dataAlvo)}</span>
            </div>
            <div class="meta-acoes">
                <button class="btn-atualizar" onclick="atualizarProgressoMeta(${meta.id})">
                    <i class="fas fa-plus"></i> Adicionar Valor
                </button>
                <button class="btn-editar" onclick="editarMeta(${meta.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-excluir" onclick="excluirMeta(${meta.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        return div;
    }

    // Atualizar progresso da meta
    window.atualizarProgressoMeta = async function(id) {
        const meta = metas.find(m => m.id === id);
        if (!meta) return;

        const valor = prompt(`Adicionar valor à meta "${meta.titulo}":\nValor atual: ${formatarMoeda(meta.valorAtual)}\nValor alvo: ${formatarMoeda(meta.valorAlvo)}`);
        if (!valor) return;

        const valorNumerico = parseFloat(valor);
        if (isNaN(valorNumerico) || valorNumerico <= 0) {
            alert('Valor inválido');
            return;
        }

        try {
            const novoValor = meta.valorAtual + valorNumerico;
            await ApiService.atualizarProgressoMeta(id, novoValor);
            mostrarNotificacao('Progresso atualizado com sucesso!', 'success');
            await carregarMetas();
        } catch (error) {
            console.error('Erro ao atualizar progresso:', error);
            mostrarNotificacao('Erro ao atualizar progresso', 'error');
        }
    };

    // Editar meta
    window.editarMeta = function(id) {
        const meta = metas.find(m => m.id === id);
        if (!meta) return;

        document.getElementById('titulo').value = meta.titulo;
        document.getElementById('valor-alvo').value = meta.valorAlvo;
        if (document.getElementById('valor-atual')) {
            document.getElementById('valor-atual').value = meta.valorAtual;
        }
        document.getElementById('data-inicio').value = meta.dataInicio;
        document.getElementById('data-alvo').value = meta.dataAlvo;
        if (document.getElementById('descricao')) {
            document.getElementById('descricao').value = meta.descricao || '';
        }

        metaEditando = id;
        document.querySelector('#meta-form button[type="submit"]').textContent = 'Atualizar Meta';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Excluir meta
    window.excluirMeta = async function(id) {
        if (!confirm('Tem certeza que deseja excluir esta meta?')) return;

        try {
            await ApiService.deletarMeta(id);
            mostrarNotificacao('Meta excluída com sucesso!', 'success');
            await carregarMetas();
        } catch (error) {
            console.error('Erro ao excluir meta:', error);
            mostrarNotificacao('Erro ao excluir meta', 'error');
        }
    };

    // Helpers
    function formatarMoeda(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }

    function formatarData(data) {
        return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
    }

    function formatarStatus(status) {
        const statusMap = {
            'EM_PROGRESSO': 'Em Progresso',
            'CONCLUIDA': 'Concluída',
            'CANCELADA': 'Cancelada'
        };
        return statusMap[status] || status;
    }

    function mostrarNotificacao(mensagem, tipo) {
        console.log(`[${tipo}] ${mensagem}`);
        alert(mensagem);
    }

    // Inicializar
    await carregarMetas();
});
