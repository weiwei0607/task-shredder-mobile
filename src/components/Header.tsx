import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface HeaderProps {
  isDone: boolean;
  tasksCount: number;
  onExport: () => void;
}

export default function Header({ isDone, tasksCount, onExport }: HeaderProps) {
  return (
    <LinearGradient colors={['#09090b', '#18181b']} style={styles.header}>
      <StatusBar barStyle="light-content" />
      <View style={styles.inner}>
        <View style={styles.brand}>
          <View style={styles.iconBox}>
            <Ionicons name="cut" size={20} color="#fff" />
          </View>
          <View>
            <Text style={styles.title}>任務碎紙機</Text>
            <Text style={styles.subtitle}>Task Shredder</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onExport}
          disabled={!isDone || tasksCount === 0}
          style={[styles.exportBtn, (!isDone || tasksCount === 0) && styles.btnDisabled]}
        >
          <Ionicons name="calendar-outline" size={15} color={isDone && tasksCount > 0 ? '#a1a1aa' : '#52525b'} />
          <Text style={[styles.exportText, (!isDone || tasksCount === 0) && styles.btnTextDisabled]}>
            匯出
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 54,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    backgroundColor: '#27272a',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  title: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: -0.3,
  },
  subtitle: {
    color: '#71717a',
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#27272a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  exportText: {
    color: '#a1a1aa',
    fontSize: 13,
    fontWeight: '600',
  },
  btnDisabled: {
    opacity: 0.4,
  },
  btnTextDisabled: {
    color: '#52525b',
  },
});
