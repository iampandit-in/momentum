import { useQuery } from "@tanstack/react-query";
import { View, ScrollView, TouchableOpacity } from "react-native";

import { Container } from "@/components/container";
import { SignIn } from "@/components/sign-in";
import { SignUp } from "@/components/sign-up";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { queryClient, trpc } from "@/utils/trpc";

export default function Home() {
  const healthCheck = useQuery(trpc.healthCheck.queryOptions());
  const privateData = useQuery(trpc.privateData.queryOptions());
  const isConnected = healthCheck?.data === "OK";
  const isLoading = healthCheck?.isLoading;
  const { data: session } = authClient.useSession();

  return (
    <Container>
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text className="text-2xl font-bold mb-4 text-foreground">
            BETTER T STACK
          </Text>

          {session?.user ? (
            <Card className="mb-4 p-4">
              <View className="mb-2">
                <Text className="text-lg font-semibold text-foreground">
                  Welcome,{" "}
                  <Text className="font-bold">{session.user.name}</Text>
                </Text>
              </View>
              <Text className="text-sm mb-3 text-foreground/70">
                {session.user.email}
              </Text>
              <TouchableOpacity
                className="p-3 bg-destructive rounded"
                onPress={() => {
                  authClient.signOut();
                  queryClient.invalidateQueries();
                }}
              >
                <Text className="text-destructive-foreground text-center">
                  Sign Out
                </Text>
              </TouchableOpacity>
            </Card>
          ) : null}

          <Card className="mb-4 p-4">
            <Text className="text-base font-bold mb-3 text-foreground">
              System Status
            </Text>
            <View className="flex-row items-center gap-2">
              <View
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: isConnected ? "#10b981" : "#ef4444" }}
              />
              <View className="flex-1">
                <Text className="text-sm font-bold text-foreground">
                  TRPC Backend
                </Text>
                <Text className="text-xs text-foreground/70">
                  {isLoading
                    ? "Checking connection..."
                    : isConnected
                      ? "Connected to API"
                      : "API Disconnected"}
                </Text>
              </View>
            </View>
          </Card>

          <Card className="mb-4 p-4">
            <Text className="text-base font-bold mb-3 text-foreground">
              Private Data
            </Text>
            {privateData && (
              <Text className="text-sm text-foreground/70">
                {privateData.data?.message}
              </Text>
            )}
          </Card>

          {!session?.user && (
            <View className="gap-4">
              <SignIn />
              <SignUp />
            </View>
          )}
        </View>
      </ScrollView>
    </Container>
  );
}
