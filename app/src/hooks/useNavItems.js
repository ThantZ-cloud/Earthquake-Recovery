import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../lib/supabase';
import { useLang } from '../i18n';

const FALLBACK_ITEMS = [
  { path: '/', key: 'nav.home', label_en: 'Map', label_my: 'မြေပုံ', sort_order: 0, enabled: true },
  { path: '/learn', key: 'nav.learn', label_en: 'Learn', label_my: 'သင်ယူ', sort_order: 1, enabled: true },
  { path: '/recovery', key: 'nav.recovery', label_en: 'Recovery', label_my: 'ကယ်တင်ရေး', sort_order: 2, enabled: true },
  { path: '/donate', key: 'nav.donate', label_en: 'Donate', label_my: 'လှူဒါန်း', sort_order: 3, enabled: true },
  { path: '/quiz', key: 'nav.quiz', label_en: 'Quiz', label_my: 'မေးခွန်း', sort_order: 4, enabled: true },
  { path: '/history', key: 'nav.history', label_en: 'History', label_my: 'သမိုင်း', sort_order: 5, enabled: true },
  { path: '/about', key: 'nav.about', label_en: 'About Us', label_my: 'ကျွန်တော်တို့အကြောင်း', sort_order: 6, enabled: true },
];

export function useNavItems() {
  const { lang } = useLang();

  const { data, isLoading } = useQuery({
    queryKey: ['nav-items'],
    queryFn: async () => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      try {
        const { data, error } = await supabase
          .from('nav_items')
          .select('*')
          .order('sort_order')
          .abortSignal(controller.signal);
        if (error) throw error;
        return data || [];
      } finally {
        clearTimeout(timer);
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000),
  });

  const items = useMemo(() => {
    const source = data && data.length > 0 ? data : FALLBACK_ITEMS;
    return source
      .map((item) => ({
        ...item,
        label: lang === 'my' ? item.label_my : item.label_en,
      }))
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [data, lang]);

  const enabledPaths = useMemo(() => {
    const source = data && data.length > 0 ? data : FALLBACK_ITEMS;
    return new Set(source.filter((i) => i.enabled).map((i) => i.path));
  }, [data]);

  const enabledItems = useMemo(() => items.filter((i) => enabledPaths.has(i.path)), [items, enabledPaths]);

  return { enabledItems, enabledPaths, isLoading, allItems: items };
}
