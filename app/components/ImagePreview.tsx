import React from "react";
import { View, Image, StyleSheet, Text } from "react-native";

interface ImagePreviewProps {
  source: any;
  title?: string;
  itemSize: number;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  source,
  title,
  itemSize,
}) => {
  return (
    <View style={[styles.container, { width: itemSize, height: itemSize }]}>
      <Image source={{ uri: source }} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  text: {
    marginTop: 10,
    fontSize: 14,
    color: "gray",
    textAlign: "center",
  },
});

export default ImagePreview;
