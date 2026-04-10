import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';

import { WordEntry } from '@/lib/types';
import { Colors } from '@/lib/colors';
import { rfs, rs, isSmall } from '@/lib/responsive';
import PosBadge from './PosBadge';
import SynonymTag from './SynonymTag';

interface Props {
  entry: WordEntry;
  compact?: boolean;
  bookmarked?: boolean;
  onBookmark?: (entry: WordEntry) => void;
  onSynonymPress?: (word: string) => void;
}

export default function WordCard({
  entry,
  compact = false,
  bookmarked = false,
  onBookmark,
  onSynonymPress,
}: Props) {
  const firstSense = entry.senses[0];

  if (compact) {
    return (
      <View style={s.card}>
        <View style={s.compactRow}>
          <View style={s.compactLeft}>
            <Text style={s.wordName}>{entry.word}</Text>
            <View style={s.metaRow}>
              <PosBadge pos={entry.pos} />
            </View>
            {firstSense && (
              <Text style={s.compactDef} numberOfLines={2}>
                {firstSense.definition}
              </Text>
            )}
          </View>
          <Pressable
            style={[s.iconBtn, bookmarked && s.iconBtnBookmarked]}
            onPress={() => onBookmark?.(entry)}
            hitSlop={8}
          >
            <Text style={s.iconBtnText}>{bookmarked ? '★' : '☆'}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={s.card}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <Text style={s.wordName}>{entry.word}</Text>
          <View style={s.metaRow}>
            <PosBadge pos={entry.pos} />
          </View>
        </View>
        <View style={s.actions}>
          <Pressable
            style={s.iconBtn}
            onPress={async () => { await Clipboard.setStringAsync(entry.word); }}
            hitSlop={8}
          >
            <Text style={s.iconBtnText}>📋</Text>
          </Pressable>
          <Pressable
            style={[s.iconBtn, bookmarked && s.iconBtnBookmarked]}
            onPress={() => onBookmark?.(entry)}
            hitSlop={8}
          >
            <Text style={s.iconBtnText}>{bookmarked ? '★' : '☆'}</Text>
          </Pressable>
        </View>
      </View>

      {/* Senses */}
      <View style={s.senses}>
        {entry.senses.slice(0, 3).map((sense, i) => (
          <View key={i} style={[s.sense, i > 0 && s.senseDivider]}>
            <Text style={s.definition}>{sense.definition}</Text>
            {sense.examples[0] && (
              <Text style={s.example}>"{sense.examples[0]}"</Text>
            )}
            {sense.synonyms.length > 0 && (
              <View style={s.synonyms}>
                {sense.synonyms.slice(0, 6).map(syn => (
                  <SynonymTag key={syn} label={syn} onPress={onSynonymPress} />
                ))}
              </View>
            )}
          </View>
        ))}
        {entry.senses.length > 3 && (
          <Text style={s.moreSenses}>
            +{entry.senses.length - 3} more sense{entry.senses.length - 3 !== 1 ? 's' : ''}
          </Text>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.borderCard,
    padding: 18,
    shadowColor: Colors.indigo,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  headerLeft: { flex: 1, marginRight: 8 },
  wordName: {
    fontSize: rfs(24, 18, 28),
    fontWeight: '800',
    color: Colors.textHeading,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  actions: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnBookmarked: {
    backgroundColor: Colors.amber,
  },
  iconBtnText: { fontSize: 17 },
  // Senses
  senses: { gap: 12 },
  sense: {},
  senseDivider: {
    borderTopWidth: 1.5,
    borderTopColor: Colors.surfaceAlt,
    paddingTop: isSmall ? 8 : 12,
  },
  definition: {
    fontSize: rfs(15, 13, 16),
    lineHeight: rfs(23, 20, 26),
    color: Colors.textBody,
    marginBottom: 8,
    fontWeight: '500',
  },
  example: {
    fontSize: rfs(13, 11, 14),
    lineHeight: rfs(20, 17, 22),
    fontStyle: 'italic',
    color: Colors.textMuted,
    paddingLeft: 14,
    borderLeftWidth: 3,
    borderLeftColor: Colors.indigo,
    marginBottom: 10,
  },
  synonyms: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  moreSenses: {
    fontSize: 12,
    color: Colors.textLabel,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '600',
  },
  // Compact
  compactRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  compactLeft: { flex: 1 },
  compactDef: {
    fontSize: rfs(13, 11, 14),
    color: Colors.textMuted,
    lineHeight: rfs(18, 16, 20),
    marginTop: 6,
  },
});
