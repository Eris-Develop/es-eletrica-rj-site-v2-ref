'use client';

import { useEffect, useState } from 'react';
import { supabase, supabaseReady } from '@/lib/supabase';

type Lead = any;
type Avaliacao = any;
type Banner = any;
type Story = any;

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: 10,
  border: '1px solid #cbd5e1',
  borderRadius: 10,
  marginTop: 6,
};

const btn: React.CSSProperties = {
  padding: '10px 14px',
  border: 0,
  borderRadius: 10,
  background: '#0e67ff',
  color: '#fff',
  fontWeight: 800,
  cursor: 'pointer',
};

const danger: React.CSSProperties = {
  ...btn,
  background: '#dc2626',
};

const card: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 16,
  padding: 16,
  marginBottom: 16,
};

export default function AdminPage() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [tab, setTab] = useState<'leads'|'avaliacoes'|'stories'|'banners'>('leads');

  const [leads, setLeads] = useState<Lead[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);

  const [storyForm, setStoryForm] = useState({
    titulo: '',
    descricao: '',
    tipo: 'imagem',
    media_url: '',
    link_url: '',
    ativo: true,
    publicado: true,
    ordem: 1,
  });

  const [bannerForm, setBannerForm] = useState({
    titulo: '',
    subtitulo: '',
    area: 'home_topo',
    imagem_url: '',
    link_url: '',
    ativo: true,
    publicado: true,
  });

  useEffect(() => {
    if (!supabaseReady || !supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) carregarTudo();
    });
  }, []);

  async function login(e: any) {
    e.preventDefault();
    setErro('');

    if (!supabaseReady || !supabase) {
      setErro('Supabase não configurado.');
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setErro(error.message);
      return;
    }

    setSession(data.session);
    carregarTudo();
  }

  async function sair() {
    await supabase?.auth.signOut();
    setSession(null);
  }

  async function carregarTudo() {
    await Promise.all([carregarLeads(), carregarAvaliacoes(), carregarStories(), carregarBanners()]);
  }

  async function carregarLeads() {
    if (!supabase) return;
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (error) {
      console.log(error);
      setErro(error.message);
      return;
    }
    setLeads(data || []);
  }

  async function atualizarLead(id: string, status: string) {
    if (!supabase) return;
    const { error } = await supabase.from('leads').update({ status }).eq('id', id);
    if (error) alert(error.message);
    carregarLeads();
  }

  async function carregarAvaliacoes() {
    if (!supabase) return;
    const { data, error } = await supabase.from('avaliacoes').select('*').order('created_at', { ascending: false });
    if (error) {
      console.log(error);
      setErro(error.message);
      return;
    }
    setAvaliacoes(data || []);
  }

  async function aprovarAvaliacao(id: string) {
    if (!supabase) return;
    const { error } = await supabase.from('avaliacoes').update({ aprovado: true, status: 'aprovado' }).eq('id', id);
    if (error) alert(error.message);
    carregarAvaliacoes();
  }

  async function reprovarAvaliacao(id: string) {
    if (!supabase) return;
    const { error } = await supabase.from('avaliacoes').update({ aprovado: false, status: 'reprovado' }).eq('id', id);
    if (error) alert(error.message);
    carregarAvaliacoes();
  }

  async function excluirAvaliacao(id: string) {
    if (!supabase || !confirm('Excluir avaliação?')) return;
    const { error } = await supabase.from('avaliacoes').delete().eq('id', id);
    if (error) alert(error.message);
    carregarAvaliacoes();
  }

  async function carregarStories() {
    if (!supabase) return;
    const { data, error } = await supabase.from('site_stories').select('*').order('ordem', { ascending: true });
    if (error) {
      console.log(error);
      setErro(error.message);
      return;
    }
    setStories(data || []);
  }

  async function salvarStory(e: any) {
    e.preventDefault();
    if (!supabase) return;
    const { error } = await supabase.from('site_stories').insert(storyForm);
    if (error) {
      alert(error.message);
      return;
    }
    setStoryForm({ titulo: '', descricao: '', tipo: 'imagem', media_url: '', link_url: '', ativo: true, publicado: true, ordem: 1 });
    carregarStories();
  }

  async function excluirStory(id: string) {
    if (!supabase || !confirm('Excluir story?')) return;
    const { error } = await supabase.from('site_stories').delete().eq('id', id);
    if (error) alert(error.message);
    carregarStories();
  }

  async function carregarBanners() {
    if (!supabase) return;
    const { data, error } = await supabase.from('site_banners').select('*').order('created_at', { ascending: false });
    if (error) {
      console.log(error);
      setErro(error.message);
      return;
    }
    setBanners(data || []);
  }

  async function salvarBanner(e: any) {
    e.preventDefault();
    if (!supabase) return;
    const { error } = await supabase.from('site_banners').insert(bannerForm);
    if (error) {
      alert(error.message);
      return;
    }
    setBannerForm({ titulo: '', subtitulo: '', area: 'home_topo', imagem_url: '', link_url: '', ativo: true, publicado: true });
    carregarBanners();
  }

  async function excluirBanner(id: string) {
    if (!supabase || !confirm('Excluir banner?')) return;
    const { error } = await supabase.from('site_banners').delete().eq('id', id);
    if (error) alert(error.message);
    carregarBanners();
  }

  if (!session) {
    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#001f3f' }}>
        <form onSubmit={login} style={{ width: 420, maxWidth: '92vw', background: '#fff', padding: 28, borderRadius: 20 }}>
          <h1>Admin ES Elétrica RJ</h1>
          <p>Acesso protegido por Supabase Auth.</p>

          <label>E-mail</label>
          <input style={inputStyle} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label>Senha</label>
          <input style={inputStyle} type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />

          <button style={{ ...btn, width: '100%', marginTop: 16 }}>Entrar</button>
          {erro && <p style={{ color: '#b91c1c' }}>{erro}</p>}
        </form>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f1f5f9', display: 'grid', gridTemplateColumns: '250px 1fr' }}>
      <aside style={{ background: '#001f3f', color: '#fff', padding: 20 }}>
        <h2>ES Admin</h2>
        <button style={nav(tab === 'leads')} onClick={() => setTab('leads')}>Leads</button>
        <button style={nav(tab === 'avaliacoes')} onClick={() => setTab('avaliacoes')}>Avaliações</button>
        <button style={nav(tab === 'stories')} onClick={() => setTab('stories')}>Stories</button>
        <button style={nav(tab === 'banners')} onClick={() => setTab('banners')}>Banners</button>
        <button style={danger} onClick={sair}>Sair</button>
      </aside>

      <section style={{ padding: 22 }}>
        {erro && <div style={{ ...card, color: '#b91c1c' }}>{erro}</div>}

        {tab === 'leads' && (
          <div style={card}>
            <h1>Leads</h1>
            <button style={btn} onClick={carregarLeads}>Atualizar</button>
            <div style={{ overflowX: 'auto', marginTop: 16 }}>
              <table style={{ width: '100%', minWidth: 850 }}>
                <thead><tr><th>Nome</th><th>Telefone</th><th>Cidade</th><th>Conta</th><th>Status</th><th>Ações</th></tr></thead>
                <tbody>
                  {leads.map((l) => {
                    const phone = String(l.telefone || '').replace(/\D/g, '');
                    const phoneBR = phone.startsWith('55') ? phone : `55${phone}`;
                    return (
                      <tr key={l.id}>
                        <td>{l.nome}</td>
                        <td>{l.telefone}</td>
                        <td>{l.cidade}</td>
                        <td>{l.conta_luz || l.conta || '-'}</td>
                        <td>
                          <select value={l.status || 'novo'} onChange={(e) => atualizarLead(l.id, e.target.value)}>
                            <option value="novo">Novo</option>
                            <option value="em_contato">Em contato</option>
                            <option value="orcamento_enviado">Orçamento enviado</option>
                            <option value="fechado">Fechado</option>
                            <option value="perdido">Perdido</option>
                          </select>
                        </td>
                        <td>
                          <a href={`https://wa.me/${phoneBR}`} target="_blank">WhatsApp</a> | <a href={`tel:+${phoneBR}`}>Ligar</a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {!leads.length && <p>Nenhum lead encontrado.</p>}
            </div>
          </div>
        )}

        {tab === 'avaliacoes' && (
          <div style={card}>
            <h1>Avaliações pendentes e publicadas</h1>
            <button style={btn} onClick={carregarAvaliacoes}>Atualizar avaliações</button>
            <div style={{ overflowX: 'auto', marginTop: 16 }}>
              <table style={{ width: '100%', minWidth: 980 }}>
                <thead><tr><th>Cliente</th><th>Nota</th><th>Comentário</th><th>Foto/Mídia</th><th>Status</th><th>Ações</th></tr></thead>
                <tbody>
                  {avaliacoes.map((a) => (
                    <tr key={a.id}>
                      <td>{a.nome}<br/><small>{a.email} • {a.cidade}</small></td>
                      <td>{'★'.repeat(Number(a.nota || 5))}</td>
                      <td>{a.comentario}</td>
                      <td>
                        {a.foto_url && <img src={a.foto_url} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />}
                        {a.media_url && <a href={a.media_url} target="_blank"> Ver mídia</a>}
                      </td>
                      <td>{a.status || 'pendente'}</td>
                      <td>
                        <button style={btn} onClick={() => aprovarAvaliacao(a.id)}>Aprovar</button>{' '}
                        <button style={danger} onClick={() => reprovarAvaliacao(a.id)}>Reprovar</button>{' '}
                        <button style={danger} onClick={() => excluirAvaliacao(a.id)}>Excluir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!avaliacoes.length && <p>Nenhuma avaliação encontrada. Confira se o SQL criou a tabela `avaliacoes` e as policies para authenticated.</p>}
            </div>
          </div>
        )}

        {tab === 'stories' && (
          <div style={card}>
            <h1>Stories / vídeos</h1>
            <form onSubmit={salvarStory} style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
              <input style={inputStyle} placeholder="Título" value={storyForm.titulo} onChange={(e) => setStoryForm({ ...storyForm, titulo: e.target.value })} required />
              <select style={inputStyle} value={storyForm.tipo} onChange={(e) => setStoryForm({ ...storyForm, tipo: e.target.value })}>
                <option value="imagem">Imagem</option>
                <option value="video">Vídeo</option>
              </select>
              <input style={inputStyle} placeholder="URL da imagem ou vídeo" value={storyForm.media_url} onChange={(e) => setStoryForm({ ...storyForm, media_url: e.target.value })} required />
              <input style={inputStyle} placeholder="Link" value={storyForm.link_url} onChange={(e) => setStoryForm({ ...storyForm, link_url: e.target.value })} />
              <input style={inputStyle} placeholder="Descrição" value={storyForm.descricao} onChange={(e) => setStoryForm({ ...storyForm, descricao: e.target.value })} />
              <input style={inputStyle} type="number" placeholder="Ordem" value={storyForm.ordem} onChange={(e) => setStoryForm({ ...storyForm, ordem: Number(e.target.value) })} />
              <button style={btn}>Salvar story</button>
            </form>

            {stories.map((s) => (
              <div key={s.id} style={{ ...card, marginTop: 12 }}>
                <b>{s.titulo}</b> — {s.tipo} — {s.ativo || s.publicado ? 'Publicado' : 'Oculto'}
                <br/><small>{s.media_url || s.imagem_url}</small>
                <br/><button style={danger} onClick={() => excluirStory(s.id)}>Excluir</button>
              </div>
            ))}
          </div>
        )}

        {tab === 'banners' && (
          <div style={card}>
            <h1>Banners</h1>
            <form onSubmit={salvarBanner} style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
              <input style={inputStyle} placeholder="Título" value={bannerForm.titulo} onChange={(e) => setBannerForm({ ...bannerForm, titulo: e.target.value })} required />
              <input style={inputStyle} placeholder="Subtítulo" value={bannerForm.subtitulo} onChange={(e) => setBannerForm({ ...bannerForm, subtitulo: e.target.value })} />
              <select style={inputStyle} value={bannerForm.area} onChange={(e) => setBannerForm({ ...bannerForm, area: e.target.value })}>
                <option value="home_topo">Home topo</option>
                <option value="calculadora">Calculadora</option>
                <option value="servicos">Serviços</option>
                <option value="stories">Stories</option>
              </select>
              <input style={inputStyle} placeholder="URL imagem" value={bannerForm.imagem_url} onChange={(e) => setBannerForm({ ...bannerForm, imagem_url: e.target.value })} />
              <input style={inputStyle} placeholder="Link" value={bannerForm.link_url} onChange={(e) => setBannerForm({ ...bannerForm, link_url: e.target.value })} />
              <button style={btn}>Salvar banner</button>
            </form>

            {banners.map((b) => (
              <div key={b.id} style={{ ...card, marginTop: 12 }}>
                <b>{b.area}</b> — {b.titulo} — {b.ativo || b.publicado ? 'Publicado' : 'Oculto'}
                <br/><small>{b.imagem_url}</small>
                <br/><button style={danger} onClick={() => excluirBanner(b.id)}>Excluir</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function nav(active: boolean): React.CSSProperties {
  return {
    width: '100%',
    display: 'block',
    padding: 12,
    marginBottom: 8,
    border: 0,
    borderRadius: 10,
    background: active ? '#facc15' : 'rgba(255,255,255,.1)',
    color: active ? '#001f3f' : '#fff',
    fontWeight: 800,
    cursor: 'pointer',
  };
}
