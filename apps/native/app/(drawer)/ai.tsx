import { useChat } from "@ai-sdk/react";
import { Ionicons } from "@expo/vector-icons";
import { env } from "@momentum/env/native";
import { DefaultChatTransport } from "ai";
import { fetch as expoFetch } from "expo/fetch";
import { useRef, useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { Container } from "@/components/container";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const generateAPIUrl = (relativePath: string) => {
  const serverUrl = env.EXPO_PUBLIC_SERVER_URL;
  if (!serverUrl) {
    throw new Error(
      "EXPO_PUBLIC_SERVER_URL environment variable is not defined",
    );
  }
  const path = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
  return serverUrl.concat(path);
};

export default function AIScreen() {
  const [input, setInput] = useState("");
  const { messages, error, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: generateAPIUrl("/ai"),
    }),
    onError: (error) => console.error(error, "AI Chat Error"),
  });
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  function onSubmit() {
    const value = input.trim();
    if (value) {
      sendMessage({ text: value });
      setInput("");
    }
  }

  if (error) {
    return (
      <Container>
        <View className="flex-1 items-center justify-center p-4">
          <Card className="p-4 bg-destructive/10 border-destructive">
            <Text className="text-base font-bold text-center mb-2 text-destructive">
              Error: {error.message}
            </Text>
            <Text className="text-sm text-center text-foreground/70">
              Please check your connection and try again.
            </Text>
          </Card>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1 p-4">
          <View className="mb-4">
            <Text className="text-2xl font-bold mb-1 text-foreground">
              AI Chat
            </Text>
            <Text className="text-sm text-foreground/70">
              Chat with our AI assistant
            </Text>
          </View>

          <ScrollView
            ref={scrollViewRef}
            className="flex-1 mb-4"
            showsVerticalScrollIndicator={false}
          >
            {messages.length === 0 ? (
              <View className="flex-1 items-center justify-center py-20">
                <Text className="text-base text-center text-foreground/70">
                  Ask me anything to get started!
                </Text>
              </View>
            ) : (
              <View className="gap-2 pb-4">
                {messages.map((message) => (
                  <Card
                    key={message.id}
                    className={`p-3 max-w-[80%] ${
                      message.role === "user"
                        ? "bg-primary/10 self-end ml-8"
                        : "self-start mr-8"
                    }`}
                  >
                    <Text className="text-xs font-bold mb-1 text-foreground">
                      {message.role === "user" ? "You" : "AI Assistant"}
                    </Text>
                    <View className="gap-1">
                      {message.parts.map((part, i) =>
                        part.type === "text" ? (
                          <Text
                            key={`${message.id}-${i}`}
                            className="text-sm leading-5 text-foreground"
                          >
                            {part.text}
                          </Text>
                        ) : (
                          <Text
                            key={`${message.id}-${i}`}
                            className="text-sm leading-5 text-foreground"
                          >
                            {JSON.stringify(part)}
                          </Text>
                        ),
                      )}
                    </View>
                  </Card>
                ))}
              </View>
            )}
          </ScrollView>

          <View className="border-t border-border pt-3">
            <View className="flex-row items-end gap-2">
              <View className="flex-1 min-h-[44px]">
                <Input
                  value={input}
                  onChangeText={setInput}
                  placeholder="Type your message..."
                  onSubmitEditing={(e) => {
                    e.preventDefault();
                    onSubmit();
                  }}
                  autoFocus={true}
                  multiline
                />
              </View>
              <TouchableOpacity
                onPress={onSubmit}
                disabled={!input.trim()}
                className={`p-3 rounded-md items-center justify-center ${
                  input.trim() ? "bg-primary" : "bg-muted"
                }`}
              >
                <Ionicons
                  name="send"
                  size={20}
                  className={
                    input.trim()
                      ? "text-primary-foreground"
                      : "text-muted-foreground"
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
}
