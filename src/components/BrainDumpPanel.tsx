import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Mode = 'auto' | 'none' | 'ask';

interface BrainDumpPanelProps {
  inputText: string;
  setInputText: (val: string) => void;
  breakdownMode: Mode;
  setBreakdownMode: (val: Mode) => void;
  isProcessing: boolean;
  onProcess: () => void;
}

const MODES: { value: Mode; emoji: string; label: string; desc: string }[] = [
  { value: 'auto', emoji: '🤖', label: 'AI 智能拆解', desc: '自動規劃執行步驟' },
  { value: 'none', emoji: '🛑', label: '僅列出待辦', desc: '不進行任何切割' },
  { value: 'ask',  emoji: '💬', label: '互動式釐清', desc: 'AI 提問幫你把任務具體化' },
];

export default function BrainDumpPanel({
  inputText,
  setInputText,
  breakdownMode,
  setBreakdownMode,
  isProcessing,
  onProcess,
}: BrainDumpPanelProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Ionicons name="sparkles" size={16} color="#f59e0b" />
        <Text style={styles.sectionTitle}>Brain Dump 靈感傾印</Text>
      </View>

      {/* Textarea */}
      <View style={[styles.inputWrapper, focused && styles.inputWrapperFocused]}>
        <TextInput
          style={styles.textInput}
          multiline
          value={inputText}
          onChangeText={setInputText}
          placeholder="把你的煩惱、開會紀錄、或者長篇大論貼在這裡..."
          placeholderTextColor="#52525b"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          textAlignVertical="top"
        />
      </View>

      {/* Mode Selector */}
      <View style={styles.modeContainer}>
        <Text style={styles.modeTitle}>選擇拆解模式</Text>
        {MODES.map((m) => (
          <TouchableOpacity
            key={m.value}
            onPress={() => setBreakdownMode(m.value)}
            style={[styles.modeRow, breakdownMode === m.value && styles.modeRowSelected]}
            activeOpacity={0.7}
          >
            <View style={[styles.radio, breakdownMode === m.value && styles.radioSelected]}>
              {breakdownMode === m.value && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.modeEmoji}>{m.emoji}</Text>
            <View>
              <Text style={[styles.modeLabel, breakdownMode === m.value && styles.modeLabelSelected]}>
                {m.label}
              </Text>
              <Text style={styles.modeDesc}>{m.desc}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Process Button */}
      <TouchableOpacity
        onPress={onProcess}
        disabled={isProcessing || !inputText.trim()}
        style={[styles.processBtn, (isProcessing || !inputText.trim()) && styles.processBtnDisabled]}
        activeOpacity={0.85}
      >
        {isProcessing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.processBtnText}>開始魔法解析</Text>
            <Ionicons name="chevron-forward" size={18} color="#fff" />
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#18181b',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#27272a',
    padding: 16,
    gap: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    color: '#a1a1aa',
    fontSize: 14,
    fontWeight: '600',
  },
  inputWrapper: {
    backgroundColor: '#09090b',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#27272a',
    padding: 12,
    minHeight: 140,
  },
  inputWrapperFocused: {
    borderColor: '#71717a',
  },
  textInput: {
    color: '#e4e4e7',
    fontSize: 15,
    lineHeight: 22,
    minHeight: 120,
    fontWeight: '400',
  },
  modeContainer: {
    gap: 6,
  },
  modeTitle: {
    color: '#52525b',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  modeRowSelected: {
    backgroundColor: '#27272a',
    borderColor: '#3f3f46',
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#52525b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#e4e4e7',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e4e4e7',
  },
  modeEmoji: {
    fontSize: 16,
  },
  modeLabel: {
    color: '#71717a',
    fontSize: 13,
    fontWeight: '600',
  },
  modeLabelSelected: {
    color: '#e4e4e7',
  },
  modeDesc: {
    color: '#52525b',
    fontSize: 11,
    marginTop: 1,
  },
  processBtn: {
    backgroundColor: '#e4e4e7',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  processBtnDisabled: {
    backgroundColor: '#27272a',
  },
  processBtnText: {
    color: '#09090b',
    fontSize: 15,
    fontWeight: '700',
  },
});
