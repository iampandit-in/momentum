import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";

import { Container } from "@/components/container";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/utils/trpc";

export default function TodosScreen() {
  const [newTodoText, setNewTodoText] = useState("");

  const todos = useQuery(trpc.todo.getAll.queryOptions());
  const createMutation = useMutation(
    trpc.todo.create.mutationOptions({
      onSuccess: () => {
        todos.refetch();
        setNewTodoText("");
      },
    }),
  );
  const toggleMutation = useMutation(
    trpc.todo.toggle.mutationOptions({
      onSuccess: () => {
        todos.refetch();
      },
    }),
  );
  const deleteMutation = useMutation(
    trpc.todo.delete.mutationOptions({
      onSuccess: () => {
        todos.refetch();
      },
    }),
  );

  function handleAddTodo() {
    if (newTodoText.trim()) {
      createMutation.mutate({ text: newTodoText });
    }
  }

  function handleToggleTodo(id: number, completed: boolean) {
    toggleMutation.mutate({ id, completed: !completed });
  }

  function handleDeleteTodo(id: number) {
    Alert.alert("Delete Todo", "Are you sure you want to delete this todo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteMutation.mutate({ id }),
      },
    ]);
  }

  const isLoading = todos?.isLoading;
  const completedCount = todos?.data?.filter((t) => t.completed).length || 0;
  const totalCount = todos?.data?.length || 0;

  return (
    <Container>
      <ScrollView className="flex-1" contentContainerClassName="p-4">
        <View className="mb-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold">Todo List</Text>
            {totalCount > 0 && (
              <View className="bg-primary px-2 py-1 rounded">
                <Text className="text-primary-foreground text-xs">
                  {completedCount}/{totalCount}
                </Text>
              </View>
            )}
          </View>
        </View>

        <Card className="mb-4 p-3">
          <View className="flex-row items-center gap-2">
            <View className="flex-1">
              <Input
                value={newTodoText}
                onChangeText={setNewTodoText}
                placeholder="Add a new task..."
                editable={!createMutation.isPending}
                onSubmitEditing={handleAddTodo}
                returnKeyType="done"
              />
            </View>
            <Button
              onPress={handleAddTodo}
              disabled={createMutation.isPending || !newTodoText.trim()}
              className="p-3 justify-center items-center"
            >
              {createMutation.isPending ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Ionicons name="add" size={24} color="#ffffff" />
              )}
            </Button>
          </View>
        </Card>

        {isLoading && (
          <View className="items-center justify-center py-8">
            <ActivityIndicator size="large" />
            <Text className="mt-4 text-sm text-foreground/70">
              Loading todos...
            </Text>
          </View>
        )}

        {todos?.data && todos.data.length === 0 && !isLoading && (
          <Card className="items-center justify-center p-8">
            <Ionicons
              name="checkbox-outline"
              size={64}
              className="mb-4 opacity-50 text-foreground"
            />
            <Text className="text-base font-bold mb-2">No todos yet</Text>
            <Text className="text-sm text-center text-foreground/70">
              Add your first task to get started!
            </Text>
          </Card>
        )}

        {todos?.data && todos.data.length > 0 && (
          <View className="gap-2">
            {todos.data.map((todo) => (
              <Card key={todo.id} className="p-3">
                <View className="flex-row items-center gap-3">
                  <TouchableOpacity
                    onPress={() => handleToggleTodo(todo.id, todo.completed)}
                    className="h-5 w-5 border-2 border-border items-center justify-center"
                  >
                    {todo.completed && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        className="text-primary"
                      />
                    )}
                  </TouchableOpacity>
                  <View className="flex-1">
                    <Text
                      className={`text-base ${
                        todo.completed ? "line-through opacity-50" : ""
                      }`}
                    >
                      {todo.text}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteTodo(todo.id)}
                    className="p-2"
                  >
                    <Ionicons
                      name="trash-outline"
                      size={24}
                      className="text-destructive"
                    />
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </Container>
  );
}
