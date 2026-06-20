# ES Elétrica RJ - Patch V2.5

Este patch resolve:
- Avaliação não aparecendo no admin.
- Banner salvo no admin não aparecendo no site.
- Story/vídeo salvo no admin não aparecendo no site.

## Arquivos para copiar

- `app/admin/page.tsx` substitui o admin atual.
- `app/stories/page.tsx` substitui a página stories.
- `components/PublicBanners.tsx` novo.
- `components/PublicStories.tsx` novo.
- `supabase/v2_5_conexao_admin_site.sql` rode no SQL Editor.

## Como mostrar banners na home

No `app/page.tsx`, importe:

```tsx
import PublicBanners from '@/components/PublicBanners';
```

Depois, logo depois do hero ou onde quiser:

```tsx
<PublicBanners area="home_topo" />
```

## Testar

```bash
npm run dev
npm run build
```
