import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Header from './src/components/Header';
import BrainDumpPanel from './src/components/BrainDumpPanel';
import ClarificationForm from './src/components/ClarificationForm';
import TaskBoard from './src/components/TaskBoard';
import { useStorage } from './src/hooks/useStorage';
import { analyzeText, formatTasks } from './src/utils/api';

export default function App() {
  // Persisted state
  const [tasks, setTasks, tasksReady] = useStorage<any[]>('ts_tasks', []);
  const [summary, setSummary] = useStorage<string[]>('ts_summary', []);
  const [isDone, setIsDone] = useStorage<boolean>('ts_isDone', false);

  // Transient state
  const [inputText, setInputText] = useState('');
  const [breakdownMode, setBreakdownMode] = useState<'auto' | 'none' | 'ask'>('auto');
  const [isProcessing, setIsProcessing] = useState(false);
  const [clarificationQuestions, setClarificationQuestions] = useState<{ question: string; options: string[] }[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string[]>>({});
  const [customAnswers, setCustomAnswers] = useState<Record<number, string>>({});

  const applyResult = (data: any) => {
    if (data.tasks?.length) setTasks(formatTasks(data.tasks));
    if (data.summary?.length) setSummary(data.summary);
    setIsDone(true);
  };

  const handleProcess = async () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);
    setClarificationQuestions([]);
    setSelectedAnswers({});
    setCustomAnswers({});

    try {
      const data = await analyzeText(inputText, breakdownMode);

      if (data.clarificationQuestions?.length) {
        setClarificationQuestions(data.clarificationQuestions);
        setIsDone(false);
        return;
      }
      applyResult(data);
    } catch (err: any) {
      Alert.alert('連線失敗', `請先確認 Next.js 後端正在執行中。\n錯誤：${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmitClarification = async () => {
    setIsProcessing(true);
    let combined = '';
    clarificationQuestions.forEach((q, i) => {
      combined += `\n[問題 ${i + 1}] ${q.question}\n我的回答：`;
      const sel = selectedAnswers[i] || [];
      if (sel.length) combined += sel.join('、');
      const cust = customAnswers[i];
      if (cust?.trim()) combined += (sel.length ? '，以及：' : '') + cust.trim();
      combined += '\n';
    });

    const finalPrompt = `原計畫：\n${inputText}\n\n補充資訊：\n${combined}`;
    setClarificationQuestions([]);

    try {
      const data = await analyzeText(finalPrompt, 'auto');
      applyResult(data);
    } catch (err: any) {
      Alert.alert('解析失敗', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = () => {
    Alert.alert('匯出提示', '請至網頁版使用 iCal 匯出功能，或之後的版本我們將支援原生行事曆整合！');
  };

  if (!tasksReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#e4e4e7" />
      </View>
    );
  }

  const showEmpty = !isDone && !isProcessing && clarificationQuestions.length === 0;
  const showBoard = isDone && !isProcessing && clarificationQuestions.length === 0;
  const showClarify = !isProcessing && clarificationQuestions.length > 0;

  return (
    <SafeAreaView style={styles.root}>
      <Header isDone={isDone} tasksCount={tasks.length} onExport={handleExport} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <BrainDumpPanel
          inputText={inputText}
          setInputText={setInputText}
          breakdownMode={breakdownMode}
          setBreakdownMode={setBreakdownMode}
          isProcessing={isProcessing}
          onProcess={handleProcess}
        />

        {/* Loading View */}
        {isProcessing && (
          <View style={styles.loadingPanel}>
            <View style={styles.loadingDots}>
              {[0, 1, 2].map(i => (
                <View key={i} style={styles.loadingDot} />
              ))}
            </View>
            <Text style={styles.loadingText}>正在拆解任務⋯⋯</Text>
          </View>
        )}

        {/* Empty State */}
        {showEmpty && (
          <View style={styles.emptyState}>
            <Ionicons name="cut-outline" size={48} color="#3f3f46" />
            <Text style={styles.emptyTitle}>準備好擊碎拖延症了嗎？</Text>
            <Text style={styles.emptySubtitle}>在上方輸入文字，AI 會自動幫你把巨大任務切成小碎片。</Text>
          </View>
        )}

        {/* Clarification Questions */}
        {showClarify && (
          <ClarificationForm
            questions={clarificationQuestions}
            selectedAnswers={selectedAnswers}
            setSelectedAnswers={setSelectedAnswers}
            customAnswers={customAnswers}
            setCustomAnswers={setCustomAnswers}
            onSubmit={handleSubmitClarification}
          />
        )}

        {/* Task Board */}
        {showBoard && (
          <TaskBoard
            tasks={tasks}
            setTasks={setTasks}
            summary={summary}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 60,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#09090b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingPanel: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingVertical: 40,
    backgroundColor: '#18181b',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 6,
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e4e4e7',
  },
  loadingText: {
    color: '#71717a',
    fontSize: 15,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 52,
    borderWidth: 1.5,
    borderColor: '#27272a',
    borderRadius: 20,
    borderStyle: 'dashed',
  },
  emptyTitle: {
    color: '#71717a',
    fontWeight: '600',
    fontSize: 16,
  },
  emptySubtitle: {
    color: '#52525b',
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 13,
    paddingHorizontal: 20,
  },
});
