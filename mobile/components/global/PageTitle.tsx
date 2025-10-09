import React from "react";
import { Text, View, StyleProp, TextStyle } from "react-native";

interface PageTitleProperties {
  text: string;
}

function PageTitle({ text }: PageTitleProperties) {
  return (
    <View className="flex-1 justify-center items-center">
      <Text
        className="text-center"
        style={[
          {
            color: "#000000",
            fontSize: 32,
            fontWeight: "bold",
          },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

export default PageTitle;
