# ES Elétrica RJ - Site V2 Profissional

Projeto criado usando o site antigo `es_eletrica_rj-main` como referência visual/conceitual, porém com arquitetura mais segura, moderna e responsiva.

## Recursos incluídos

- Visual profissional e responsivo.
- Energia solar, elétrica, segurança eletrônica e automação.
- Calculadora solar com estimativa de consumo, kWp, geração, investimento e payback.
- Salvamento de lead no Supabase.
- Área de avaliações de clientes reais.
- Página de stories e blog.
- Área admin com login Supabase Auth.
- LGPD com banner de cookies e política de privacidade.
- Sem senha de e-mail ou chave secreta exposta no código.
- Pronto para Netlify manual pela pasta `out/`.

## Como rodar no PC

1. Instale Node.js LTS.
2. Extraia o ZIP.
3. Abra a pasta no VS Code.
4. Crie o arquivo `.env.local` copiando `.env.example`.
5. Preencha as chaves do Supabase.
6. Execute:

```bash
npm install
npm run dev
```

Abra: http://localhost:3000

## Como gerar para Netlify Drop sem GitHub

```bash
npm install
npm run build
```

Depois envie a pasta `out/` no Netlify Drop.

## Supabase

Rode o arquivo `supabase/schema.sql` no SQL Editor do Supabase.

Depois crie um usuário admin em:

Authentication > Users > Add user

Use esse e-mail e senha para entrar em `/admin`.

## Segurança

- `node_modules/`, `.next/`, `out/` e `.env.local` estão no `.gitignore`.
- Nunca suba `.env.local` para GitHub.
- Use somente `NEXT_PUBLIC_SUPABASE_ANON_KEY` no front-end.
- Não coloque `SERVICE_ROLE_KEY` neste projeto estático.

## Melhorias futuras

- CRUD completo no admin para posts, stories e avaliações.
- Upload de imagens no Supabase Storage.
- Integração com IA Groq/Gemini via função serverless.
- Dashboard de leads.
- CRM e automação de WhatsApp.
