'use client';

import { useEffect, useMemo, useState } from 'react';
import PublicReviews from '@/components/PublicReviews';
import SolarCalculator from '@/components/SolarCalculator';
import { supabase, supabaseReady } from '@/lib/supabase';

type SiteSettings = {
  id?: number;
  logo_url?: string;
  home_banner_url?: string;
  home_banner_position?: string;
  hero_card_image_url?: string;
  background_home?: string;
  background_reviews?: string;
};

const defaultSettings: SiteSettings = {
  id: 1,
  logo_url: '',
  home_banner_url: '',
  home_banner_position: 'center',
  hero_card_image_url: '',
  background_home: '#001f3f',
  background_reviews: '#ffffff',
};

function bgPosition(pos?: string) {
  const map: Record<string, string> = {
    center: 'center center',
    left: 'left center',
    right: 'right center',
    top: 'center top',
    bottom: 'center bottom',
  };
  return map[pos || 'center'] || 'center center';
}

export default function Home() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    async function carregarConfiguracoes() {
      if (!supabaseReady || !supabase) return;
      const { data } = await supabase.from('site_settings').select('*').eq('id', 1).single();
      if (data) setSettings({ ...defaultSettings, ...data });
    }

    async function registrarVisita() {
      if (!supabaseReady || !supabase) return;
      try {
        const params = new URLSearchParams(window.location.search);
        const origem = params.get('utm_source') || params.get('ref') || document.referrer || 'direto';
        await supabase.from('site_visits').insert({
          page: window.location.pathname || '/',
          origem,
          user_agent: navigator.userAgent,
        });
      } catch {}
    }

    carregarConfiguracoes();
    registrarVisita();
  }, []);

  const heroStyle = useMemo(() => {
    const style: React.CSSProperties = {
      backgroundColor: settings.background_home || '#001f3f',
      position: 'relative',
      overflow: 'hidden',
    };

    if (settings.home_banner_url) {
      style.backgroundImage = `linear-gradient(90deg, rgba(0,31,63,.94), rgba(0,31,63,.72), rgba(0,31,63,.50)), url("${settings.home_banner_url}")`;
      style.backgroundSize = 'cover';
      style.backgroundPosition = bgPosition(settings.home_banner_position);
      style.backgroundRepeat = 'no-repeat';
    }

    return style;
  }, [settings]);

  return (
    <main>
      <section className="hero" style={heroStyle}>
        <div className="container">
          <div>
            {settings.logo_url && (
              <div style={{ width: 190, height: 82, borderRadius: 18, background: 'rgba(255,255,255,.96)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12, marginBottom: 18, boxShadow: '0 18px 45px rgba(0,0,0,.25)' }}>
                <img src={settings.logo_url} alt="ES Elétrica RJ" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
            )}

            <div className="eyebrow" style={{ color: '#ffdf66' }}>Energia • Segurança • Automação</div>
            <h1>Projeto profissional para economizar, proteger e modernizar seu imóvel.</h1>
            <p>Energia solar, instalações elétricas, CFTV, automação residencial e soluções técnicas para casas, comércios e empresas no RJ.</p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a className="btn btn-primary" href="#calculadora">Fazer simulação solar</a>
              <a className="btn btn-outline" href="/stories">Ver obras e stories</a>
            </div>

            <div className="meter">
              <div className="metric"><b>95%</b><span>economia possível</span></div>
              <div className="metric"><b>5 anos</b><span>garantia instalação</span></div>
              <div className="metric"><b>RJ</b><span>Niterói e região</span></div>
            </div>
          </div>

          <div className="hero-card">
            <h2>Atendimento técnico e comercial</h2>
            <p>Energia solar on-grid, instalações elétricas NBR 5410, CFTV, alarmes, automação residencial e manutenção.</p>

            <div className="card" style={{ background: 'rgba(255,255,255,.95)', color: '#0f172a', overflow: 'hidden', padding: 0 }}>
              {settings.hero_card_image_url ? (
                <img src={settings.hero_card_image_url} alt="Energia solar ES Elétrica RJ" style={{ width: '100%', height: 260, objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ minHeight: 260, display: 'grid', placeItems: 'center', textAlign: 'center', padding: 24, background: 'linear-gradient(135deg, #0b3b75, #0077cc 55%, #ffcc33)', color: '#fff' }}>
                  <div>
                    <strong style={{ fontSize: 28 }}>Energia Solar Inteligente</strong>
                    <p style={{ marginBottom: 0 }}>Simulação, projeto, instalação e acompanhamento técnico.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="servicos">
        <div className="container">
          <div className="section-title"><div className="eyebrow">Áreas de atuação</div><h2>Soluções completas da ES Elétrica RJ</h2></div>
          <div className="services">
            <div className="card service"><div className="icon">☀️</div><h3>Energia Solar</h3><p>Projetos fotovoltaicos personalizados, homologação, instalação e suporte pós-venda.</p></div>
            <div className="card service"><div className="icon">⚡</div><h3>Instalações Elétricas</h3><p>Reformas, quadros, DR, DPS, aterramento, circuitos dedicados e padrão seguro.</p></div>
            <div className="card service"><div className="icon">🎥</div><h3>Segurança Eletrônica</h3><p>CFTV, alarmes, sensores, controle de acesso, concertina e monitoramento.</p></div>
            <div className="card service"><div className="icon">🏠</div><h3>Automação Residencial</h3><p>Iluminação, climatização, áudio, vídeo e controle inteligente pelo celular.</p></div>
          </div>
        </div>
      </section>

      <section className="section" id="calculadora">
        <div className="container">
          <div className="section-title"><div className="eyebrow">Simulação solar</div><h2>Simulação Solar</h2></div>
          <SolarCalculator />
        </div>
      </section>

      <section className="section" id="avaliacoes" style={{ background: settings.background_reviews || '#ffffff' }}>
        <div className="container">
          <div className="section-title"><div className="eyebrow">Prova social</div><h2>Avaliações de clientes</h2></div>
          <PublicReviews />
          <div style={{ marginTop: 20, textAlign: 'center' }}><a className="btn btn-outline" href="/avaliar">Deixar uma avaliação</a></div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta">
            <div><h2 style={{ margin: 0 }}>Quer orçamento técnico profissional?</h2><p>Fale com a ES Elétrica RJ e receba atendimento para sua casa, comércio ou empresa.</p></div>
            <a className="btn btn-primary" href="https://wa.me/5521998415889" target="_blank">Chamar no WhatsApp</a>
          </div>
        </div>
      </section>
    </main>
  );
}
