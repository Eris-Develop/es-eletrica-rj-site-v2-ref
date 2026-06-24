'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase, supabaseReady } from '@/lib/supabase';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => {
    async function carregarLogo() {
      if (!supabaseReady || !supabase) return;
      const { data } = await supabase.from('site_settings').select('logo_url').eq('id', 1).single();
      if (data?.logo_url) setLogoUrl(data.logo_url);
    }
    carregarLogo();
  }, []);

  const fechar = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="header-container">
        <Link href="/" className="header-brand" onClick={fechar}>
          {logoUrl ? <img src={logoUrl} alt="ES Elétrica RJ" className="header-logo" /> : <span className="header-logo-text">ES Elétrica RJ</span>}
        </Link>

        <button className={`hamburger ${open ? 'active' : ''}`} type="button" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>

        <nav className={`header-nav ${open ? 'open' : ''}`}>
          <Link href="/" onClick={fechar}>Home</Link>
          <Link href="/#servicos" onClick={fechar}>Serviços</Link>
          <Link href="/#calculadora" onClick={fechar}>Simulação Solar</Link>
          <Link href="/stories" onClick={fechar}>Stories</Link>
          <Link href="/#avaliacoes" onClick={fechar}>Avaliações</Link>
          <Link href="/blog" onClick={fechar}>Blog</Link>
          <a className="header-cta" href="https://wa.me/5521998415889" target="_blank" onClick={fechar}>WhatsApp</a>
        </nav>
      </div>
    </header>
  );
}
