import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, SafeAreaView, Platform, StatusBar as RNStatusBar, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { addTask, deleteTask, getAllTasks, updateTask, FetchedTaskItem } from './src/utils/handle-api';
import { TaskList } from './src/components/TaskList';
import { Image } from 'react-native';

export default function App() {
  const [tasks, setTasks] = useState<FetchedTaskItem[]>([]);
  const [text, setText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [taskId, setTaskId] = useState("");

  useEffect(() => {
    getAllTasks(setTasks);
  }, []);

  const updateMode = (_id: string, text: string) => {
    setIsUpdating(true);
    setText(text);
    setTaskId(_id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require('./tasks/images/image.png')}
        />
        <Text style={styles.header}>Tarefas</Text>
        <Text style={styles.taskCount}>Quantidade total de tarefas: {tasks.length}</Text>

        <View style={styles.top}>
          <TextInput
            style={styles.input}
            placeholder="Adicione uma tarefa..."
            value={text}
            onChangeText={(val) => setText(val)}
            maxLength={90}
            keyboardType='web-search'
          />

          <Button
            title={isUpdating ? "Atualizar" : "Adicionar"}
            onPress={
              isUpdating
                ? () => updateTask(taskId, text, setTasks, setText, setIsUpdating)
                : () => addTask(text, setText, setTasks)
            }
          />
        </View>
        
        <TaskList
          tasks={tasks}
          updateMode={updateMode}
          deleteToDo={(id) => deleteTask(id, setTasks)}
        />

      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  taskCount: {
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
  },
  image: {
    maxHeight: 200,
    alignSelf: 'center',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  header: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  top: {
    marginTop: 16,
    flexDirection: 'column',
    gap: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    fontSize: 16,
    borderRadius: 4,
    width: 520,
  },
  addButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  list: {
    marginTop: 16,
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  }
});
