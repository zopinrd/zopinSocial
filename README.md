# Zopin - Sistema de Autenticação

Sistema de autenticação completo para a plataforma Zopin, uma rede social de compartilhamento de vídeos.

## Configuração do Supabase

1. Crie um novo projeto no [Supabase](https://supabase.com)
2. Copie as credenciais do projeto (URL e Anon Key)
3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
```

4. Execute a migração SQL localizada em `supabase/migrations/20250321_create_profiles.sql` no editor SQL do Supabase

## Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

## Funcionalidades

- ✅ Cadastro com nome, email e senha
- ✅ Login com email e senha
- ✅ Verificação de email após cadastro
- ✅ Recuperação de senha
- ✅ Logout
- ✅ Persistência do estado de autenticação
- ✅ Proteção de rotas
- ✅ Perfil de usuário no Supabase

## Estrutura do Projeto

```
src/
  ├── components/
  │   ├── Auth/
  │   │   └── ProtectedRoute.tsx
  │   └── layout/
  │       └── Header.tsx
  ├── contexts/
  │   └── AuthContext.tsx
  ├── lib/
  │   └── supabase.ts
  └── pages/
      └── Auth/
          ├── Login.tsx
          ├── SignUp.tsx
          └── ForgotPassword.tsx
```

## Tecnologias

- React + TypeScript
- Tailwind CSS
- Supabase Auth
- React Router DOM

## Segurança

- Senhas armazenadas com hash no Supabase
- Row Level Security (RLS) ativado
- Proteção contra XSS e CSRF
- Tokens JWT para autenticação
- Verificação de email obrigatória
