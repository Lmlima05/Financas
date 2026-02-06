// Premium Features Modal
(function() {
    'use strict';

    // Criar modal dinamicamente
    function createPremiumModal() {
        const modalHTML = `
            <div id="premiumModal" class="premium-modal-overlay">
                <div class="premium-modal">
                    <div class="premium-modal-icon">🔒</div>
                    <h3>Recurso Premium</h3>
                    <p>Este recurso está disponível apenas para usuários Premium. Faça upgrade agora e aproveite todos os benefícios!</p>
                    
                    <div class="premium-features">
                        <ul>
                            <li>Navegação sem anúncios</li>
                            <li>Exportação de relatórios em PDF</li>
                            <li>Gráficos e análises avançadas</li>
                            <li>Temas personalizados</li>
                            <li>Suporte prioritário</li>
                        </ul>
                    </div>
                    
                    <div class="premium-modal-actions">
                        <button onclick="closePremiumModal()" class="btn btn-secondary">Agora Não</button>
                        <a href="/premium/upgrade" class="btn btn-primary">Fazer Upgrade</a>
                    </div>
                </div>
            </div>
        `;
        
        // Adicionar modal ao body se ainda não existir
        if (!document.getElementById('premiumModal')) {
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
    }

    // Abrir modal
    window.showPremiumModal = function() {
        createPremiumModal();
        const modal = document.getElementById('premiumModal');
        if (modal) {
            modal.classList.add('active');
        }
    };

    // Fechar modal
    window.closePremiumModal = function() {
        const modal = document.getElementById('premiumModal');
        if (modal) {
            modal.classList.remove('active');
        }
    };

    // Fechar modal ao clicar fora
    document.addEventListener('click', function(e) {
        const modal = document.getElementById('premiumModal');
        if (modal && e.target === modal) {
            closePremiumModal();
        }
    });

    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePremiumModal();
        }
    });

    // Bloquear features premium
    window.blockPremiumFeature = function(featureName) {
        showPremiumModal();
        return false;
    };

    // Verificar se usuário é premium (via atributo HTML)
    window.isPremiumUser = function() {
        return document.body.hasAttribute('data-premium') && 
               document.body.getAttribute('data-premium') === 'true';
    };

    // Adicionar listeners para botões com classe .premium-feature
    document.addEventListener('DOMContentLoaded', function() {
        const premiumButtons = document.querySelectorAll('.premium-feature:not(.premium-user)');
        premiumButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                if (!isPremiumUser()) {
                    e.preventDefault();
                    e.stopPropagation();
                    showPremiumModal();
                }
            });
        });
    });

    // Notificação de upgrade bem-sucedido
    window.showUpgradeSuccess = function() {
        const notification = document.createElement('div');
        notification.className = 'upgrade-notification';
        notification.innerHTML = `
            <div class="upgrade-notification-content">
                <span class="upgrade-notification-icon">🎉</span>
                <div class="upgrade-notification-text">
                    <strong>Bem-vindo ao Premium!</strong>
                    <p>Você agora tem acesso a todos os recursos exclusivos.</p>
                </div>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
            z-index: 10000;
            animation: slideInRight 0.5s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    };

    // CSS para animações
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        
        .upgrade-notification-content {
            display: flex;
            gap: 1rem;
            align-items: center;
        }
        
        .upgrade-notification-icon {
            font-size: 2rem;
        }
        
        .upgrade-notification-text strong {
            display: block;
            margin-bottom: 0.25rem;
            font-size: 1.1rem;
        }
        
        .upgrade-notification-text p {
            margin: 0;
            opacity: 0.9;
            font-size: 0.9rem;
        }
    `;
    document.head.appendChild(style);

    // Verificar se há parâmetro de sucesso na URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('premium') && urlParams.get('premium') === 'true') {
        setTimeout(showUpgradeSuccess, 500);
    }

})();
