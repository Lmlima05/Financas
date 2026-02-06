# Configuração do PostgreSQL

## 📋 Pré-requisitos

Antes de executar a aplicação, você precisa ter o PostgreSQL instalado e configurado.

### Windows

1. **Baixar PostgreSQL**
   - Acesse: https://www.postgresql.org/download/windows/
   - Baixe o instalador (recomendado: versão 15 ou superior)
   - Execute o instalador

2. **Durante a instalação:**
   - Defina a senha do usuário `postgres` (padrão no application.properties: `postgres`)
   - Anote a porta (padrão: `5432`)
   - Instale o pgAdmin 4 (ferramenta de administração)

### Criar o Banco de Dados

#### Opção 1: Usando pgAdmin

1. Abra o **pgAdmin 4**
2. Conecte-se ao servidor PostgreSQL
3. Clique com botão direito em "Databases" → "Create" → "Database"
4. Nome: `equilibrio_finance`
5. Owner: `postgres`
6. Clique em "Save"

#### Opção 2: Usando linha de comando (psql)

```bash
# Conectar ao PostgreSQL
psql -U postgres

# Criar o banco de dados
CREATE DATABASE equilibrio_finance;

# Verificar
\l

# Sair
\q
```

#### Opção 3: Usando SQL no pgAdmin

```sql
CREATE DATABASE equilibrio_finance
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;
```

## ⚙️ Configuração da Aplicação

As configurações estão em `src/main/resources/application.properties`:

```properties
# Database PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/equilibrio_finance
spring.datasource.driverClassName=org.postgresql.Driver
spring.datasource.username=postgres
spring.datasource.password=postgres
```

### Customizar configurações

Se você usou senha diferente ou porta diferente:

```properties
# Porta diferente (exemplo: 5433)
spring.datasource.url=jdbc:postgresql://localhost:5433/equilibrio_finance

# Usuário e senha personalizados
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
```

## 🚀 Executar a Aplicação

```bash
# Limpar e compilar
mvn clean install

# Executar
mvn spring-boot:run
```

Na primeira execução, o Hibernate criará automaticamente todas as tabelas:
- `users` (usuários)
- `roles` (perfis)
- `user_roles` (relação usuário-perfil)
- `despesas` (gastos)
- `receitas` (rendimentos)
- `metas` (objetivos financeiros)

## 🔍 Verificar Tabelas Criadas

### No pgAdmin:

1. Navegue: Servers → PostgreSQL → Databases → equilibrio_finance → Schemas → public → Tables
2. Você verá as 6 tabelas criadas

### Via psql:

```bash
psql -U postgres -d equilibrio_finance

# Listar tabelas
\dt

# Ver estrutura de uma tabela
\d users

# Ver dados
SELECT * FROM users;
```

## 🐛 Troubleshooting

### Erro: "Connection refused"
- Verifique se o PostgreSQL está rodando
- Windows: Services → PostgreSQL → Status = Running
- Ou execute: `pg_ctl status`

### Erro: "password authentication failed"
- Verifique usuário e senha no application.properties
- Tente resetar a senha do postgres

### Erro: "database does not exist"
- Crie o banco manualmente usando pgAdmin ou psql
- Execute: `CREATE DATABASE equilibrio_finance;`

### Porta em uso
- Verifique qual porta o PostgreSQL está usando:
  ```sql
  SHOW port;
  ```
- Atualize `application.properties` se for diferente de 5432

## 📊 Monitoramento

### Ver conexões ativas:
```sql
SELECT * FROM pg_stat_activity 
WHERE datname = 'equilibrio_finance';
```

### Ver tamanho do banco:
```sql
SELECT pg_size_pretty(pg_database_size('equilibrio_finance'));
```

## 🔐 Segurança (Produção)

Para ambiente de produção:

1. **Crie um usuário específico** (não use `postgres`):
```sql
CREATE USER equilibrio_app WITH PASSWORD 'senha_forte_aqui';
GRANT ALL PRIVILEGES ON DATABASE equilibrio_finance TO equilibrio_app;
```

2. **Configure SSL**:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/equilibrio_finance?ssl=true&sslmode=require
```

3. **Use variáveis de ambiente**:
```properties
spring.datasource.username=${DB_USERNAME:postgres}
spring.datasource.password=${DB_PASSWORD:postgres}
```

## 📚 Referências

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [pgAdmin Documentation](https://www.pgadmin.org/docs/)
- [Spring Data JPA with PostgreSQL](https://spring.io/guides/gs/accessing-data-jpa/)
