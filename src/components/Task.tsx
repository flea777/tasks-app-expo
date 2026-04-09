import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';

interface TaskProps {
  text: string;
  completed: boolean;
  dueDate: string | null;
  updateMode: () => void;
  deleteToDo: () => void;
}

const Task: React.FC<TaskProps> = ({ text, completed, dueDate, updateMode, deleteToDo }) => {
  const formattedDate = dueDate
    ? new Date(dueDate).toLocaleDateString('pt-BR')
    : null;

  return (
    <View style={[styles.todo, completed && styles.todoCompleted]}>
      <View style={styles.content}>
        <Text style={[styles.text, completed && styles.textCompleted]}>
          {text}
        </Text>
        {formattedDate && (
          <View style={styles.dateRow}>
            <Feather name="calendar" size={13} color={completed ? '#888' : '#aaa'} />
            <Text style={[styles.dateText, completed && styles.dateTextCompleted]}>
              {formattedDate}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.icons}>
        <Pressable
          onPress={updateMode}
          style={({ pressed }) => [
            styles.iconBtn,
            pressed && styles.iconBtnPressed,
          ]}
        >
          <Feather name="edit" size={18} color="#fff" />
        </Pressable>
        <Pressable
          onPress={deleteToDo}
          style={({ pressed }) => [
            styles.iconBtn,
            pressed && styles.iconBtnPressed,
          ]}
        >
          <AntDesign name="delete" size={18} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  todo: {
    backgroundColor: '#1a1a2e',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  todoCompleted: {
    backgroundColor: '#2a2a3e',
    opacity: 0.75,
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  text: {
    color: '#f0f0f0',
    fontSize: 16,
    fontWeight: '500',
  },
  textCompleted: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  dateText: {
    color: '#aaa',
    fontSize: 13,
  },
  dateTextCompleted: {
    color: '#666',
    textDecorationLine: 'line-through',
  },
  icons: {
    flexDirection: 'row',
    gap: 10,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  iconBtnPressed: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    transform: [{ scale: 0.92 }],
  },
});

export default Task;
