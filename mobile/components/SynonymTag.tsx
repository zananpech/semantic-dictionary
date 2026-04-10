import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Colors } from '@/lib/colors';

interface Props {
  label: string;
  onPress?: (label: string) => void;
}

export default function SynonymTag({ label, onPress }: Props) {
  return (
    <Pressable
      onPress={() => onPress?.(label)}
      style={({ pressed }) => [s.tag, pressed && s.pressed]}
    >
      <Text style={s.label}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 99,
    backgroundColor: Colors.tealBg,
    borderWidth: 1.5,
    borderColor: Colors.tealBorder,
  },
  pressed: { opacity: 0.65, transform: [{ scale: 0.96 }] },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.teal,
  },
});
