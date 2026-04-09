import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Checkbox from 'expo-checkbox';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { addTask, deleteTask, deleteAllTasks, getAllTasks, updateTask, FetchedTaskItem } from './src/utils/handle-api';
import { TaskList } from './src/components/TaskList';
import { Image } from 'react-native';

export default function App() {
  const [tasks, setTasks] = useState<FetchedTaskItem[]>([]);
  const [text, setText] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [taskId, setTaskId] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    getAllTasks(setTasks);
  }, []);

  const openNewTaskModal = () => {
    setIsUpdating(false);
    setText('');
    setCompleted(false);
    setDueDate(null);
    setTaskId('');
    setModalVisible(true);
  };

  const updateMode = (_id: string, text: string, taskCompleted: boolean, taskDueDate: string | null) => {
    setIsUpdating(true);
    setText(text);
    setTaskId(_id);
    setCompleted(taskCompleted ?? false);
    setDueDate(taskDueDate ? new Date(taskDueDate) : null);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!text.trim()) return;

    if (isUpdating) {
      updateTask(taskId, text, completed, dueDate, setTasks, setText, setIsUpdating);
    } else {
      addTask(text, completed, dueDate, setText, setTasks);
    }

    setCompleted(false);
    setDueDate(null);
    setModalVisible(false);
  };

  const handleDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setText('');
    setCompleted(false);
    setDueDate(null);
    setIsUpdating(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require('./tasks/images/image.png')}
        />
        <Text style={styles.header}>Tarefas</Text>
        <Text style={styles.taskCount}>
          {tasks.length} {tasks.length === 1 ? 'tarefa' : 'tarefas'}
        </Text>

        <View style={styles.actionBar}>
          <Pressable
            onPress={openNewTaskModal}
            style={({ pressed }) => [
              styles.primaryBtn,
              pressed && styles.primaryBtnPressed,
            ]}
          >
            <Text style={styles.primaryBtnText}>+ Nova Tarefa</Text>
          </Pressable>

          <Pressable
            onPress={() => deleteAllTasks(setTasks)}
            style={({ pressed }) => [
              styles.dangerBtn,
              pressed && styles.dangerBtnPressed,
            ]}
          >
            <Text style={styles.dangerBtnText}>Excluir Tudo</Text>
          </Pressable>
        </View>

        <TaskList
          tasks={tasks}
          updateMode={updateMode}
          deleteToDo={(id) => deleteTask(id, setTasks)}
        />

        <Modal
          visible={modalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {isUpdating ? 'Editar Tarefa' : 'Nova Tarefa'}
              </Text>

              <TextInput
                style={styles.modalInput}
                placeholder="Descreva sua tarefa..."
                placeholderTextColor="#888"
                value={text}
                onChangeText={setText}
                maxLength={90}
                autoFocus
              />

              <View style={styles.checkboxRow}>
                <Checkbox
                  value={completed}
                  onValueChange={setCompleted}
                  color={completed ? '#6c5ce7' : undefined}
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Marcar como concluída</Text>
              </View>

              <Pressable
                onPress={() => setShowDatePicker(true)}
                style={({ pressed }) => [
                  styles.datePickerBtn,
                  pressed && styles.datePickerBtnPressed,
                ]}
              >
                <Text style={styles.datePickerBtnText}>
                  {dueDate
                    ? `Prazo: ${dueDate.toLocaleDateString('pt-BR')}`
                    : 'Definir data limite'}
                </Text>
              </Pressable>

              {dueDate && (
                <Pressable
                  onPress={() => setDueDate(null)}
                  style={({ pressed }) => [
                    styles.clearDateBtn,
                    pressed && { opacity: 0.6 },
                  ]}
                >
                  <Text style={styles.clearDateText}>Remover data</Text>
                </Pressable>
              )}

              {showDatePicker && (
                <DateTimePicker
                  value={dueDate || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                />
              )}

              <View style={styles.modalActions}>
                <Pressable
                  onPress={closeModal}
                  style={({ pressed }) => [
                    styles.cancelBtn,
                    pressed && styles.cancelBtnPressed,
                  ]}
                >
                  <Text style={styles.cancelBtnText}>Cancelar</Text>
                </Pressable>

                <Pressable
                  onPress={handleSave}
                  style={({ pressed }) => [
                    styles.saveBtn,
                    pressed && styles.saveBtnPressed,
                  ]}
                >
                  <Text style={styles.saveBtnText}>
                    {isUpdating ? 'Atualizar' : 'Salvar'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  image: {
    maxHeight: 200,
    alignSelf: 'center',
  },
  header: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  taskCount: {
    marginTop: 4,
    textAlign: 'center',
    fontSize: 15,
    color: '#666',
  },
  actionBar: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: '#6c5ce7',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#6c5ce7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  primaryBtnPressed: {
    transform: [{ scale: 0.98 }],
    elevation: 1,
    shadowOpacity: 0.15,
    backgroundColor: '#5a4bd1',
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  dangerBtn: {
    backgroundColor: '#e74c3c',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#e74c3c',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  dangerBtnPressed: {
    transform: [{ scale: 0.98 }],
    elevation: 1,
    shadowOpacity: 0.15,
    backgroundColor: '#c0392b',
  },
  dangerBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    width: '100%',
    maxWidth: 420,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fafafa',
    marginBottom: 18,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#444',
    fontWeight: '500',
  },
  datePickerBtn: {
    backgroundColor: '#f0eeff',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#d5d0f5',
  },
  datePickerBtnPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: '#e0dcff',
  },
  datePickerBtnText: {
    fontSize: 15,
    color: '#6c5ce7',
    fontWeight: '600',
  },
  clearDateBtn: {
    alignItems: 'center',
    paddingVertical: 6,
    marginBottom: 8,
  },
  clearDateText: {
    color: '#e74c3c',
    fontSize: 13,
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    elevation: 2,
  },
  cancelBtnPressed: {
    transform: [{ scale: 0.98 }],
    elevation: 0,
    backgroundColor: '#e0e0e0',
  },
  cancelBtnText: {
    color: '#666',
    fontWeight: '700',
    fontSize: 15,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#6c5ce7',
    elevation: 4,
    shadowColor: '#6c5ce7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  saveBtnPressed: {
    transform: [{ scale: 0.98 }],
    elevation: 1,
    backgroundColor: '#5a4bd1',
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
