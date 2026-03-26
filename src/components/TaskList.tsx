import { View, FlatList } from 'react-native';
import { TaskItem } from './TaskItem';
import { FetchedTaskItem } from '../utils/handle-api';
import { useState } from 'react';

export interface TaskListProps {
  tasks: FetchedTaskItem[];
  updateMode: (id: string, text: string) => void;
  deleteToDo: (id: string) => void;
}

export function TaskList({ tasks, updateMode, deleteToDo }: TaskListProps) {

  return (
    <View>
      <FlatList 
        data={tasks} 
        keyExtractor={(item) =>item._id} 
        renderItem={
          ({item}) => 
          <TaskItem 
            text={item.text}
            updateMode={() => updateMode(item._id, item.text)}
            deleteToDo={() => deleteToDo(item._id)}
          />}
      />
    </View>
  )
}