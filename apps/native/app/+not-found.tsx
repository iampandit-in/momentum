import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

import { Container } from "@/components/container";
import { NAV_THEME } from "@/lib/theme";
import { useColorScheme } from "@/lib/use-color-scheme";

export default function NotFoundScreen() {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <Container>
        <View className="flex-1 items-center justify-center p-4">
          <View className="items-center">
            <Text className="mb-4 text-5xl">🤔</Text>
            <Text className="mb-2 text-center text-xl font-bold text-foreground">
              Page Not Found
            </Text>
            <Text className="mb-6 text-center text-sm text-foreground/70">
              Sorry, the page you're looking for doesn't exist.
            </Text>
            <Link href="/" asChild>
              <Text className="text-primary bg-primary/10 p-3">Go to Home</Text>
            </Link>
          </View>
        </View>
      </Container>
    </>
  );
}
