import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight } from 'react-native-reanimated';

interface ClarificationFormProps {
  questions: { question: string; options: string[] }[];
  selectedAnswers: Record<number, string[]>;
  setSelectedAnswers: React.Dispatch<React.SetStateAction<Record<number, string[]>>>;
  customAnswers: Record<number, string>;
  setCustomAnswers: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  onSubmit: () => void;
}

export default function ClarificationForm({
  questions,
  selectedAnswers,
  setSelectedAnswers,
  customAnswers,
  setCustomAnswers,
  onSubmit,
}: ClarificationFormProps) {
  const toggleOption = (qi: number, opt: string) => {
    setSelectedAnswers(prev => {
      const curr = prev[qi] || [];
      return {
        ...prev,
        [qi]: curr.includes(opt) ? curr.filter(x => x !== opt) : [...curr, opt],
      };
    });
  };

  return (
    <Animated.View entering={FadeInRight.duration(350)} style={styles.container}>
      <View style={styles.heading}>
        <View style={styles.iconBox}>
          <Ionicons name="bulb-outline" size={22} color="#818cf8" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>等一下，任務太模糊了！</Text>
          <Text style={styles.subtitle}>教練需要你先釐清這些問題：</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
        <View style={styles.questionsContainer}>
          {questions.map((q, i) => (
            <View key={i} style={styles.questionCard}>
              <View style={styles.questionHeader}>
                <Text style={styles.questionNum}>{i + 1}.</Text>
                <Text style={styles.questionText}>{q.question}</Text>
              </View>

              {q.options.length > 0 && (
                <View style={styles.optionsWrap}>
                  {q.options.map((opt, oi) => {
                    const selected = (selectedAnswers[i] || []).includes(opt);
                    return (
                      <TouchableOpacity
                        key={oi}
                        onPress={() => toggleOption(i, opt)}
                        style={[styles.optionChip, selected && styles.optionChipSelected]}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              <TextInput
                style={styles.customInput}
                placeholder="補充其他想法..."
                placeholderTextColor="#4338ca"
                value={customAnswers[i] || ''}
                onChangeText={t => setCustomAnswers(prev => ({ ...prev, [i]: t }))}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity onPress={onSubmit} style={styles.submitBtn} activeOpacity={0.85}>
        <Text style={styles.submitText}>確認回答，開始生成碎片</Text>
        <Ionicons name="chevron-forward" size={18} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#1e1b4b',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#312e81',
  },
  iconBox: {
    backgroundColor: '#312e81',
    borderRadius: 22,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#c7d2fe',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 3,
  },
  subtitle: {
    color: '#818cf8',
    fontSize: 13,
  },
  questionsContainer: {
    gap: 12,
  },
  questionCard: {
    backgroundColor: '#1e1b4b',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#312e81',
    gap: 10,
  },
  questionHeader: {
    flexDirection: 'row',
    gap: 8,
  },
  questionNum: {
    color: '#818cf8',
    fontWeight: '700',
    fontSize: 15,
  },
  questionText: {
    color: '#e0e7ff',
    fontWeight: '600',
    fontSize: 15,
    flex: 1,
    lineHeight: 21,
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingLeft: 20,
  },
  optionChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4338ca',
    backgroundColor: 'transparent',
  },
  optionChipSelected: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
  },
  optionText: {
    color: '#818cf8',
    fontSize: 13,
    fontWeight: '600',
  },
  optionTextSelected: {
    color: '#fff',
  },
  customInput: {
    borderWidth: 1,
    borderColor: '#312e81',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    color: '#c7d2fe',
    fontSize: 13,
    backgroundColor: '#09090b',
    marginLeft: 20,
  },
  submitBtn: {
    backgroundColor: '#4f46e5',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
