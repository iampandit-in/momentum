import { ScrollView, Text, View } from "react-native";

import { Container } from "@/components/container";

export default function TabTwo() {
  return (
    <Container>
      <ScrollView className="flex-1 p-4">
        <View className="py-4">
          <Text className="text-2xl font-bold mb-2 text-foreground">
            Tab Two
          </Text>
          <Text className="text-base text-foreground/70">
            Discover more features and content
          </Text>
        </View>
      </ScrollView>
    </Container>
  );
}
