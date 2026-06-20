'use client';

import { useEffect, useState } from 'react';
import { supabase, supabaseReady } from '@/lib/supabase';

type Story = {
  id: string;
  titulo: string;
  descricao?: string;
  tipo?: string;
  media_url?: string;
  imagem_url?: string;
  link_url?: string;
  ativo?: boolean;
  publicado?: boolean;
  ordem?: number;
};

export default function PublicStories() {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    if (!supabaseReady || !supabase) return;

    const { data, error } = await supabase
      .from('site_stories')
      .select('*')
      .or('ativo.eq.true,publicado.eq.true')
      .order('ordem', { ascending: true });

    if (error) {
      console.log(error);
      return;
    }

    setStories(data || []);
  }

  if (!stories.length) {
    return (
      <div className="card">
        <h3>Stories em breve</h3>
        <p className="muted">Os stories cadastrados e aprovados no admin aparecerão aqui.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-3">
      {stories.map((s) => {
        const media = s.media_url || s.imagem_url || '';
        const isVideo = s.tipo === 'video' || /\.(mp4|webm|ogg)$/i.test(media);

        return (
          <article className="card" key={s.id}>
            {media && isVideo && (
              <video src={media} controls style={{ width: '100%', borderRadius: 14, marginBottom: 12 }} />
            )}

            {media && !isVideo && (
              <img src={media} alt={s.titulo} style={{ width: '100%', borderRadius: 14, marginBottom: 12 }} />
            )}

            <h3>{s.titulo}</h3>
            <p className="muted">{s.descricao}</p>

            {s.link_url && (
              <a className="btn btn-outline" href={s.link_url} target="_blank">
                Ver mais
              </a>
            )}
          </article>
        );
      })}
    </div>
  );
}
