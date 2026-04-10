import React, { useRef } from 'react';
import {
  View,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '@/lib/colors';
import { rfs, isSmall } from '@/lib/responsive';

type Mode = 'semantic' | 'keyword';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  loading?: boolean;
  onClear?: () => void;
}

export default function SearchBar({
  value,
  onChangeText,
  mode,
  onModeChange,
  loading,
  onClear,
}: Props) {
  const inputRef = useRef<TextInput>(null);

  const placeholder =
    mode === 'semantic'
      ? 'Describe the word you need…'
      : 'Type a word to look up…';

  return (
    <View style={s.container}>
      {/* Search Input */}
      <View style={s.pill}>
        <Text style={s.searchIcon}>🔍</Text>
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textLabel}
          style={s.input}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="never"
        />
        {loading ? (
          <ActivityIndicator size="small" color={Colors.indigo} style={{ marginRight: 4 }} />
        ) : value.length > 0 ? (
          <Pressable
            onPress={() => { onClear?.(); inputRef.current?.clear(); }}
            hitSlop={10}
            style={s.clearBtn}
          >
            <Text style={s.clearText}>✕</Text>
          </Pressable>
        ) : null}
      </View>

      {/* Mode Toggle */}
      <View style={s.modeRow}>
        <Pressable
          style={[s.modeTab, mode === 'semantic' && s.modeTabActive]}
          onPress={() => onModeChange('semantic')}
        >
          <Text style={[s.modeLabel, mode === 'semantic' && s.modeLabelActive]}>
            ✨ By meaning
          </Text>
        </Pressable>
        <Pressable
          style={[s.modeTab, mode === 'keyword' && s.modeTabActive]}
          onPress={() => onModeChange('keyword')}
        >
          <Text style={[s.modeLabel, mode === 'keyword' && s.modeLabelActive]}>
            🔤 By keyword
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: Colors.pageBg,
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    height: isSmall ? 48 : 54,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    gap: 10,
    shadowColor: Colors.indigo,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIcon: { fontSize: isSmall ? 16 : 18 },
  input: {
    flex: 1,
    fontSize: rfs(16, 14, 18),
    color: Colors.textHeading,
    fontWeight: '500',
  },
  clearBtn: {
    width: 28,
    height: 28,
    borderRadius: 99,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: { fontSize: 11, color: Colors.textMuted, fontWeight: '700' },
  modeRow: { flexDirection: 'row', gap: 8 },
  modeTab: {
    flex: 1,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  modeTabActive: {
    backgroundColor: Colors.indigo,
    borderColor: Colors.indigo,
  },
  modeLabel: {
    fontSize: rfs(13, 11, 14),
    fontWeight: '700',
    color: Colors.textMuted,
  },
  modeLabelActive: {
    color: Colors.textOnColor,
  },
});
