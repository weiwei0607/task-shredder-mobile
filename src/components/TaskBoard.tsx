import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Tab = 'todo' | 'summary';

interface TaskBoardProps {
  tasks: any[];
  setTasks: React.Dispatch<React.SetStateAction<any[]>>;
  summary: string[];
}

export default function TaskBoard({ tasks, setTasks, summary }: TaskBoardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('todo');

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id !== taskId) return task;
        return {
          ...task,
          subtasks: task.subtasks.map((s: any) =>
            s.id === subtaskId ? { ...s, completed: !s.completed } : s
          ),
        };
      })
    );
  };

  const updateDeadline = (taskId: string, newDate: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const diff = Math.round(
      (new Date(newDate + 'T00:00:00').getTime() - new Date(todayStr + 'T00:00:00').getTime()) /
        (1000 * 3600 * 24)
    );
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? { ...t, deadline: newDate, daysLeft: diff, isUrgent: diff <= 2 && diff >= 0 }
          : t
      )
    );
  };

  const renderTask = ({ item: task }: { item: any }) => {
    const total = task.subtasks.length;
    const done = task.subtasks.filter((s: any) => s.completed).length;
    const progress = total === 0 ? 0 : Math.round((done / total) * 100);
    const allDone = total > 0 && progress === 100;
    const isOverdue = task.daysLeft < 0;

    return (
      <View
        key={task.id}
        style={[styles.taskCard, allDone && styles.taskCardDone]}
      >
        {/* Task Header */}
        <View style={styles.taskHeader}>
          <View style={{ flex: 1, gap: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              {allDone && <Ionicons name="checkmark-circle" size={18} color="#22c55e" />}
              <Text style={[styles.taskTitle, allDone && styles.taskTitleDone]} numberOfLines={2}>
                {task.title}
              </Text>
            </View>

            <View style={styles.deadlineRow}>
              <View style={[
                styles.deadlineBadge,
                isOverdue ? styles.badgeOverdue : allDone ? styles.badgeDone : task.daysLeft <= 2 ? styles.badgeUrgent : styles.badgeNormal
              ]}>
                <Ionicons name="time-outline" size={11} color="inherit" />
                <Text style={[
                  styles.badgeText,
                  isOverdue ? styles.textOverdue : allDone ? styles.textDone : task.daysLeft <= 2 ? styles.textUrgent : styles.textNormal
                ]}>
                  {isOverdue
                    ? `⚠️ 已逾期 ${Math.abs(task.daysLeft)} 天`
                    : task.daysLeft === 0
                    ? '🔥 今天到期'
                    : task.isUrgent
                    ? `🔥 倒數 ${task.daysLeft} 天`
                    : `⏳ 倒數 ${task.daysLeft} 天`}
                </Text>
              </View>

              <TextInput
                style={styles.dateInput}
                value={task.deadline}
                onChangeText={(val) => {
                  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) updateDeadline(task.id, val);
                }}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#52525b"
                maxLength={10}
              />
            </View>
          </View>

          {/* Progress circle */}
          <View style={styles.progressBox}>
            <Text style={[styles.progressNum, allDone && { color: '#22c55e' }]}>{progress}%</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` as any }, allDone && { backgroundColor: '#22c55e' }]} />
            </View>
          </View>
        </View>

        {/* Subtasks */}
        <View style={styles.subtaskList}>
          {task.subtasks.map((sub: any) => (
            <TouchableOpacity
              key={sub.id}
              onPress={() => toggleSubtask(task.id, sub.id)}
              style={styles.subtaskRow}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, sub.completed && styles.checkboxChecked]}>
                {sub.completed && <Ionicons name="checkmark" size={12} color="#09090b" strokeWidth={3} />}
              </View>
              <Text style={[styles.subtaskText, sub.completed && styles.subtaskTextDone]}>
                {sub.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {(['todo', 'summary'] as Tab[]).map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
          >
            <Ionicons
              name={tab === 'todo' ? 'list' : 'bulb-outline'}
              size={15}
              color={activeTab === tab ? '#e4e4e7' : '#71717a'}
            />
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'todo' ? '執行碎片' : '30秒重點'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Todo Tab */}
      {activeTab === 'todo' && (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={t => t.id}
          contentContainerStyle={{ gap: 14, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      )}

      {/* Summary Tab */}
      {activeTab === 'summary' && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryHeading}>✨ AI 重點提煉</Text>
          {summary.map((text, i) => (
            <View key={i} style={styles.summaryItem}>
              <View style={styles.summaryBadge}>
                <Text style={styles.summaryNum}>{i + 1}</Text>
              </View>
              <Text style={styles.summaryText}>{text}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 14 },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#18181b',
    borderRadius: 14,
    padding: 4,
    gap: 4,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: '#27272a',
  },
  tabText: {
    color: '#71717a',
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#e4e4e7',
  },
  taskCard: {
    backgroundColor: '#18181b',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#27272a',
    overflow: 'hidden',
  },
  taskCardDone: {
    borderColor: '#14532d',
    backgroundColor: '#052e16',
  },
  taskHeader: {
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
    backgroundColor: '#09090b',
  },
  taskTitle: {
    color: '#e4e4e7',
    fontWeight: '700',
    fontSize: 15,
    flex: 1,
  },
  taskTitleDone: {
    color: '#4ade80',
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  deadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  deadlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeUrgent: { backgroundColor: '#450a0a' },
  badgeOverdue: { backgroundColor: '#450a0a' },
  badgeNormal: { backgroundColor: '#1c1917' },
  badgeDone: { backgroundColor: '#052e16' },
  badgeText: { fontSize: 11, fontWeight: '700' },
  textUrgent: { color: '#f87171' },
  textOverdue: { color: '#f87171' },
  textNormal: { color: '#a1a1aa' },
  textDone: { color: '#4ade80' },
  dateInput: {
    color: '#71717a',
    fontSize: 11,
    backgroundColor: '#27272a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontWeight: '500',
  },
  progressBox: {
    width: 52,
    alignItems: 'flex-end',
    gap: 6,
  },
  progressNum: {
    color: '#e4e4e7',
    fontSize: 13,
    fontWeight: '700',
  },
  progressBar: {
    width: 48,
    height: 6,
    backgroundColor: '#27272a',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#e4e4e7',
    borderRadius: 3,
  },
  subtaskList: {
    padding: 10,
    gap: 2,
  },
  subtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#3f3f46',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#e4e4e7',
    borderColor: '#e4e4e7',
  },
  subtaskText: {
    color: '#a1a1aa',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
  },
  subtaskTextDone: {
    color: '#52525b',
    textDecorationLine: 'line-through',
  },
  // Summary
  summaryContainer: { gap: 12 },
  summaryHeading: {
    color: '#e4e4e7',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 4,
  },
  summaryItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  summaryBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#451a03',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  summaryNum: {
    color: '#fb923c',
    fontWeight: '700',
    fontSize: 12,
  },
  summaryText: {
    color: '#a1a1aa',
    fontSize: 14,
    lineHeight: 22,
    flex: 1,
  },
});
