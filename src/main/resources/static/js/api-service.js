// Serviço para interagir com as APIs REST do backend

const ApiService = {
    // Configuração base
    baseUrl: '/api',

    // Helper para fazer requisições
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            
            if (response.status === 401) {
                // Usuário não autenticado, redirecionar para login
                window.location.href = '/auth/login';
                return null;
            }

            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }

            // Se for DELETE, pode não ter conteúdo
            if (response.status === 204) {
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw error;
        }
    },

    // === DESPESAS ===
    async getDespesas() {
        return this.request('/despesas');
    },

    async getDespesasPorPeriodo(inicio, fim) {
        return this.request(`/despesas/periodo?inicio=${inicio}&fim=${fim}`);
    },

    async criarDespesa(despesa) {
        return this.request('/despesas', {
            method: 'POST',
            body: JSON.stringify(despesa),
        });
    },

    async atualizarDespesa(id, despesa) {
        return this.request(`/despesas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(despesa),
        });
    },

    async deletarDespesa(id) {
        return this.request(`/despesas/${id}`, {
            method: 'DELETE',
        });
    },

    // === RECEITAS ===
    async getReceitas() {
        return this.request('/receitas');
    },

    async getReceitasPorPeriodo(inicio, fim) {
        return this.request(`/receitas/periodo?inicio=${inicio}&fim=${fim}`);
    },

    async criarReceita(receita) {
        return this.request('/receitas', {
            method: 'POST',
            body: JSON.stringify(receita),
        });
    },

    async atualizarReceita(id, receita) {
        return this.request(`/receitas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(receita),
        });
    },

    async deletarReceita(id) {
        return this.request(`/receitas/${id}`, {
            method: 'DELETE',
        });
    },

    // === METAS ===
    async getMetas() {
        return this.request('/metas');
    },

    async getMetasAtivas() {
        return this.request('/metas/ativas');
    },

    async criarMeta(meta) {
        return this.request('/metas', {
            method: 'POST',
            body: JSON.stringify(meta),
        });
    },

    async atualizarMeta(id, meta) {
        return this.request(`/metas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(meta),
        });
    },

    async atualizarProgressoMeta(id, valor) {
        return this.request(`/metas/${id}/progresso?valor=${valor}`, {
            method: 'PATCH',
        });
    },

    async deletarMeta(id) {
        return this.request(`/metas/${id}`, {
            method: 'DELETE',
        });
    },
};

// Exportar para uso global
window.ApiService = ApiService;
