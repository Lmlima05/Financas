# Configuração do Google reCAPTCHA v2

## 🔐 Por que usar reCAPTCHA?

O reCAPTCHA foi implementado para proteger a aplicação contra:
- ✅ Ataques de força bruta (brute force)
- ✅ Bots automatizados
- ✅ Spam e criação massiva de contas
- ✅ Ataques DDoS distribuídos

## 📋 Como obter suas chaves do Google reCAPTCHA

### Passo 1: Acesse o Admin Console
Visite: https://www.google.com/recaptcha/admin

### Passo 2: Registre um novo site
1. Faça login com sua conta Google
2. Clique em **"+"** para adicionar um novo site
3. Preencha os dados:
   - **Label**: Equilíbrio Finance (ou nome do seu projeto)
   - **reCAPTCHA type**: reCAPTCHA v2 → "I'm not a robot" Checkbox
   - **Domains**: 
     - Para desenvolvimento: `localhost`
     - Para produção: `seudominio.com.br`
   - Aceite os termos de serviço

### Passo 3: Copie suas chaves
Após criar o site, você receberá:
- **Site Key** (chave pública) - usada no frontend
- **Secret Key** (chave secreta) - usada no backend

### Passo 4: Configure no application.properties

Abra o arquivo `src/main/resources/application.properties` e substitua:

```properties
# Google reCAPTCHA v2
recaptcha.site-key=SUA_SITE_KEY_AQUI
recaptcha.secret-key=SUA_SECRET_KEY_AQUI
recaptcha.enabled=true
```

## 🧪 Chaves de Teste (Desenvolvimento)

Para testes locais, o Google fornece chaves de teste que **sempre** passam na validação:

```properties
# APENAS PARA TESTES - NÃO USE EM PRODUÇÃO!
recaptcha.site-key=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
recaptcha.secret-key=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
recaptcha.enabled=true
```

⚠️ **IMPORTANTE**: Essas chaves de teste devem ser substituídas por chaves reais em produção!

## 🛠️ Desabilitar reCAPTCHA (Desenvolvimento)

Se quiser desabilitar temporariamente durante o desenvolvimento:

```properties
recaptcha.enabled=false
```

Com `recaptcha.enabled=false`, a validação será ignorada e todos os registros serão permitidos.

## 🚀 Produção

### Configuração recomendada para produção:

1. **Use chaves reais** obtidas no Google reCAPTCHA Admin
2. **Configure os domínios corretos** no painel do Google
3. **Mantenha habilitado**: `recaptcha.enabled=true`
4. **Proteja a Secret Key**: Nunca exponha a chave secreta no frontend

### Domínios em Produção

No painel do Google reCAPTCHA, adicione todos os domínios onde sua aplicação estará rodando:
- `www.seusite.com.br`
- `seusite.com.br`
- `api.seusite.com.br`

## 🔍 Testando

1. Inicie a aplicação
2. Acesse: http://localhost:8080/auth/registro
3. Você verá o checkbox "Não sou um robô"
4. Marque o checkbox antes de criar a conta
5. Tente criar uma conta sem marcar → deve receber erro de validação

## 📊 Monitoramento

Acesse o painel do Google reCAPTCHA para ver estatísticas:
- Número de verificações
- Taxa de sucesso/falha
- Tentativas bloqueadas
- Tráfego por domínio

## 🐛 Troubleshooting

### Erro: "Falha na verificação reCAPTCHA"
- Verifique se as chaves estão corretas
- Confirme que o domínio está registrado no Google
- Verifique sua conexão com a API do Google

### reCAPTCHA não aparece
- Confirme que o script está carregando: `https://www.google.com/recaptcha/api.js`
- Verifique o console do navegador para erros
- Teste se a `site-key` está sendo passada corretamente

### Secret Key inválida
- Verifique se copiou a chave completa
- Confirme que está usando a Secret Key (não a Site Key)
- Regenere as chaves se necessário

## 📚 Referências

- [Google reCAPTCHA Documentation](https://developers.google.com/recaptcha/docs/display)
- [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
- [Best Practices](https://developers.google.com/recaptcha/docs/faq)
