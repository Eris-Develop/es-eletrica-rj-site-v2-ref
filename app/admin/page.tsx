/*'use client';
import { useEffect, useState } from 'react';
import { supabase, supabaseReady } from '@/lib/supabase';

type Lead={id:string;nome:string;telefone:string;cidade:string;conta:number;sistema_kwp:number;created_at:string};
export default function Admin(){
 const [email,setEmail]=useState(''); const [senha,setSenha]=useState(''); const [session,setSession]=useState<any>(null); const [leads,setLeads]=useState<Lead[]>([]); const [msg,setMsg]=useState('');
 useEffect(()=>{ if(!supabase) return; supabase.auth.getSession().then(({data})=>setSession(data.session));},[]);
 async function login(e:any){e.preventDefault();setMsg(''); if(!supabaseReady||!supabase){setMsg('Configure o Supabase no .env.local e no Netlify.');return} const {data,error}=await supabase.auth.signInWithPassword({email,password:senha}); if(error){setMsg(error.message);return} setSession(data.session); carregar();}
 async function sair(){await supabase?.auth.signOut(); setSession(null)}
 async function carregar(){ if(!supabase) return; const {data,error}=await supabase.from('leads').select('*').order('created_at',{ascending:false}).limit(50); if(error){setMsg('Sem permissão ou tabela não criada. Rode o SQL.');return} setLeads(data||[])}
 useEffect(()=>{ if(session) carregar()},[session]);
 if(!session) return <main className="section"><div className="container" style={{maxWidth:520}}><div className="card"><h1>Área Admin</h1><p>Login seguro pelo Supabase Auth. Crie seu usuário no Supabase e aplique as políticas do SQL.</p><form className="form" onSubmit={login}><div className="field"><label>E-mail</label><input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)}/></div><div className="field"><label>Senha</label><input className="input" type="password" value={senha} onChange={e=>setSenha(e.target.value)}/></div><button className="btn btn-blue">Entrar</button>{msg&&<p style={{color:'#b91c1c'}}>{msg}</p>}</form></div></div></main>;
 return <main className="admin-shell"><aside className="admin-side"><h2>ES Admin</h2><p>Leads, avaliações, posts, stories e configurações.</p><button className="btn btn-primary" onClick={sair}>Sair</button></aside><section className="admin-main"><div className="admin-card"><h1>Painel administrativo</h1><p>Esta V2 já salva leads no banco. Próxima etapa: CRUD completo de posts, stories e avaliações com upload no Storage.</p><button className="btn btn-blue" onClick={carregar}>Atualizar leads</button></div><div className="admin-card"><h2>Leads da calculadora solar</h2><table className="table"><thead><tr><th>Data</th><th>Nome</th><th>WhatsApp</th><th>Cidade</th><th>Conta</th><th>kWp</th></tr></thead><tbody>{leads.map(l=><tr key={l.id}><td>{new Date(l.created_at).toLocaleDateString('pt-BR')}</td><td>{l.nome}</td><td>{l.telefone}</td><td>{l.cidade}</td><td>R$ {Number(l.conta||0).toFixed(2)}</td><td>{Number(l.sistema_kwp||0).toFixed(2)}</td></tr>)}</tbody></table>{!leads.length&&<p>Nenhum lead encontrado.</p>}</div><div className="admin-card"><h2>Segurança implementada</h2><ul><li>Sem senha de e-mail exposta no código.</li><li>Chaves sensíveis fora do front-end.</li><li>Supabase Auth para admin.</li><li>RLS no banco via SQL.</li><li>LGPD com consentimento e política.</li></ul></div></section></main>
}
*/

'use client';

import { useEffect, useState } from 'react';
import { supabase, supabaseReady } from '@/lib/supabase';
import Header from '@/components/Header';

type Lead = {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  cidade?: string;
  conta_luz?: number;
  interesse?: string;
  mensagem?: string;
  origem?: string;
  status?: string;
  created_at?: string;
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  async function carregarLeads() {
    setLoading(true);
    setErro('');

    if (!supabaseReady || !supabase) {
      setErro('Supabase não configurado.');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setErro(error.message);
    } else {
      setLeads(data || []);
    }

    setLoading(false);
  }

  async function atualizarStatus(id: string, status: string) {
    if (!supabase) return;

    const { error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', id);

    if (error) {
      alert(error.message);
      return;
    }

    carregarLeads();
  }

  useEffect(() => {
    carregarLeads();
  }, []);

  return (
    <>
      <Header />

      <main className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="badge">Admin</span>
              <h1>Leads recebidos</h1>
              <p className="muted">
                Lista de clientes captados pela calculadora solar e formulários do site.
              </p>
            </div>

            <button className="btn btn-primary" onClick={carregarLeads}>
              Atualizar
            </button>
          </div>

          {loading && <p>Carregando leads...</p>}

          {erro && (
            <div className="lead-err" style={{ display: 'block' }}>
              {erro}
            </div>
          )}

          {!loading && leads.length === 0 && (
            <div className="card">
              <h3>Nenhum lead encontrado</h3>
              <p className="muted">
                Quando alguém usar a calculadora solar, os dados aparecerão aqui.
              </p>
            </div>
          )}

          {!loading && leads.length > 0 && (
            <div className="card" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
                <thead>
                  <tr>
                    <th style={th}>Data</th>
                    <th style={th}>Nome</th>
                    <th style={th}>Telefone</th>
                    <th style={th}>Cidade</th>
                    <th style={th}>Conta</th>
                    <th style={th}>Interesse</th>
                    <th style={th}>Status</th>
                    <th style={th}>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id}>
                      <td style={td}>
                        {lead.created_at
                          ? new Date(lead.created_at).toLocaleDateString('pt-BR')
                          : '-'}
                      </td>

                      <td style={td}>
                        <strong>{lead.nome}</strong>
                        <br />
                        <small>{lead.email || '-'}</small>
                      </td>

                      <td style={td}>
                        <a
                          href={`https://wa.me/55${String(lead.telefone || '').replace(/\D/g, '')}`}
                          target="_blank"
                        >
                          {lead.telefone}
                        </a>
                      </td>

                      <td style={td}>{lead.cidade || '-'}</td>

                      <td style={td}>
                        {lead.conta_luz
                          ? lead.conta_luz.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })
                          : '-'}
                      </td>

                      <td style={td}>{lead.interesse || '-'}</td>

                      <td style={td}>
                        <span className="badge">{lead.status || 'novo'}</span>
                      </td>

                      <td style={td}>
                        <select
                          value={lead.status || 'novo'}
                          onChange={(e) => atualizarStatus(lead.id, e.target.value)}
                          style={{
                            padding: 8,
                            borderRadius: 8,
                            border: '1px solid #cbd5e1',
                          }}
                        >
                          <option value="novo">Novo</option>
                          <option value="em_contato">Em contato</option>
                          <option value="orcamento_enviado">Orçamento enviado</option>
                          <option value="fechado">Fechado</option>
                          <option value="perdido">Perdido</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

const th: React.CSSProperties = {
  textAlign: 'left',
  padding: '12px',
  borderBottom: '1px solid #e2e8f0',
  fontSize: 13,
  color: '#475569',
};

const td: React.CSSProperties = {
  padding: '12px',
  borderBottom: '1px solid #e2e8f0',
  verticalAlign: 'top',
  fontSize: 14,
};