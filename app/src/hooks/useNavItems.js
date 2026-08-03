import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../lib/supabase';
import { useLang } from '../i18n';

const FALLBACK_ITEMS = [
  { path: '/', key: 'nav.home', label_en: 'Map', label_my: 'မြေပုံ', sort_order: 0 },
  { path: '/learn', key: 'nav.learn', label_en: 'Learn', label_my: 'သင်ယူ', sort_order: 1 },
  { path: '/recovery', key: 'nav.recovery', label_en: 'Recovery', label_my: 'ကယ်တင်ရေး', sort_order: 2 },
  { path: '/donate', key: 'nav.donate', label_en: 'Donate', label_my: 'လှူဒါန်း', sort_order: 3 },
  { path: '/quiz', key: 'nav.quiz', label_en: 'Quiz', label_my: 'မေးခွန်း', sort_order: 4 },
  { path: '/history', key: 'nav.history', label_en: 'History', label_my: 'သမိုင်း', sort_order: 5 },
  { path: '/about', key: 'nav.about', label_en: 'About Us', label_my: 'ကျွန်တော်တို့အကြောင်း', sort_order: 6 },
];

export function useNavItems() {
  const { lang } = useLang();

  const { data, isLoading } = useQuery({
    queryKey: ['nav-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nav_items')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
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
