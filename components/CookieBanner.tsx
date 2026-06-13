'use client';
import { useEffect, useState } from 'react';
export default function CookieBanner(){
 const [show,setShow]=useState(false);
 useEffect(()=>{ if(localStorage.getItem('lgpd_ok')!=='sim') setShow(true)},[]);
 if(!show) return null;
 return <div className="cookie" style={{display:'block'}}><div className="cookie-box"><p><b>Privacidade e LGPD:</b> usamos cookies essenciais e dados enviados nos formulários para atendimento comercial, orçamento e melhoria do site.</p><button className="btn btn-blue" onClick={()=>{localStorage.setItem('lgpd_ok','sim');setShow(false)}}>Aceitar</button></div></div>
}
