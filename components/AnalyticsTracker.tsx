'use client';

import { useEffect } from 'react';
import { supabase, supabaseReady } from '@/lib/supabase';

function getVisitorId() {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('es_visitor_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('es_visitor_id', id);
  }
  return id;
}

export default function AnalyticsTracker() {
  useEffect(() => {
    async function registrar() {
      if (!supabaseReady || !supabase) return;

      await supabase.from('site_visits').insert({
        visitor_id: getVisitorId(),
        path: window.location.pathname,
        url: window.location.href,
        referrer: document.referrer || '',
        user_agent: navigator.userAgent || '',
        online_until: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      });
    }

    registrar();
  }, []);

  return null;
}
