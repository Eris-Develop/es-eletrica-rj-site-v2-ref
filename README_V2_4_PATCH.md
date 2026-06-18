# ES Elétrica RJ - Patch V2.4 Completo

Inclui:
- Calculadora solar corrigida salvando lead.
- Página `/avaliar` com foto de perfil, imagem ou vídeo.
- Avaliações moderadas: só aparecem após aprovação.
- SQL com tabela, RLS e Storage.

Como aplicar:
1. Copie os arquivos para o projeto.
2. Rode `supabase/v2_4_leads_avaliacoes_storage.sql` no Supabase SQL Editor.
3. No `app/page.tsx`, use `PublicReviews` no lugar das avaliações antigas.
4. Rode `npm run build`.

Observação: não é possível pegar foto privada do Google só pelo e-mail sem login OAuth. O sistema tenta avatar público por e-mail e permite upload manual.
