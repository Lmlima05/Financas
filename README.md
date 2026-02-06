"# 💰 Equilíbrio Finance

Sistema de organização financeira pessoal desenvolvido com **Java + Spring Boot + Thymeleaf**.

## 🎯 Sobre o Projeto

Site focado em ajudar pessoas a organizarem suas finanças de forma simples e prática, sem planilhas complicadas.

### Funcionalidades Principais

- ✅ **Controle de Gastos**: Registre despesas por categoria com gráficos intuitivos
- ✅ **Controle de Receitas**: Acompanhe seus ganhos mensais
- ✅ **Metas Financeiras**: Defina e acompanhe objetivos financeiros
- ✅ **Calculadoras Financeiras**: Ferramentas práticas para planejamento
- ✅ **Educação Financeira**: Conteúdo prático e direto ao ponto

## 🚀 Tecnologias

- **Backend**: Java 17 + Spring Boot 3.2.2
- **Frontend**: Thymeleaf + HTML5 + CSS3 + JavaScript
- **Gráficos**: Chart.js
- **Build**: Maven
- **Armazenamento**: LocalStorage (sem necessidade de banco de dados no MVP)

## 📋 Pré-requisitos

- Java 17 ou superior
- Maven 3.6+

## ⚡ Como Executar

1. Clone o repositório
```bash
cd Financas
```

2. Execute o projeto com Maven
```bash
mvn spring-boot:run
```

3. Acesse no navegador
```
http://localhost:8080
```

## 🗂️ Estrutura do Projeto

```
src/
├── main/
│   ├── java/com/equilibrio/finance/
│   │   ├── EquilibrioFinanceApplication.java
│   │   └── controller/
│   │       ├── HomeController.java
│   │       ├── ControleFinanceiroController.java
│   │       ├── FerramentasController.java
│   │       └── BlogController.java
│   └── resources/
│       ├── static/
│       │   ├── css/
│       │   │   ├── style.css
│       │   │   ├── responsive.css
│       │   │   ├── controle.css
│       │   │   └── ferramentas.css
│       │   └── js/
│       │       ├── main.js
│       │       ├── controle-gastos.js
│       │       └── calculadora-reserva.js
│       ├── templates/
│       │   ├── index.html
│       │   ├── fragments/
│       │   │   ├── header.html
│       │   │   └── footer.html
│       │   ├── controle/
│       │   │   ├── gastos.html
│       │   │   ├── receitas.html
│       │   │   └── metas.html
│       │   ├── ferramentas/
│       │   │   ├── index.html
│       │   │   ├── calculadora-orcamento.html
│       │   │   ├── reserva-emergencia.html
│       │   │   ├── juros-compostos.html
│       │   │   └── financiamento.html
│       │   └── blog/
│       │       ├── index.html
│       │       ├── post.html
│       │       └── categoria.html
│       └── application.properties
└── pom.xml
```

## 🎨 Design System

### Cores
- **Primária**: `#FF8C00` (Laranja - do logo)
- **Secundária**: `#1A1A1A` (Preto)
- **Sucesso**: `#10B981`
- **Perigo**: `#EF4444`
- **Info**: `#3B82F6`

### Tipografia
- **Fonte**: Inter (Google Fonts)

## 📱 Responsividade

O site é totalmente responsivo e mobile-first, funcionando perfeitamente em:
- 📱 Smartphones
- 💻 Tablets
- 🖥️ Desktops

## 🔍 SEO

O projeto utiliza **Server-Side Rendering (SSR)** com Thymeleaf, o que garante:
- ✅ HTML completo entregue aos buscadores
- ✅ Meta tags dinâmicas em cada página
- ✅ URLs amigáveis e semânticas
- ✅ Performance otimizada

### URLs Principais

- `/` - Home
- `/controle/gastos` - Controle de Gastos
- `/controle/receitas` - Controle de Receitas
- `/controle/metas` - Metas Financeiras
- `/ferramentas` - Lista de Ferramentas
- `/ferramentas/calculadora-orcamento` - Calculadora de Orçamento
- `/ferramentas/reserva-emergencia` - Calculadora de Reserva
- `/ferramentas/juros-compostos` - Calculadora de Juros Compostos
- `/ferramentas/financiamento` - Simulador de Financiamento
- `/blog` - Blog/Conteúdo Educacional
- `/sobre` - Sobre o Projeto

## 💾 Armazenamento

No MVP, os dados são salvos no **localStorage** do navegador:
- ✅ Sem necessidade de cadastro
- ✅ Privacidade total (dados não saem do navegador)
- ✅ Funciona offline
- ⚠️ Dados específicos por navegador/dispositivo

## 🚧 Roadmap

### MVP (Atual) ✅
- [x] Home page
- [x] Controle de gastos com localStorage
- [x] Calculadora de reserva de emergência
- [ ] Calculadora de orçamento
- [ ] 5 artigos de blog

### Fase 2 (Futuro)
- [ ] Sistema de login
- [ ] Backend com banco de dados
- [ ] Sincronização em nuvem
- [ ] Exportar/Importar dados
- [ ] Relatórios avançados
- [ ] Mais calculadoras

### Monetização (Futuro)
- [ ] Google AdSense
- [ ] Links de afiliados
- [ ] Plano Pro (sem anúncios)

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido para o domínio **equilibrioivest**

---

**Equilíbrio Finance** - Organize seu dinheiro de forma simples 💰✨" 
