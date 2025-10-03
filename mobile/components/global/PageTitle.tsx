import React from "react";
import { Text, View } from "react-native";

interface PageTitleProperties {
  text: string;
  color?: string;
  fontSize?: number;
  fontWeight?: string;
  style?: object;
}

function PageTitle({
  text,
  color = "#000000",
  fontSize = 32,
  fontWeight = "bold",
  style = {},
}: PageTitleProperties) {
  return (
    <View className="flex-1 justify-center items-center">
      <Text
        className="text-center"
        style={[{ color, fontSize, fontWeight }, style]}
      >
        {text}
      </Text>
    </View>
  );
}

export default PageTitle;
