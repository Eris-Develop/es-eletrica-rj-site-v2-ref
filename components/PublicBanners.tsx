'use client';

import { useEffect, useState } from 'react';
import { supabase, supabaseReady } from '@/lib/supabase';

type Banner = {
  id: string;
  titulo: string;
  subtitulo?: string;
  area?: string;
  imagem_url?: string;
  link_url?: string;
  ativo?: boolean;
  publicado?: boolean;
  modo_exibicao?: string;
  fonte?: string;
  cor_texto?: string;
  tamanho_texto?: string;
};

export default function PublicBanners({ area = 'home_topo' }: { area?: string }) {
  const [banner, setBanner] = useState<Banner | null>(null);

  useEffect(() => {
    carregarBanner();
  }, [area]);

  async function carregarBanner() {
    if (!supabaseReady || !supabase) return;

    const { data, error } = await supabase
      .from('site_banners')
      .select('*')
      .eq('area', area)
      .or('ativo.eq.true,publicado.eq.true')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.log('Erro banner:', error);
      return;
    }

    setBanner(data || null);
  }

  if (!banner) return null;

  const isBackground = banner.modo_exibicao === 'background';

  if (isBackground) {
    return (
      <section
        style={{
          minHeight: 340,
          marginTop: 20,
          backgroundImage: `linear-gradient(90deg, rgba(0,31,63,.86), rgba(14,103,255,.45)), url(${banner.imagem_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 24,
          overflow: 'hidden',
          display: 'grid',
          alignItems: 'center',
        }}
      >
        <div className="container">
          <div style={{ maxWidth: 680, padding: '48px 0' }}>
            <h2
              style={{
                color: banner.cor_texto || '#ffffff',
                fontFamily: banner.fonte || 'Arial',
                fontSize: Number(banner.tamanho_texto || 34),
                margin: 0,
              }}
            >
              {banner.titulo}
            </h2>

            {banner.subtitulo && (
              <p style={{ color: '#e2e8f0', fontSize: 18, lineHeight: 1.6 }}>
                {banner.subtitulo}
              </p>
            )}

            {banner.link_url && (
              <a className="btn btn-primary" href={banner.link_url} target="_blank">
                Saiba mais
              </a>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="container" style={{ marginTop: 24, marginBottom: 24 }}>
      <a
        href={banner.link_url || '#'}
        className="card"
        style={{ display: 'grid', gridTemplateColumns: '1.2fr .8fr', gap: 20, alignItems: 'center', textDecoration: 'none', color: 'inherit', overflow: 'hidden' }}
      >
        <div>
          <h2 style={{ fontFamily: banner.fonte || 'Arial', color: banner.cor_texto || '#0f172a', fontSize: Number(banner.tamanho_texto || 28), marginTop: 0 }}>
            {banner.titulo}
          </h2>
          {banner.subtitulo && <p className="muted">{banner.subtitulo}</p>}
          {banner.link_url && <span className="btn btn-outline">Ver oferta</span>}
        </div>

        {banner.imagem_url && (
          <img src={banner.imagem_url} alt={banner.titulo} style={{ width: '100%', maxHeight: 260, objectFit: 'cover', borderRadius: 16 }} />
        )}
      </a>
    </div>
  );
}
