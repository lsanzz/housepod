# HousePod

Projeto Vite + React com sincronização em tempo real via Firebase Firestore.

## Configuração do Firebase

1. Crie um projeto no Firebase e registre um app Web.
2. Ative o Cloud Firestore.
3. Copie `.env.example` para `.env` e preencha as variáveis do seu app.
4. Instale as dependências e rode o projeto:

```bash
npm install
npm run dev
```

## O que fica em tempo real

- configurações da loja
- preços, estoque e badges dos produtos
- pedidos da operação
- base de clientes da loja

## O que continua local no navegador

- carrinho
- favoritos
- cadastro usado para agilizar a compra neste dispositivo
- histórico exibido na área do cliente deste dispositivo

## Observação

Se as variáveis do Firebase não forem preenchidas, a loja continua funcionando em modo local.
