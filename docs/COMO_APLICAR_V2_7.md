# V2.7 - Home lendo banners + Analytics + Área de APIs

## Corrige

O banner salvo no Admin não aparecia porque a Home não tinha o componente lendo `site_banners`.

## Arquivos

- `components/PublicBanners.tsx`
- `components/AnalyticsTracker.tsx`
- `app/api/integrations/route.ts`
- `supabase/v2_7_home_banners_analytics_apis.sql`

## Aplicar banner na Home

No `app/page.tsx`, coloque no topo:

```tsx
import PublicBanners from '@/components/PublicBanners';
```

Depois do fechamento da seção hero, adicione:

```tsx
<PublicBanners area="home_topo" />
```

Na seção da calculadora, antes ou depois do título, pode adicionar:

```tsx
<PublicBanners area="calculadora" />
```

Na seção serviços:

```tsx
<PublicBanners area="servicos" />
```

## Ativar visitas/analytics

No `app/layout.tsx`, coloque no topo:

```tsx
import AnalyticsTracker from '@/components/AnalyticsTracker';
```

Dentro do `<body>`:

```tsx
<AnalyticsTracker />
{children}
```

## Área de APIs

Foi criado:

```text
/api/integrations
```

## SQL

Rode no Supabase:

```text
supabase/v2_7_home_banners_analytics_apis.sql
```
