import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/lib/colors';

interface Props {
  icon?: string;
  title: string;
  subtitle?: string;
}

export default function EmptyState({ icon = '🔍', title, subtitle }: Props) {
  return (
    <View style={s.container}>
      <View style={s.iconWrap}>
        <Text style={s.icon}>{icon}</Text>
      </View>
      <Text style={s.title}>{title}</Text>
      {subtitle && <Text style={s.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  icon: { fontSize: 38 },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textHeading,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
});
