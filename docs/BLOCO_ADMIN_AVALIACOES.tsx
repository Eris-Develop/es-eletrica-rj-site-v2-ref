// BLOCO PARA COLAR NO app/admin/page.tsx

// 1) Adicione 'avaliacoes' no tipo da aba:
// const [tab, setTab] = useState<'leads'|'avaliacoes'|'stories'|'banners'|'updates'|'analytics'|'checkout'>('leads');

// 2) Adicione estes type/state/funções dentro do componente AdminPage:

type Avaliacao = {
  id: string;
  nome: string;
  cidade?: string;
  telefone?: string;
  servico?: string;
  nota: number;
  comentario: string;
  status?: string;
  aprovado?: boolean;
  created_at?: string;
};

const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);

async function carregarAvaliacoes() {
  if (!supabase) return;
  const { data, error } = await supabase
    .from('avaliacoes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    setErro(error.message);
    return;
  }

  setAvaliacoes(data || []);
}

async function aprovarAvaliacao(id: string) {
  if (!supabase) return;
  const { error } = await supabase
    .from('avaliacoes')
    .update({ aprovado: true, status: 'aprovado' })
    .eq('id', id);

  if (error) alert(error.message);
  carregarAvaliacoes();
}

async function reprovarAvaliacao(id: string) {
  if (!supabase) return;
  const { error } = await supabase
    .from('avaliacoes')
    .update({ aprovado: false, status: 'reprovado' })
    .eq('id', id);

  if (error) alert(error.message);
  carregarAvaliacoes();
}

async function excluirAvaliacao(id: string) {
  if (!supabase) return;
  if (!confirm('Excluir avaliação?')) return;

  const { error } = await supabase
    .from('avaliacoes')
    .delete()
    .eq('id', id);

  if (error) alert(error.message);
  carregarAvaliacoes();
}

// 3) Dentro de carregarTudo(), adicione:
// carregarAvaliacoes(),

// 4) No menu lateral, adicione:
// <button style={navBtn(tab === 'avaliacoes')} onClick={() => setTab('avaliacoes')}>Avaliações</button>

// 5) No JSX principal, adicione este bloco:

{tab === 'avaliacoes' && (
  <section style={panel}>
    <div style={panelHead}>
      <div>
        <h1>Avaliações dos clientes</h1>
        <p style={{ color: '#64748b' }}>Aprove apenas avaliações reais que podem aparecer no site.</p>
      </div>
      <button style={primaryBtnSmall} onClick={carregarAvaliacoes}>Atualizar</button>
    </div>

    <div style={{ overflowX: 'auto' }}>
      <table style={table}>
        <thead>
          <tr>
            <th style={th}>Data</th>
            <th style={th}>Cliente</th>
            <th style={th}>Serviço</th>
            <th style={th}>Nota</th>
            <th style={th}>Comentário</th>
            <th style={th}>Status</th>
            <th style={th}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {avaliacoes.map(a => (
            <tr key={a.id}>
              <td style={td}>{a.created_at ? new Date(a.created_at).toLocaleDateString('pt-BR') : '-'}</td>
              <td style={td}><b>{a.nome}</b><br/><small>{a.cidade || '-'} • {a.telefone || '-'}</small></td>
              <td style={td}>{a.servico || '-'}</td>
              <td style={td}>{'★'.repeat(Number(a.nota || 5))}</td>
              <td style={td}>{a.comentario}</td>
              <td style={td}>{a.status || 'pendente'}</td>
              <td style={td}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button style={smallAction as any} onClick={() => aprovarAvaliacao(a.id)}>Aprovar</button>
                  <button style={dangerBtnSmall} onClick={() => reprovarAvaliacao(a.id)}>Reprovar</button>
                  <button style={dangerBtnSmall} onClick={() => excluirAvaliacao(a.id)}>Excluir</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!avaliacoes.length && <p>Nenhuma avaliação recebida.</p>}
    </div>
  </section>
)}
