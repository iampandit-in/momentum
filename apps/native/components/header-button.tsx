import FontAwesome from "@expo/vector-icons/FontAwesome";
import { forwardRef } from "react";
import { Pressable, View } from "react-native";
import { cssInterop } from "nativewind";

import { NAV_THEME } from "@/lib/theme";
import { useColorScheme } from "@/lib/use-color-scheme";

cssInterop(FontAwesome, {
  className: {
    target: "style",
  },
});

export const HeaderButton = forwardRef<View, { onPress?: () => void }>(
  ({ onPress }, ref) => {
    const { colorScheme } = useColorScheme();
    const theme = colorScheme === "dark" ? NAV_THEME.dark : NAV_THEME.light;

    return (
      <Pressable
        ref={ref}
        onPress={onPress}
        className="p-2 mr-2 active:opacity-70"
      >
        <FontAwesome
          name="info-circle"
          size={20}
          className="active:opacity-70"
        />
      </Pressable>
    );
  },
);
