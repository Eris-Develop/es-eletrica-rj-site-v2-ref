# Patch Avaliações Moderadas V2.3 - ES Elétrica RJ

## O que este patch faz

- Cria a página `/avaliar` para cliente enviar avaliação.
- Salva avaliação no Supabase como `pendente`.
- Avaliação não aparece ao público automaticamente.
- Público só vê avaliações `aprovado = true` e `status = aprovado`.
- Admin logado pode aprovar, reprovar ou excluir.

## Como aplicar

1. Copie `app/avaliar/page.tsx` para seu projeto.
2. Copie `components/PublicReviews.tsx` para `components/`.
3. Rode o SQL `supabase/avaliacoes_moderadas_v2_3.sql` no Supabase.
4. Para mostrar avaliações aprovadas na home, importe:

```tsx
import PublicReviews from '@/components/PublicReviews';
```

E onde hoje existem os cards fixos de avaliações, substitua por:

```tsx
<PublicReviews />
```

5. Para moderar avaliações no admin:
   - Abra `docs/BLOCO_ADMIN_AVALIACOES.tsx`
   - Copie os blocos indicados para `app/admin/page.tsx`

## Link para clientes avaliarem

`https://www.eseletricario.com.br/avaliar`

ou local:

`http://localhost:3000/avaliar`
