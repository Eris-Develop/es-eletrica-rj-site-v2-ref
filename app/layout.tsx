import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
export const metadata: Metadata = { title:'ES Elétrica RJ | Energia Solar, Elétrica e Automação', description:'Energia solar, instalações elétricas, segurança eletrônica e automação residencial em Niterói, São Gonçalo, Maricá e Itaboraí.', keywords:['energia solar RJ','eletricista Niterói','ES Elétrica RJ','instalação elétrica','automação residencial'] };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body><Header/>{children}<Footer/><CookieBanner/></body></html>}
