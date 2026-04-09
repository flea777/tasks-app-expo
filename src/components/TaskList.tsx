import { View, FlatList } from 'react-native';
import { TaskItem } from './TaskItem';
import { FetchedTaskItem } from '../utils/handle-api';

export interface TaskListProps {
  tasks: FetchedTaskItem[];
  updateMode: (id: string, text: string, completed: boolean, dueDate: string | null) => void;
  deleteToDo: (id: string) => void;
}

export function TaskList({ tasks, updateMode, deleteToDo }: TaskListProps) {
  return (
    <View style={{ flex: 1, marginTop: 12 }}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TaskItem
            text={item.text}
            completed={item.completed}
            dueDate={item.dueDate}
            updateMode={() => updateMode(item._id, item.text, item.completed, item.dueDate)}
            deleteToDo={() => deleteToDo(item._id)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}