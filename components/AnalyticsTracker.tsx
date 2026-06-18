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
    async function track() {
      if (!supabaseReady || !supabase || typeof window === 'undefined') return;
      await supabase.from('site_events').insert({
        path: window.location.pathname,
        referrer: document.referrer || '',
        user_agent: navigator.userAgent || '',
        visitor_id: getVisitorId(),
      });
    }
    track();
  }, []);

  return null;
}
