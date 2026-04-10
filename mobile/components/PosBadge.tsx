import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/lib/colors';

interface Props { pos: string; }

export default function PosBadge({ pos }: Props) {
  const style = Colors.pos[pos.toLowerCase() as keyof typeof Colors.pos] ?? Colors.pos.fallback;
  return (
    <View style={[s.badge, { backgroundColor: style.bg }]}>
      <Text style={[s.label, { color: style.color }]}>{pos}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});
