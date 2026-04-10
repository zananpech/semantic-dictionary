import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import EmptyState from '@/components/EmptyState';
import PosBadge from '@/components/PosBadge';
import { Bookmark } from '@/lib/types';
import { Colors } from '@/lib/colors';
import { rfs, rs, isSmall, isTablet, maxContentWidth } from '@/lib/responsive';

const BM_KEY = 'lexicon-bookmarks';

export default function BookmarksScreen() {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(BM_KEY).then(raw => {
      if (raw) setBookmarks(JSON.parse(raw));
    });
  }, []);

  const remove = async (bm: Bookmark) => {
    const next = bookmarks.filter(b => !(b.word === bm.word && b.pos === bm.pos));
    setBookmarks(next);
    await AsyncStorage.setItem(BM_KEY, JSON.stringify(next));
  };

  return (
    <SafeAreaView style={s.safeArea}>
      {/* Header */}
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => router.back()} hitSlop={10}>
          <Text style={s.backIcon}>←</Text>
        </Pressable>
        <Text style={s.heading}>Saved Words</Text>
        {bookmarks.length > 0 && (
          <View style={s.countBadge}>
            <Text style={s.countText}>{bookmarks.length}</Text>
          </View>
        )}
      </View>

      {bookmarks.length === 0 ? (
        <EmptyState
          icon="📚"
          title="No saved words yet"
          subtitle={'Tap the ☆ on any word\nto save it here.'}
        />
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={item => `${item.word}-${item.pos}`}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={s.item}>
              <View style={s.itemLeft}>
                <Text style={s.itemWord}>{item.word}</Text>
                <View style={{ marginBottom: 6 }}>
                  <PosBadge pos={item.pos} />
                </View>
                <Text style={s.itemDef} numberOfLines={2}>
                  {item.definition}
                </Text>
              </View>
              <Pressable style={s.removeBtn} onPress={() => remove(item)} hitSlop={8}>
                <Text style={s.removeIcon}>✕</Text>
              </Pressable>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.pageBg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: isTablet ? 32 : 20,
    paddingTop: isSmall ? 12 : 30,
    paddingBottom: 14,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.borderCard,
    backgroundColor: Colors.pageBg,
  },
  backBtn: {
    width: 38, height: 38,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.indigo,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
  },
  backIcon: { fontSize: 18, color: Colors.indigo, fontWeight: '700' },
  heading: {
    flex: 1,
    fontSize: rfs(20, 17, 24),
    fontWeight: '800',
    color: Colors.textHeading,
    letterSpacing: -0.4,
  },
  countBadge: {
    paddingHorizontal: 11,
    paddingVertical: 4,
    borderRadius: 99,
    backgroundColor: Colors.coral,
  },
  countText: { fontSize: 12, fontWeight: '800', color: Colors.textOnColor },

  // List
  list: {
    paddingHorizontal: isTablet ? 32 : 16,
    paddingTop: 14,
    paddingBottom: 40,
    alignSelf: isTablet ? 'center' : undefined,
    width: isTablet ? maxContentWidth : undefined,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: isSmall ? 12 : 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.surface,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: Colors.borderCard,
    shadowColor: Colors.indigo,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  itemLeft: { flex: 1 },
  itemWord: {
    fontSize: rfs(19, 16, 22),
    fontWeight: '800',
    color: Colors.textHeading,
    letterSpacing: -0.4,
    marginBottom: 5,
  },
  itemDef: {
    fontSize: rfs(13, 11, 14),
    color: Colors.textMuted,
    lineHeight: rfs(19, 16, 22),
    fontWeight: '500',
  },
  removeBtn: {
    width: 32, height: 32,
    borderRadius: 10,
    backgroundColor: Colors.coralLight,
    borderWidth: 1.5,
    borderColor: Colors.coralBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  removeIcon: { fontSize: 12, color: Colors.coral, fontWeight: '700' },
});
