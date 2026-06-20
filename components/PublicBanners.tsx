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
};

export default function PublicBanners({ area = 'home_topo' }: { area?: string }) {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    carregar();
  }, [area]);

  async function carregar() {
    if (!supabaseReady || !supabase) return;

    const { data, error } = await supabase
      .from('site_banners')
      .select('*')
      .eq('area', area)
      .or('ativo.eq.true,publicado.eq.true')
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      console.log(error);
      return;
    }

    setBanners(data || []);
  }

  if (!banners.length) return null;

  return (
    <div className="container" style={{ marginTop: 24 }}>
      {banners.map((b) => (
        <a
          key={b.id}
          href={b.link_url || '#'}
          className="card"
          style={{ display: 'block', textDecoration: 'none', color: 'inherit', overflow: 'hidden', marginBottom: 14 }}
        >
          {b.imagem_url && (
            <img src={b.imagem_url} alt={b.titulo} style={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 14 }} />
          )}
          <div style={{ padding: 12 }}>
            <h3 style={{ margin: '6px 0' }}>{b.titulo}</h3>
            {b.subtitulo && <p className="muted">{b.subtitulo}</p>}
          </div>
        </a>
      ))}
    </div>
  );
}
