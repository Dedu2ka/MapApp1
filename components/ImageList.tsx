import React from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ImageItem } from "../types";

export default function ImageList({
  images,
  onDelete,
}: {
  images: ImageItem[];
  onDelete: (id: string) => void;
}) {
  if (images.length === 0) return <Text style={styles.noImages}>Нет изображений</Text>;

  return (
    <>
      {images.map((img) => (
        <View key={img.id} style={styles.imageContainer}>
          <Image source={{ uri: img.uri }} style={styles.image} />
          <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(img.id)}>
            <Text style={{ color: "white" }}>Удалить</Text>
          </TouchableOpacity>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  imageContainer: { marginVertical: 10 },
  image: { width: "100%", height: 200, borderRadius: 8 },
  deleteBtn: {
    backgroundColor: "red",
    padding: 8,
    alignItems: "center",
    marginTop: 5,
    borderRadius: 5,
  },
  noImages: { textAlign: "center", marginTop: 20, color: "gray" },
});
