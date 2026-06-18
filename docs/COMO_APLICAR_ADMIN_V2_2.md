# Patch Admin V2.2 - ES Elétrica RJ

## Arquivos incluídos

- `app/admin/page.tsx`
- `components/AnalyticsTracker.tsx`
- `supabase/admin_v2_2.sql`

## Como aplicar

1. Copie `app/admin/page.tsx` para o seu projeto, substituindo o admin atual.
2. Copie `components/AnalyticsTracker.tsx` para `components/`.
3. Rode `supabase/admin_v2_2.sql` no Supabase SQL Editor.
4. No Supabase, crie um usuário em Authentication > Users.
5. Acesse `/admin` e faça login.

## Ativar analytics no site

No arquivo `app/layout.tsx`, importe:

```tsx
import AnalyticsTracker from '@/components/AnalyticsTracker';
```

Dentro do `<body>`, adicione:

```tsx
<AnalyticsTracker />
```

Exemplo:

```tsx
<body>
  <AnalyticsTracker />
  {children}
</body>
```

## Segurança

- Visitante anônimo só insere leads.
- Visitante anônimo só insere eventos de analytics.
- Admin autenticado lê e atualiza leads.
- Admin autenticado gerencia stories, banners, atualizações e checkout.
