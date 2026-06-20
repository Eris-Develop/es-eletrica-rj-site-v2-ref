'use client';

import { supabase, supabaseReady } from '@/lib/supabase';
import { useEffect, useMemo, useState } from 'react';
import './admin-premium.css';

type Any = any;

const statusLabels:any = {
  novo: 'Novo',
  em_contato: 'Em contato',
  orcamento_enviado: 'Orçamento enviado',
  fechado: 'Fechado',
  perdido: 'Perdido',
};

const fonts = ['Arial','Inter','Poppins','Montserrat','Georgia','Times New Roman','Courier New'];

function moeda(valor:any) {
  return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function phoneBR(tel:any) {
  const phone = String(tel || '').replace(/\D/g, '');
  return phone.startsWith('55') ? phone : `55${phone}`;
}
function statusClass(status:string) {
  return `status-pill status-${status || 'novo'}`;
}

export default function AdminPage() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [tab, setTab] = useState<'leads'|'avaliacoes'|'stories'|'banners'|'aparencia'|'visitas'>('leads');

  const [leads, setLeads] = useState<Any[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<Any[]>([]);
  const [stories, setStories] = useState<Any[]>([]);
  const [banners, setBanners] = useState<Any[]>([]);

  const [settings, setSettings] = useState<any>({
  id: 1,
  logo_url: '',
  home_banner_url: '',
  home_banner_position: 'center',
  hero_card_image_url: '',
  background_home: '#ffffff',
  background_stories: '#ffffff',
  background_reviews: '#ffffff',
});

const [visitas, setVisitas] = useState<any[]>([]);

  const [storyForm, setStoryForm] = useState({ titulo:'', descricao:'', tipo:'imagem', media_url:'', link_url:'', ativo:true, publicado:true, ordem:1, fonte:'Arial', cor_texto:'#0f172a', tamanho_texto:'16' });
  const [bannerForm, setBannerForm] = useState({ titulo:'', subtitulo:'', area:'home_topo', imagem_url:'', link_url:'', ativo:true, publicado:true, modo_exibicao:'banner', fonte:'Arial', cor_texto:'#ffffff', tamanho_texto:'26' });

  useEffect(() => {
    if (!supabaseReady || !supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) carregarTudo();
    });
  }, []);

  async function login(e:any) {
    e.preventDefault(); setErro('');
    if (!supabaseReady || !supabase) return setErro('Supabase não configurado.');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) return setErro(error.message);
    setSession(data.session); carregarTudo();
  }
  async function sair(){ await supabase?.auth.signOut(); setSession(null); }
  async function carregarTudo(){ await Promise.all([
  carregarLeads(),
  carregarAvaliacoes(),
  carregarStories(),
  carregarBanners(),
  carregarSettings(),
  carregarVisitas()
]); }

  async function carregarLeads(){
    if(!supabase) return;
    const {data,error}=await supabase.from('leads').select('*').order('created_at',{ascending:false});
    if(error) return setErro(error.message);
    setLeads(data||[]);
  }
  async function atualizarLead(id:string,status:string){
    if(!supabase) return;
    const {error}=await supabase.from('leads').update({status}).eq('id',id);
    if(error) alert(error.message);
    carregarLeads();
  }

  async function carregarAvaliacoes(){
    if(!supabase) return;
    const {data,error}=await supabase.from('avaliacoes').select('*').order('created_at',{ascending:false});
    if(error) return setErro(error.message);
    setAvaliacoes(data||[]);
  }
  async function alternarAvaliacao(a:any){
    if(!supabase) return;
    const aprovado=!(a.aprovado===true || a.status==='aprovado');
    const {error}=await supabase.from('avaliacoes').update({aprovado,status:aprovado?'aprovado':'reprovado'}).eq('id',a.id);
    if(error) alert(error.message);
    carregarAvaliacoes();
  }
  async function excluirAvaliacao(id:string){
    if(!supabase || !confirm('Excluir avaliação?')) return;
    const {error}=await supabase.from('avaliacoes').delete().eq('id',id);
    if(error) alert(error.message);
    carregarAvaliacoes();
  }

  async function carregarStories(){
    if(!supabase) return;
    const {data,error}=await supabase.from('site_stories').select('*').order('ordem',{ascending:true});
    if(error) return setErro(error.message);
    setStories(data||[]);
  }
  async function uploadSiteMedia(file:File,pasta:string){
    if(!supabase) return '';
    const ext=file.name.split('.').pop();
    const path=`${pasta}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const {error}=await supabase.storage.from('site-media').upload(path,file,{cacheControl:'3600',upsert:false});
    if(error) throw error;
    const {data}=supabase.storage.from('site-media').getPublicUrl(path);
    return data.publicUrl;
  }
  async function uploadStory(e:any){
    const file=e.target.files?.[0]; if(!file) return;
    try{
      const url=await uploadSiteMedia(file,'stories');
      setStoryForm({...storyForm,media_url:url,tipo:file.type.startsWith('video')?'video':'imagem'});
    }catch(err:any){alert(err.message)}
  }
  async function salvarStory(e:any){
    e.preventDefault(); if(!supabase) return;
    const {error}=await supabase.from('site_stories').insert(storyForm);
    if(error) return alert(error.message);
    setStoryForm({titulo:'',descricao:'',tipo:'imagem',media_url:'',link_url:'',ativo:true,publicado:true,ordem:1,fonte:'Arial',cor_texto:'#0f172a',tamanho_texto:'16'});
    carregarStories();
  }
  async function excluirStory(id:string){
    if(!supabase || !confirm('Excluir story?')) return;
    const {error}=await supabase.from('site_stories').delete().eq('id',id);
    if(error) alert(error.message);
    carregarStories();
  }

  async function carregarBanners(){
    if(!supabase) return;
    const {data,error}=await supabase.from('site_banners').select('*').order('created_at',{ascending:false});
    if(error) return setErro(error.message);
    setBanners(data||[]);
  }
  async function uploadBanner(e:any){
    const file=e.target.files?.[0]; if(!file) return;
    try{
      const url=await uploadSiteMedia(file,'banners');
      setBannerForm({...bannerForm,imagem_url:url});
    }catch(err:any){alert(err.message)}
  }
  async function salvarBanner(e:any){
    e.preventDefault(); if(!supabase) return;
    const {error}=await supabase.from('site_banners').insert(bannerForm);
    if(error) return alert(error.message);
    setBannerForm({titulo:'',subtitulo:'',area:'home_topo',imagem_url:'',link_url:'',ativo:true,publicado:true,modo_exibicao:'banner',fonte:'Arial',cor_texto:'#ffffff',tamanho_texto:'26'});
    carregarBanners();
  }
  async function excluirBanner(id:string){
    if(!supabase || !confirm('Excluir banner?')) return;
    const {error}=await supabase.from('site_banners').delete().eq('id',id);
    if(error) alert(error.message);
    carregarBanners();
  }

  async function carregarSettings() {
  if (!supabase) return;
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single();

  if (!error && data) setSettings(data);
}

async function salvarSettings(e: any) {
  e.preventDefault();
  if (!supabase) return;

  const { error } = await supabase
    .from('site_settings')
    .upsert({ ...settings, id: 1 });

  if (error) return alert(error.message);
  alert('Aparência salva com sucesso!');
}

async function carregarVisitas() {
  if (!supabase) return;
  const { data } = await supabase
    .from('site_visits')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  setVisitas(data || []);
}

async function excluirLead(id: string) {
  if (!supabase || !confirm('Apagar este lead?')) return;
  const { error } = await supabase.from('leads').delete().eq('id', id);
  if (error) return alert(error.message);
  carregarLeads();
}

  const stats=useMemo(()=>({total:leads.length,novos:leads.filter(l=>!l.status||l.status==='novo').length,contato:leads.filter(l=>l.status==='em_contato').length,fechado:leads.filter(l=>l.status==='fechado').length}),[leads]);

  if(!session){
    return <main style={{minHeight:'100vh',display:'grid',placeItems:'center',background:'#001f3f'}}>
      <form onSubmit={login} className="admin-card" style={{width:430,maxWidth:'92vw'}}>
        <h1>Admin ES Elétrica RJ</h1><p>Acesso protegido por Supabase Auth.</p>
        <label>E-mail</label><input className="admin-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <label>Senha</label><input className="admin-input" type="password" value={senha} onChange={e=>setSenha(e.target.value)} required />
        <button className="action-btn action-primary" style={{width:'100%',marginTop:16}}>Entrar</button>
        {erro&&<p style={{color:'#b91c1c'}}>{erro}</p>}
      </form>
    </main>
  }

  return <main className="admin-premium">
    <aside className="admin-sidebar">
      <h2>ES Admin</h2><p>Painel de leads, avaliações, stories e banners.</p>
      <button className={`admin-nav-btn ${tab==='leads'?'active':''}`} onClick={()=>setTab('leads')}>Leads</button>
      <button className={`admin-nav-btn ${tab==='avaliacoes'?'active':''}`} onClick={()=>setTab('avaliacoes')}>Avaliações</button>
      <button className={`admin-nav-btn ${tab==='stories'?'active':''}`} onClick={()=>setTab('stories')}>Stories / Vídeos</button>
      <button className={`admin-nav-btn ${tab==='banners'?'active':''}`} onClick={()=>setTab('banners')}>Banners</button>
      <button className={`admin-nav-btn ${tab==='aparencia'?'active':''}`} onClick={()=>setTab('aparencia')}>Aparência</button>
      <button className={`admin-nav-btn ${tab==='visitas'?'active':''}`} onClick={()=>setTab('visitas')}>Visitantes</button>
      <button className="action-btn action-danger" style={{width:'100%',marginTop:20}} onClick={sair}>Sair</button>
    </aside>

    <section className="admin-main">
      {tab==='leads'&&<>
        <div className="admin-grid-stats">
          <div className="admin-stat"><small>Total</small><strong>{stats.total}</strong></div>
          <div className="admin-stat"><small>Novos</small><strong>{stats.novos}</strong></div>
          <div className="admin-stat"><small>Em contato</small><strong>{stats.contato}</strong></div>
          <div className="admin-stat"><small>Fechados</small><strong>{stats.fechado}</strong></div>
        </div>
        <div className="admin-card">
          <div className="admin-title-row"><h1>Leads</h1><button className="action-btn action-primary" onClick={carregarLeads}>Atualizar</button></div>
          <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Nome</th><th>Telefone</th><th>Cidade</th><th>Conta</th><th>Status</th><th>Ações</th></tr></thead><tbody>
          {leads.map(l=>{
            const status=l.status||'novo';
            return <tr key={l.id}>
              <td><strong>{l.nome}</strong><br/><small>{l.email||'-'}</small></td><td>{l.telefone}</td><td>{l.cidade||'-'}</td><td>{moeda(l.conta_luz||l.conta)}</td>
              <td><div style={{display:'grid',gap:8}}><span className={statusClass(status)}>● {statusLabels[status]||status}</span><select className="admin-select" value={status} onChange={e=>atualizarLead(l.id,e.target.value)}><option value="novo">Novo</option><option value="em_contato">Em contato</option><option value="orcamento_enviado">Orçamento enviado</option><option value="fechado">Fechado</option><option value="perdido">Perdido</option></select></div></td>
              <td><div className="action-row"><a className="action-btn action-whatsapp" href={`https://wa.me/${phoneBR(l.telefone)}`} target="_blank">🟢 WhatsApp</a><a className="action-btn action-phone" href={`tel:+${phoneBR(l.telefone)}`}>📞 Ligar</a>{l.email&&<a className="action-btn action-email" href={`mailto:${l.email}`}>✉️ E-mail</a>}<button className="action-btn action-danger" onClick={()=>excluirLead(l.id)}>🗑 Excluir</button></div></td>
            </tr>
          })}
          </tbody></table></div>
        </div>
      </>}

      {tab==='avaliacoes'&&<div className="admin-card">
        <div className="admin-title-row"><h1>Avaliações</h1><button className="action-btn action-primary" onClick={carregarAvaliacoes}>Atualizar</button></div>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Cliente</th><th>Nota</th><th>Comentário</th><th>Foto / Mídia</th><th>Status</th><th>Aprovação</th><th>Excluir</th></tr></thead><tbody>
        {avaliacoes.map(a=>{
          const aprovado=a.aprovado===true||a.status==='aprovado';
          return <tr key={a.id}>
            <td><strong>{a.nome}</strong><br/><small>{a.email||'-'} • {a.cidade||'-'}</small></td><td>{'★'.repeat(Number(a.nota||5))}</td><td>{a.comentario}</td>
            <td>{a.foto_url&&<img src={a.foto_url} style={{width:44,height:44,borderRadius:'50%',objectFit:'cover'}}/>} {a.media_url&&<a className="action-btn action-primary" href={a.media_url} target="_blank">Ver mídia</a>}</td>
            <td><span className={statusClass(aprovado?'aprovado':'reprovado')}>● {aprovado?'Aprovado':'Reprovado/Pendente'}</span></td>
            <td><button className={`action-btn ${aprovado?'action-approved':'action-danger'}`} onClick={()=>alternarAvaliacao(a)}>{aprovado?'✅ Aprovado':'❌ Reprovado'}</button></td>
            <td><button className="action-btn action-danger" onClick={()=>excluirAvaliacao(a.id)}>Excluir</button></td>
          </tr>
        })}
        </tbody></table></div>
      </div>}

      {tab==='stories'&&<div className="admin-card">
        <h1>Stories / Vídeos</h1>
        <form className="admin-form-grid" onSubmit={salvarStory}>
          <input className="admin-input" placeholder="Título" value={storyForm.titulo} onChange={e=>setStoryForm({...storyForm,titulo:e.target.value})} required/>
          <select className="admin-select-full" value={storyForm.tipo} onChange={e=>setStoryForm({...storyForm,tipo:e.target.value})}><option value="imagem">Imagem</option><option value="video">Vídeo</option></select>
          <input className="admin-input" type="file" accept="image/*,video/*" onChange={uploadStory}/>
          <input className="admin-input" placeholder="URL da imagem ou vídeo" value={storyForm.media_url} onChange={e=>setStoryForm({...storyForm,media_url:e.target.value})}/>
          <input className="admin-input" placeholder="Link" value={storyForm.link_url} onChange={e=>setStoryForm({...storyForm,link_url:e.target.value})}/>
          <input className="admin-input" type="number" placeholder="Ordem" value={storyForm.ordem} onChange={e=>setStoryForm({...storyForm,ordem:Number(e.target.value)})}/>
          <select className="admin-select-full" value={storyForm.fonte} onChange={e=>setStoryForm({...storyForm,fonte:e.target.value})}>{fonts.map(f=><option key={f}>{f}</option>)}</select>
          <input className="admin-input" type="color" value={storyForm.cor_texto} onChange={e=>setStoryForm({...storyForm,cor_texto:e.target.value})}/>
          <textarea className="admin-textarea" placeholder="Descrição" value={storyForm.descricao} onChange={e=>setStoryForm({...storyForm,descricao:e.target.value})}/>
          <div className="admin-font-preview" style={{fontFamily:storyForm.fonte,color:storyForm.cor_texto,fontSize:Number(storyForm.tamanho_texto)}}>Prévia: {storyForm.titulo||'Título do story'}</div>
          <button className="action-btn action-primary">Salvar story</button>
        </form>
        {stories.map(s=><div className="admin-card" key={s.id}><strong>{s.titulo}</strong> — {s.tipo}<br/><small>{s.media_url}</small><br/><button className="action-btn action-danger" onClick={()=>excluirStory(s.id)}>Excluir</button></div>)}
      </div>}

      {tab==='banners'&&<div className="admin-card">
        <h1>Banners</h1>
        <form className="admin-form-grid" onSubmit={salvarBanner}>
          <input className="admin-input" placeholder="Título" value={bannerForm.titulo} onChange={e=>setBannerForm({...bannerForm,titulo:e.target.value})} required/>
          <input className="admin-input" placeholder="Subtítulo" value={bannerForm.subtitulo} onChange={e=>setBannerForm({...bannerForm,subtitulo:e.target.value})}/>
          <select className="admin-select-full" value={bannerForm.area} onChange={e=>setBannerForm({...bannerForm,area:e.target.value})}><option value="home_topo">Home topo</option><option value="calculadora">Calculadora</option><option value="servicos">Serviços</option><option value="stories">Stories</option></select>
          <select className="admin-select-full" value={bannerForm.modo_exibicao} onChange={e=>setBannerForm({...bannerForm,modo_exibicao:e.target.value})}><option value="banner">Banner normal</option><option value="background">Background da área</option></select>
          <input className="admin-input" type="file" accept="image/*" onChange={uploadBanner}/>
          <input className="admin-input" placeholder="URL da imagem" value={bannerForm.imagem_url} onChange={e=>setBannerForm({...bannerForm,imagem_url:e.target.value})}/>
          <input className="admin-input" placeholder="Link" value={bannerForm.link_url} onChange={e=>setBannerForm({...bannerForm,link_url:e.target.value})}/>
          <select className="admin-select-full" value={bannerForm.fonte} onChange={e=>setBannerForm({...bannerForm,fonte:e.target.value})}>{fonts.map(f=><option key={f}>{f}</option>)}</select>
          <input className="admin-input" type="color" value={bannerForm.cor_texto} onChange={e=>setBannerForm({...bannerForm,cor_texto:e.target.value})}/>
          <div className="admin-font-preview" style={{fontFamily:bannerForm.fonte,color:bannerForm.cor_texto,fontSize:Number(bannerForm.tamanho_texto)}}>Prévia: {bannerForm.titulo||'Título do banner'}</div>
          <button className="action-btn action-primary">Salvar banner</button>
        </form>
        {banners.map(b=><div className="admin-card" key={b.id}><strong>{b.area}</strong> — {b.titulo} — {b.modo_exibicao||'banner'}<br/><small>{b.imagem_url}</small><br/><button className="action-btn action-danger" onClick={()=>excluirBanner(b.id)}>Excluir</button></div>)}
      </div>}

      {tab==='aparencia'&&<div className="admin-card">
        <div className="admin-title-row"><h1>Aparência do Site</h1><button className="action-btn action-primary" onClick={carregarSettings}>Atualizar</button></div>
        <form className="admin-form-grid" onSubmit={salvarSettings}>
          <label>Logo do site</label>
          <input className="admin-input" placeholder="URL da logo" value={settings.logo_url||''} onChange={e=>setSettings({...settings,logo_url:e.target.value})}/>
          <input className="admin-input" type="file" accept="image/*" onChange={async e=>{const file=e.target.files?.[0]; if(!file)return; try{const url=await uploadSiteMedia(file,'aparencia'); setSettings({...settings,logo_url:url});}catch(err:any){alert(err.message)}}}/>
          {settings.logo_url&&<div className="admin-font-preview"><img src={settings.logo_url} style={{maxWidth:180,maxHeight:80,objectFit:'contain'}}/></div>}

          <label>Banner background da Home</label>
          <input className="admin-input" placeholder="URL do banner da home" value={settings.home_banner_url||''} onChange={e=>setSettings({...settings,home_banner_url:e.target.value})}/>
          <input className="admin-input" type="file" accept="image/*" onChange={async e=>{const file=e.target.files?.[0]; if(!file)return; try{const url=await uploadSiteMedia(file,'home'); setSettings({...settings,home_banner_url:url});}catch(err:any){alert(err.message)}}}/>

          <label>Posição do banner</label>
          <select className="admin-select-full" value={settings.home_banner_position||'center'} onChange={e=>setSettings({...settings,home_banner_position:e.target.value})}>
            <option value="center">Centro</option>
            <option value="top">Topo</option>
            <option value="bottom">Baixo</option>
            <option value="left">Esquerda</option>
            <option value="right">Direita</option>
          </select>

          <label>Imagem do bloco Próximo Passo</label>
          <input className="admin-input" placeholder="URL da imagem do bloco" value={settings.hero_card_image_url||''} onChange={e=>setSettings({...settings,hero_card_image_url:e.target.value})}/>
          <input className="admin-input" type="file" accept="image/*" onChange={async e=>{const file=e.target.files?.[0]; if(!file)return; try{const url=await uploadSiteMedia(file,'hero-card'); setSettings({...settings,hero_card_image_url:url});}catch(err:any){alert(err.message)}}}/>

          <label>Cor de fundo Home</label>
          <input className="admin-input" type="color" value={settings.background_home||'#ffffff'} onChange={e=>setSettings({...settings,background_home:e.target.value})}/>
          <label>Cor de fundo Stories</label>
          <input className="admin-input" type="color" value={settings.background_stories||'#ffffff'} onChange={e=>setSettings({...settings,background_stories:e.target.value})}/>
          <label>Cor de fundo Avaliações</label>
          <input className="admin-input" type="color" value={settings.background_reviews||'#ffffff'} onChange={e=>setSettings({...settings,background_reviews:e.target.value})}/>

          <div className="admin-font-preview" style={{background:settings.background_home||'#fff',padding:20,borderRadius:16}}>Exemplo Home</div>
          <div className="admin-font-preview" style={{background:settings.background_stories||'#fff',padding:20,borderRadius:16}}>Exemplo Stories</div>
          <div className="admin-font-preview" style={{background:settings.background_reviews||'#fff',padding:20,borderRadius:16}}>Exemplo Avaliações</div>

          <button className="action-btn action-primary">Salvar aparência</button>
        </form>
      </div>}

      {tab==='visitas'&&<div className="admin-card">
        <div className="admin-title-row"><h1>Visitantes</h1><button className="action-btn action-primary" onClick={carregarVisitas}>Atualizar</button></div>
        <div className="admin-grid-stats">
          <div className="admin-stat"><small>Total carregado</small><strong>{visitas.length}</strong></div>
          <div className="admin-stat"><small>Última visita</small><strong>{visitas[0]?.created_at ? new Date(visitas[0].created_at).toLocaleString('pt-BR') : '-'}</strong></div>
        </div>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Página</th><th>Origem</th><th>Cidade/Estado</th><th>Data</th><th>Navegador</th></tr></thead><tbody>
          {visitas.map(v=><tr key={v.id}>
            <td>{v.page||'-'}</td>
            <td>{v.origem||'-'}</td>
            <td>{v.cidade||'-'} {v.estado?`/ ${v.estado}`:''}</td>
            <td>{v.created_at ? new Date(v.created_at).toLocaleString('pt-BR') : '-'}</td>
            <td><small>{v.user_agent||'-'}</small></td>
          </tr>)}
        </tbody></table></div>
      </div>}

    </section>
  </main>
}
