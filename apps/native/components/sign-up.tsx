import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/utils/trpc";

const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Use at least 8 characters"),
});

function getErrorMessage(error: unknown): string | null {
  if (!error) return null;

  if (typeof error === "string") {
    return error;
  }

  if (Array.isArray(error)) {
    for (const issue of error) {
      const message = getErrorMessage(issue);
      if (message) {
        return message;
      }
    }
    return null;
  }

  if (typeof error === "object" && error !== null) {
    const maybeError = error as { message?: unknown };
    if (typeof maybeError.message === "string") {
      return maybeError.message;
    }
  }

  return null;
}

function SignUp() {
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signUpSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      await authClient.signUp.email(
        {
          name: value.name.trim(),
          email: value.email.trim(),
          password: value.password,
        },
        {
          onError(error) {
            setError(error.error?.message || "Failed to sign up");
          },
          onSuccess() {
            setError(null);
            formApi.reset();
            queryClient.refetchQueries();
          },
        },
      );
    },
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
      </CardHeader>
      <CardContent className="gap-4">
        <form.Subscribe
          selector={(state) => ({
            isSubmitting: state.isSubmitting,
            validationError: getErrorMessage(state.errorMap.onSubmit),
          })}
        >
          {({ isSubmitting, validationError }) => {
            const formError = error ?? validationError;

            return (
              <>
                {formError ? (
                  <View className="mb-3 rounded bg-destructive/20 p-2">
                    <Text className="text-sm text-destructive">
                      {formError}
                    </Text>
                  </View>
                ) : null}

                <form.Field name="name">
                  {(field) => (
                    <Input
                      placeholder="Name"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChangeText={(value) => {
                        field.handleChange(value);
                        if (error) setError(null);
                      }}
                    />
                  )}
                </form.Field>

                <form.Field name="email">
                  {(field) => (
                    <Input
                      placeholder="Email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChangeText={(value) => {
                        field.handleChange(value);
                        if (error) setError(null);
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  )}
                </form.Field>

                <form.Field name="password">
                  {(field) => (
                    <Input
                      placeholder="Password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChangeText={(value) => {
                        field.handleChange(value);
                        if (error) setError(null);
                      }}
                      secureTextEntry
                      onSubmitEditing={form.handleSubmit}
                    />
                  )}
                </form.Field>

                <Button onPress={form.handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Text>Sign Up</Text>
                  )}
                </Button>
              </>
            );
          }}
        </form.Subscribe>
      </CardContent>
    </Card>
  );
}

export { SignUp };
