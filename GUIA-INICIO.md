# 🚀 Guia de Início Rápido - Equilíbrio Finance

## ✅ O que já está pronto

### Backend
- ✅ Projeto Spring Boot configurado
- ✅ Controllers para todas as rotas principais
- ✅ Thymeleaf configurado para SSR (excelente para SEO)
- ✅ Hot reload habilitado (DevTools)

### Frontend
- ✅ Home page completa e responsiva
- ✅ Sistema de controle de gastos funcional com localStorage
- ✅ Calculadora de Reserva de Emergência
- ✅ Design system implementado (cores do logo: laranja + preto)
- ✅ Menu responsivo
- ✅ Gráficos (Chart.js)

### Funcionalidades
- ✅ Adicionar/remover despesas
- ✅ Categorização de gastos
- ✅ Gráfico de pizza por categoria
- ✅ Filtros por mês e categoria
- ✅ Exportar CSV
- ✅ Resumo automático (receitas, despesas, saldo)

## 🎯 Como Executar AGORA

### Opção 1: Maven (Recomendado)
```bash
cd c:\workspace\Financas
mvn spring-boot:run
```

### Opção 2: IDE (IntelliJ/Eclipse)
1. Abra o projeto na IDE
2. Espere o Maven baixar as dependências
3. Execute `EquilibrioFinanceApplication.java`

### Acesse
```
http://localhost:8080
```

## 📋 Próximos Passos (em ordem de prioridade)

### 1. Testar o que já funciona ✅
- [ ] Executar o projeto
- [ ] Navegar pela home
- [ ] Testar controle de gastos
- [ ] Adicionar algumas despesas
- [ ] Ver o gráfico funcionando
- [ ] Testar calculadora de reserva

### 2. Adicionar seu logo 🎨
```
Coloque sua imagem do logo em:
src/main/resources/static/images/logo.png
src/main/resources/static/images/favicon.png
```

### 3. Criar mais 1 calculadora 🧮
Escolha uma dessas (mais fáceis de implementar):

#### Opção A: Calculadora de Orçamento (Regra 50-30-20)
- Input: Salário líquido
- Output: Quanto gastar em essenciais (50%), lazer (30%), poupança (20%)

#### Opção B: Juros Compostos
- Inputs: Valor inicial, aporte mensal, taxa, tempo
- Output: Quanto terá no futuro

### 4. Criar 5 artigos de blog 📝
Sugestões de temas (escolha 5):
1. Como montar um orçamento mensal que funciona
2. Quanto guardar por mês: guia prático
3. Como sair do cheque especial em 5 passos
4. Erros comuns no controle financeiro
5. Regra 50-30-20: organize seu salário
6. Como usar cartão de crédito sem se endividar
7. Reserva de emergência: quanto você precisa?

### 5. Otimizações para produção 🚀
- [ ] Adicionar Google Analytics
- [ ] Configurar sitemap.xml
- [ ] Adicionar robots.txt
- [ ] Otimizar imagens
- [ ] Configurar cache
- [ ] Adicionar Schema.org markup

## 🎨 Personalizações Rápidas

### Mudar Cores
Edite: `src/main/resources/static/css/style.css`
```css
:root {
    --primary-color: #FF8C00;  /* Sua cor primária */
    --primary-dark: #E67E00;   /* Tom mais escuro */
}
```

### Adicionar Redes Sociais
Edite: `src/main/resources/templates/fragments/footer.html`

### Mudar Textos
- Home: `src/main/resources/templates/index.html`
- Rodapé: `src/main/resources/templates/fragments/footer.html`
- Menu: `src/main/resources/templates/fragments/header.html`

## 🐛 Solução de Problemas

### Erro: "Port 8080 already in use"
```bash
# Windows - matar processo na porta 8080
netstat -ano | findstr :8080
taskkill /PID [NUMERO_DO_PID] /F
```

### Erro: Maven não encontrado
1. Instale o Maven: https://maven.apache.org/download.cgi
2. Ou use o wrapper incluído: `mvnw spring-boot:run`

### Página em branco
1. Limpe o cache do navegador (Ctrl+Shift+Delete)
2. Verifique o console do navegador (F12)
3. Verifique logs do Spring Boot

## 📊 Estrutura de Dados (localStorage)

### Formato das Despesas
```json
{
  "id": 1707234567890,
  "descricao": "Conta de luz",
  "valor": 150.00,
  "data": "2026-02-06",
  "categoria": "moradia",
  "tipo": "fixa",
  "criado": "2026-02-06T10:30:00Z"
}
```

### LocalStorage Keys
- `equilibrio_despesas` - Array de despesas
- `equilibrio_receitas` - Array de receitas (futuro)
- `equilibrio_metas` - Array de metas (futuro)

## 🚢 Deploy (quando estiver pronto)

### Opções de Hospedagem
1. **Railway.app** (Gratuito) ⭐ Recomendado
2. **Heroku** (Pago, mas simples)
3. **AWS Elastic Beanstalk**
4. **Azure App Service**
5. **Google Cloud Run**

### Build para Produção
```bash
mvn clean package
java -jar target/equilibrio-finance-1.0.0.jar
```

## 💡 Dicas Importantes

1. **SEO está OK** ✅ - Thymeleaf renderiza no servidor
2. **Mobile-first** ✅ - Design responsivo implementado
3. **Performance** ✅ - Sem banco de dados = super rápido no MVP
4. **Privacidade** ✅ - LocalStorage = dados não saem do navegador

## 📞 Checklist Final Antes do Deploy

- [ ] Logo adicionado
- [ ] Todas as páginas testadas
- [ ] Links funcionando
- [ ] Responsivo testado (mobile, tablet, desktop)
- [ ] Conteúdo revisado (textos, gramática)
- [ ] Google Analytics configurado
- [ ] Domínio apontado
- [ ] HTTPS configurado

---

## 🎉 Parabéns!

Seu projeto está funcionando! Agora é só:
1. Executar com `mvn spring-boot:run`
2. Testar em `http://localhost:8080`
3. Seguir os próximos passos acima

**Boa sorte com o Equilíbrio Finance!** 💰✨
