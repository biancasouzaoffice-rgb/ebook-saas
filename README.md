# ebook-saas

API e frontend simples para um SaaS de conversão de e-books com autenticação JWT, controle de uso diário e pagamento via Mercado Pago.

## Pré-requisitos
- Node.js 18+
- MongoDB em execução (local ou remoto)
- Conta e token de acesso do Mercado Pago

## Configuração
1. Copie o arquivo de exemplo e preencha os valores reais:
   ```
   cp backend/.env.example backend/.env
   ```
   Variáveis esperadas:
   - `MONGO_URL`: string de conexão do MongoDB.
   - `JWT_SECRET`: chave usada para assinar tokens JWT.
   - `MERCADOPAGO_ACCESS_TOKEN`: access token do Mercado Pago.

2. Instale dependências do backend:
   ```
   cd backend
   npm install
   ```

3. Suba o servidor:
   ```
   npm start
   ```
   Ele escutará na porta 3000.

4. Frontend
   - Abra `frontend/index.html` no navegador.
   - Os endpoints consumidos apontam para `http://localhost:3000`.

## Endpoints principais
- `POST /register` – cria usuário.
- `POST /login` – retorna token JWT.
- `POST /convert` – permite até 3 conversões/dia para plano free.
- `POST /create-payment` – cria preferência de pagamento do plano PRO no Mercado Pago.
