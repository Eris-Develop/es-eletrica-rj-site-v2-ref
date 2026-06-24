import Link from 'next/link';

export default function Header(){
  return <>
    <div className="topbar"><div className="container"><span>📍 São Gonçalo • Niterói • Maricá • Itaboraí</span><span>📞 (21) 99841-5889 • (21) 99957-7208</span></div></div>
    <header className="header"><div className="container nav">
      <Link className="brand" href="/"><div><span><img src="/img_star/logon.png" alt="ES Elétrica RJ"/></span><small style={{display:'block',fontSize:11,letterSpacing:1,color:'#64748b'}}>Tecnologia e Sustentabilidade</small></div></Link>
      <nav className="menu"><Link href="/#servicos">Serviços</Link><Link href="/#calculadora">Calculadora Solar</Link><Link href="/#avaliacoes">Avaliações</Link><Link href="/stories">Stories</Link><Link href="/blog">Blog</Link><Link href="/admin">Admin</Link></nav>
      
    </div></header>
  </>
}
