import React from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ImageItem } from "../types";

 
 // Создаем функциональный компонент ImageList передаются пропсы массив изображений и функция удаления по id 
export default function ImageList({
  images,
  onDelete,
}: {
  images: ImageItem[];
  onDelete: (id: string) => void;
}) {
  // Если список пуст
  if (images.length === 0) return <Text style={styles.noImages}>Нет изображений</Text>;
  // Если изображения есть — отображаем их
  return (
    <>
      {images.map((img) => (// Перебираем массив изображений методом map
        <View key={img.id} style={styles.imageContainer}>{/* Контейнер для каждого изображения */}
          <Image source={{ uri: img.uri }} style={styles.image} />{/* Передаём путь и применяем стиль */}
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
