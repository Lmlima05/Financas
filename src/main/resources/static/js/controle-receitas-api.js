// Controle de Receitas com integração de API
document.addEventListener('DOMContentLoaded', async function() {
    const receitaForm = document.getElementById('receita-form');
    const listaReceitas = document.getElementById('lista-receitas');
    const totalReceitasEl = document.getElementById('total-receitas');

    let receitas = [];
    let receitaEditando = null;

    // Carregar receitas do servidor
    async function carregarReceitas() {
        try {
            receitas = await ApiService.getReceitas();
            atualizarListaReceitas();
        } catch (error) {
            console.error('Erro ao carregar receitas:', error);
            mostrarNotificacao('Erro ao carregar receitas', 'error');
        }
    }

    // Salvar nova receita
    receitaForm?.addEventListener('submit', async function(e) {
        e.preventDefault();

        const receita = {
            descricao: document.getElementById('descricao').value,
            valor: parseFloat(document.getElementById('valor').value),
            categoria: document.getElementById('categoria').value,
            data: document.getElementById('data').value,
            observacao: document.getElementById('observacao')?.value || ''
        };

        try {
            if (receitaEditando) {
                await ApiService.atualizarReceita(receitaEditando, receita);
                mostrarNotificacao('Receita atualizada com sucesso!', 'success');
                receitaEditando = null;
            } else {
                await ApiService.criarReceita(receita);
                mostrarNotificacao('Receita adicionada com sucesso!', 'success');
            }

            receitaForm.reset();
            await carregarReceitas();
        } catch (error) {
            console.error('Erro ao salvar receita:', error);
            mostrarNotificacao('Erro ao salvar receita', 'error');
        }
    });

    // Atualizar lista de receitas
    function atualizarListaReceitas() {
        if (!listaReceitas) return;

        listaReceitas.innerHTML = '';
        let total = 0;

        receitas.forEach(receita => {
            total += receita.valor;
            const li = criarItemReceita(receita);
            listaReceitas.appendChild(li);
        });

        if (totalReceitasEl) {
            totalReceitasEl.textContent = formatarMoeda(total);
        }
    }

    // Criar item HTML da receita
    function criarItemReceita(receita) {
        const li = document.createElement('li');
        li.className = 'receita-item';
        li.innerHTML = `
            <div class="receita-info">
                <div class="receita-descricao">${receita.descricao}</div>
                <div class="receita-detalhes">
                    <span class="receita-categoria">${receita.categoria}</span>
                    <span class="receita-data">${formatarData(receita.data)}</span>
                </div>
            </div>
            <div class="receita-valor">${formatarMoeda(receita.valor)}</div>
            <div class="receita-acoes">
                <button class="btn-editar" onclick="editarReceita(${receita.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-excluir" onclick="excluirReceita(${receita.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        return li;
    }

    // Editar receita
    window.editarReceita = function(id) {
        const receita = receitas.find(r => r.id === id);
        if (!receita) return;

        document.getElementById('descricao').value = receita.descricao;
        document.getElementById('valor').value = receita.valor;
        document.getElementById('categoria').value = receita.categoria;
        document.getElementById('data').value = receita.data;

        receitaEditando = id;
        document.querySelector('#receita-form button[type="submit"]').textContent = 'Atualizar Receita';
    };

    // Excluir receita
    window.excluirReceita = async function(id) {
        if (!confirm('Tem certeza que deseja excluir esta receita?')) return;

        try {
            await ApiService.deletarReceita(id);
            mostrarNotificacao('Receita excluída com sucesso!', 'success');
            await carregarReceitas();
        } catch (error) {
            console.error('Erro ao excluir receita:', error);
            mostrarNotificacao('Erro ao excluir receita', 'error');
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

    function mostrarNotificacao(mensagem, tipo) {
        console.log(`[${tipo}] ${mensagem}`);
        alert(mensagem);
    }

    // Inicializar
    await carregarReceitas();
});
