// Controle de Gastos com integração de API
document.addEventListener('DOMContentLoaded', async function() {
    const despesaForm = document.getElementById('despesa-form');
    const listaDespesas = document.getElementById('lista-despesas');
    const totalDespesasEl = document.getElementById('total-despesas');
    const filtroMes = document.getElementById('filtro-mes');
    const filtroCategoria = document.getElementById('filtro-categoria');

    let despesas = [];
    let despesaEditando = null;

    // Carregar despesas do servidor
    async function carregarDespesas() {
        try {
            despesas = await ApiService.getDespesas();
            atualizarListaDespesas();
        } catch (error) {
            console.error('Erro ao carregar despesas:', error);
            mostrarNotificacao('Erro ao carregar despesas', 'error');
        }
    }

    // Salvar nova despesa
    despesaForm?.addEventListener('submit', async function(e) {
        e.preventDefault();

        const despesa = {
            descricao: document.getElementById('descricao').value,
            valor: parseFloat(document.getElementById('valor').value),
            categoria: document.getElementById('categoria').value,
            data: document.getElementById('data').value,
            observacao: document.getElementById('observacao')?.value || ''
        };

        try {
            if (despesaEditando) {
                // Atualizar despesa existente
                await ApiService.atualizarDespesa(despesaEditando, despesa);
                mostrarNotificacao('Despesa atualizada com sucesso!', 'success');
                despesaEditando = null;
            } else {
                // Criar nova despesa
                await ApiService.criarDespesa(despesa);
                mostrarNotificacao('Despesa adicionada com sucesso!', 'success');
            }

            despesaForm.reset();
            await carregarDespesas();
        } catch (error) {
            console.error('Erro ao salvar despesa:', error);
            mostrarNotificacao('Erro ao salvar despesa', 'error');
        }
    });

    // Atualizar lista de despesas
    function atualizarListaDespesas() {
        if (!listaDespesas) return;

        const filtroMesVal = filtroMes?.value || 'todos';
        const filtroCategoriaVal = filtroCategoria?.value || 'todas';

        // Filtrar despesas
        let despesasFiltradas = despesas.filter(d => {
            const mesMatch = filtroMesVal === 'todos' || d.data.substring(0, 7) === filtroMesVal;
            const categoriaMatch = filtroCategoriaVal === 'todas' || d.categoria === filtroCategoriaVal;
            return mesMatch && categoriaMatch;
        });

        // Ordenar por data (mais recente primeiro)
        despesasFiltradas.sort((a, b) => new Date(b.data) - new Date(a.data));

        // Renderizar lista
        listaDespesas.innerHTML = '';
        let total = 0;

        despesasFiltradas.forEach(despesa => {
            total += despesa.valor;
            const li = criarItemDespesa(despesa);
            listaDespesas.appendChild(li);
        });

        // Atualizar total
        if (totalDespesasEl) {
            totalDespesasEl.textContent = formatarMoeda(total);
        }
    }

    // Criar item HTML da despesa
    function criarItemDespesa(despesa) {
        const li = document.createElement('li');
        li.className = 'despesa-item';
        li.innerHTML = `
            <div class="despesa-info">
                <div class="despesa-descricao">${despesa.descricao}</div>
                <div class="despesa-detalhes">
                    <span class="despesa-categoria">${despesa.categoria}</span>
                    <span class="despesa-data">${formatarData(despesa.data)}</span>
                </div>
                ${despesa.observacao ? `<div class="despesa-obs">${despesa.observacao}</div>` : ''}
            </div>
            <div class="despesa-valor">${formatarMoeda(despesa.valor)}</div>
            <div class="despesa-acoes">
                <button class="btn-editar" onclick="editarDespesa(${despesa.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-excluir" onclick="excluirDespesa(${despesa.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        return li;
    }

    // Editar despesa
    window.editarDespesa = function(id) {
        const despesa = despesas.find(d => d.id === id);
        if (!despesa) return;

        document.getElementById('descricao').value = despesa.descricao;
        document.getElementById('valor').value = despesa.valor;
        document.getElementById('categoria').value = despesa.categoria;
        document.getElementById('data').value = despesa.data;
        if (document.getElementById('observacao')) {
            document.getElementById('observacao').value = despesa.observacao || '';
        }

        despesaEditando = id;
        document.querySelector('#despesa-form button[type="submit"]').textContent = 'Atualizar Despesa';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Excluir despesa
    window.excluirDespesa = async function(id) {
        if (!confirm('Tem certeza que deseja excluir esta despesa?')) return;

        try {
            await ApiService.deletarDespesa(id);
            mostrarNotificacao('Despesa excluída com sucesso!', 'success');
            await carregarDespesas();
        } catch (error) {
            console.error('Erro ao excluir despesa:', error);
            mostrarNotificacao('Erro ao excluir despesa', 'error');
        }
    };

    // Filtros
    filtroMes?.addEventListener('change', atualizarListaDespesas);
    filtroCategoria?.addEventListener('change', atualizarListaDespesas);

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

    function mostrarNotificacao(mensagem, tipo) {
        // Implementar sistema de notificações
        console.log(`[${tipo}] ${mensagem}`);
        alert(mensagem);
    }

    // Inicializar
    await carregarDespesas();
});
