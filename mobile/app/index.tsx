import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SearchBar from '@/components/SearchBar';
import WordCard from '@/components/WordCard';
import EmptyState from '@/components/EmptyState';
import { WordEntry, Bookmark } from '@/lib/types';
import { search, getRandomWords } from '@/lib/loadData';
import { Colors } from '@/lib/colors';
import { rfs, rs, sw, isSmall, isTablet, maxContentWidth } from '@/lib/responsive';

const SUGGEST_PROMPTS = [
  { label: '🌧 Smell of rain on earth', q: 'smell of rain on dry earth' },
  { label: '🕰 Nostalgia for a time never lived', q: 'nostalgia for a time you never lived in' },
  { label: '🗣 Someone who talks too much', q: 'someone who talks excessively' },
  { label: '💡 Sudden moment of insight', q: 'sudden moment of clarity or insight' },
  { label: '😶‍🌫️ Deep unexplained sadness', q: 'deep sadness without obvious cause' },
];

const BM_KEY = 'lexicon-bookmarks';

export default function HomeScreen() {
  const router = useRouter();
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'semantic' | 'keyword'>('semantic');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<WordEntry[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [discovery, setDiscovery] = useState<WordEntry[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => { setDiscovery(getRandomWords(5)); }, []);

  useEffect(() => {
    AsyncStorage.getItem(BM_KEY).then(raw => {
      if (raw) setBookmarks(JSON.parse(raw));
    });
  }, []);

  const handleBookmark = useCallback((entry: WordEntry) => {
    const def = entry.senses[0]?.definition ?? '';
    const bm: Bookmark = { word: entry.word, pos: entry.pos, definition: def };
    setBookmarks(prev => {
      const exists = prev.some(b => b.word === entry.word && b.pos === entry.pos);
      const next = exists
        ? prev.filter(b => !(b.word === entry.word && b.pos === entry.pos))
        : [...prev, bm];
      AsyncStorage.setItem(BM_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isBookmarked = (entry: WordEntry) =>
    bookmarks.some(b => b.word === entry.word && b.pos === entry.pos);

  const handleQueryChange = (text: string) => {
    setQuery(text);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!text.trim()) { setResults([]); setHasSearched(false); return; }
    setLoading(true);
    searchTimeout.current = setTimeout(() => {
      setResults(search(text.trim(), mode));
      setHasSearched(true);
      setLoading(false);
    }, 300);
  };

  const handleModeChange = (next: 'semantic' | 'keyword') => {
    setMode(next);
    if (query.trim()) {
      setLoading(true);
      setTimeout(() => { setResults(search(query.trim(), next)); setLoading(false); }, 150);
    }
  };

  const handleSynonymPress = (word: string) => {
    setQuery(word); setMode('keyword');
    setResults(search(word, 'keyword')); setHasSearched(true);
  };

  const handleChipPress = (q: string) => {
    setQuery(q); setMode('semantic');
    setResults(search(q, 'semantic')); setHasSearched(true);
  };

  const showHome = !hasSearched && !query;

  return (
    <SafeAreaView style={s.safeArea}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.brand}>
          <View style={s.brandIcon}>
            <Text style={s.brandIconText}>L</Text>
          </View>
          <Text style={s.brandName}>Lexicon</Text>
        </View>
        <Pressable style={s.headerBtn} onPress={() => router.push('/bookmarks')}>
          <Text style={s.headerBtnIcon}>🔖</Text>
          {bookmarks.length > 0 && (
            <View style={s.badge}>
              <Text style={s.badgeText}>
                {bookmarks.length > 9 ? '9+' : bookmarks.length}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      <SearchBar
        value={query}
        onChangeText={handleQueryChange}
        mode={mode}
        onModeChange={handleModeChange}
        loading={loading}
        onClear={() => { setQuery(''); setResults([]); setHasSearched(false); }}
      />

      {showHome ? (
        <ScrollView
          style={s.scroll}
          contentContainerStyle={s.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View style={s.hero}>
            <Text style={s.heroTitle}>
              Find the{'\n'}
              <Text style={s.heroAccent}>perfect word</Text>
            </Text>
            <Text style={s.heroSub}>
              Express yourself better — discover words you didn't know you needed.
            </Text>
          </View>

          {/* Suggestion Chips */}
          <Text style={s.sectionLabel}>Try describing…</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.chipsRow}
            style={s.chipsScroll}
          >
            {SUGGEST_PROMPTS.map(p => (
              <Pressable
                key={p.q}
                style={({ pressed }) => [s.chip, pressed && s.chipPressed]}
                onPress={() => handleChipPress(p.q)}
              >
                <Text style={s.chipLabel}>{p.label}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Discovery */}
          <View style={s.sectionRow}>
            <Text style={s.sectionLabel}>Words to explore</Text>
            <Pressable style={s.refreshBtn} onPress={() => setDiscovery(getRandomWords(5))}>
              <Text style={s.refreshLabel}>↻  Shuffle</Text>
            </Pressable>
          </View>
          <View style={s.discoveryList}>
            {discovery.map((entry) => (
              <WordCard
                key={entry.id}
                entry={entry}
                compact
                bookmarked={isBookmarked(entry)}
                onBookmark={handleBookmark}
                onSynonymPress={handleSynonymPress}
              />
            ))}
          </View>
        </ScrollView>
      ) : hasSearched && results.length === 0 ? (
        <EmptyState
          title="No words found"
          subtitle="Try rephrasing or switching to a different mode."
        />
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={s.resultsList}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <Text style={s.resultsCount}>
              {results.length} word{results.length !== 1 ? 's' : ''} found
            </Text>
          }
          renderItem={({ item }) => (
            <WordCard
              entry={item}
              bookmarked={isBookmarked(item)}
              onBookmark={handleBookmark}
              onSynonymPress={handleSynonymPress}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.pageBg },
  // Tablet: center content with a max width
  contentWrap: isTablet
    ? { alignSelf: 'center' as const, width: maxContentWidth, flex: 1 }
    : { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: isTablet ? 32 : 20,
    paddingTop: isSmall ? 12 : 40,
    paddingBottom: 6,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandIcon: {
    width: 32, height: 32,
    borderRadius: 10,
    backgroundColor: Colors.indigo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandIconText: { fontSize: 16, fontWeight: '800', color: Colors.textOnColor },
  brandName: { fontSize: 20, fontWeight: '800', color: Colors.textHeading, letterSpacing: -0.5 },
  headerBtn: {
    width: 42, height: 42,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.indigo,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 3,
  },
  headerBtnIcon: { fontSize: 18 },
  badge: {
    position: 'absolute',
    top: -4, right: -4,
    minWidth: 18, height: 18,
    backgroundColor: Colors.coral,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: Colors.pageBg,
  },
  badgeText: { fontSize: 9, fontWeight: '800', color: Colors.textOnColor },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },

  // Hero
  hero: { paddingTop: isSmall ? 16 : 32, paddingBottom: isSmall ? 16 : 28, alignItems: 'center', gap: 10 },
  heroTitle: {
    fontSize: rfs(34, 26, 42),
    fontWeight: '800',
    color: Colors.textHeading,
    textAlign: 'center',
    letterSpacing: -0.8,
    lineHeight: rfs(40, 32, 50),
  },
  heroAccent: { color: Colors.indigo },
  heroSub: {
    fontSize: rfs(15, 13, 17),
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: rfs(22, 19, 26),
    maxWidth: sw(0.72),
    marginTop: 4,
  },

  // Labels
  sectionLabel: {
    fontSize: rs(11),
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: Colors.textLabel,
    marginBottom: 10,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 28,
    marginBottom: 10,
  },

  // Chips
  chipsScroll: { marginHorizontal: -16, marginBottom: 24 },
  chipsRow: { paddingHorizontal: 16, gap: 8 },
  chip: {
    height: 38,
    paddingHorizontal: 16,
    borderRadius: 99,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.indigo,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  chipPressed: { opacity: 0.7, transform: [{ scale: 0.97 }] },
  chipLabel: { fontSize: rfs(13, 11, 15), fontWeight: '600', color: Colors.textBody },

  // Refresh
  refreshBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 99,
    backgroundColor: Colors.amber,
  },
  refreshLabel: { fontSize: 12, fontWeight: '700', color: Colors.textOnColor },

  // Discovery
  discoveryList: { gap: 10 },

  // Results
  resultsList: { paddingHorizontal: 16, paddingBottom: 40 },
  resultsCount: {
    fontSize: rs(11),
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: Colors.textLabel,
    marginTop: 10,
    marginBottom: 14,
  },
});
