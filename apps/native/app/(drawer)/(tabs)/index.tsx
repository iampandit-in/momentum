import { ScrollView, Text, View } from "react-native";

import { Container } from "@/components/container";

export default function TabOne() {
  return (
    <Container>
      <ScrollView className="flex-1 p-4">
        <View className="py-4">
          <Text className="text-2xl font-bold mb-2 text-foreground">
            Tab One
          </Text>
          <Text className="text-base text-foreground/70">
            Explore the first section of your app
          </Text>
        </View>
      </ScrollView>
    </Container>
  );
}
