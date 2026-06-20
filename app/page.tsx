
import PublicBanners from '@/components/PublicBanners';
import PublicReviews from '@/components/PublicReviews';
import SolarCalculator from '@/components/SolarCalculator';

export default function Home() {
  return (
    <main>
      <section className="hero">
<PublicBanners area="home_topo" />
        <div className="container">

          <div>
            <div className="eyebrow" style={{ color: '#ffdf66' }}>
              Energia • Segurança • Automação
              <PublicBanners area="home_topo" />
            </div>

            <h1>Projeto profissional para economizar, proteger e modernizar seu imóvel.</h1>

            <p>
              Site inspirado no projeto original da ES Elétrica RJ, agora com visual mais forte,
              calculadora solar, captação de leads, avaliações reais, LGPD e integração segura
              com Supabase.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a className="btn btn-primary" href="#calculadora">
                Calcular energia solar
              </a>

              <a className="btn btn-outline" href="/stories">
                Ver obras e stories
              </a>
            </div>

            <div className="meter">
              <div className="metric">
                <b>95%</b>
                <span>economia possível</span>
              </div>

              <div className="metric">
                <b>5 anos</b>
                <span>garantia instalação</span>
              </div>

              <div className="metric">
                <b>RJ</b>
                <span>Niterói e região</span>
              </div>
            </div>
          </div>

          <div className="hero-card">
            <h2>Atendimento técnico e comercial</h2>

            <p>
              Energia solar on-grid, instalações elétricas NBR 5410, CFTV, alarmes,
              automação residencial e manutenção.
            </p>

            <div
              className="card"
              style={{ background: 'rgba(255,255,255,.95)', color: '#0f172a' }}
            >
              <b>Próximo passo:</b>
              <br />
              Faça a simulação, salve o lead no banco e receba atendimento da equipe.
            </div>
          </div>
        </div>

      </section>

      <section className="section" id="servicos">
        <div className="container">
          <div className="section-title">
            <div className="eyebrow">Áreas de atuação</div>
            <h2>Soluções completas da ES Elétrica RJ</h2>
            <p>
              Baseado nas áreas do site de referência, com apresentação mais moderna,
              responsiva e pronta para SEO.
            </p>
          </div>

          <div className="services">
            <div className="card service">
              <div className="icon">☀️</div>
              <h3>Energia Solar</h3>
              <p>Projetos fotovoltaicos personalizados, homologação, instalação e suporte pós-venda.</p>
            </div>

            <div className="card service">
              <div className="icon">⚡</div>
              <h3>Instalações Elétricas</h3>
              <p>Reformas, quadros, DR, DPS, aterramento, circuitos dedicados e padrão seguro.</p>
            </div>

            <div className="card service">
              <div className="icon">🎥</div>
              <h3>Segurança Eletrônica</h3>
              <p>CFTV, alarmes, sensores, controle de acesso, concertina e monitoramento.</p>
            </div>

            <div className="card service">
              <div className="icon">🏠</div>
              <h3>Automação Residencial</h3>
              <p>Iluminação, climatização, áudio, vídeo e controle inteligente pelo celular.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="calculadora">
        <div className="container">
          <div className="section-title">
            <div className="eyebrow">Simulação solar</div>
            <h2>Calculadora solar com captura de lead</h2>
            <p>O cliente calcula a economia e os dados ficam salvos no Supabase para atendimento.</p>
          </div>

          <SolarCalculator />
        </div>
      </section>

      <section className="section" id="avaliacoes">
        <div className="container">
          <div className="section-title">
            <div className="eyebrow">Prova social</div>
            <h2>Avaliações de clientes</h2>
            <p>
              Avaliações reais enviadas por clientes. Elas só aparecem no site após aprovação
              na área admin.
            </p>
          </div>

          <PublicReviews />

          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <a className="btn btn-outline" href="/avaliar">
              Deixar uma avaliação
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta">
            <div>
              <h2 style={{ margin: 0 }}>Quer orçamento técnico profissional?</h2>
              <p>
                Fale com a ES Elétrica RJ e receba atendimento para sua casa, comércio ou empresa.
              </p>
            </div>

            <a
              className="btn btn-primary"
              href="https://wa.me/5521998415889"
              target="_blank"
            >
              Chamar no WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}