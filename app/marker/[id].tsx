import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
  Image,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MarkerItem } from "../../types";

export default function MarkerDetailsScreen({
  marker,
  markers,
  setMarkers,
  onClose,
}: {
  marker: MarkerItem;
  markers: MarkerItem[];
  setMarkers: React.Dispatch<React.SetStateAction<MarkerItem[]>>;
  onClose: () => void;
}) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const generateId = () =>
    Date.now().toString() + Math.random().toString(36).substring(2);

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Ошибка", "Нет доступа к галерее");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });
      if (!result.canceled && result.assets.length > 0) {
        const newImages = [...marker.images, { id: generateId(), uri: result.assets[0].uri }];
        const updatedMarker = { ...marker, images: newImages };
        setMarkers(markers.map((m) => (m.id === marker.id ? updatedMarker : m)));
      }
    } catch {
      Alert.alert("Ошибка", "Не удалось выбрать изображение");
    }
  };

  const deleteMarker = () => {
    Alert.alert("Удалить маркер?", "Вы точно хотите удалить этот маркер?", [
      { text: "Отмена", style: "cancel" },
      {
        text: "Удалить",
        style: "destructive",
        onPress: () => {
          setMarkers(markers.filter((m) => m.id !== marker.id));
          onClose();
        },
      },
    ]);
  };

  const deleteImage = (imageId: string) => {
    const newImages = marker.images.filter((img) => img.id !== imageId);
    const updatedMarker = { ...marker, images: newImages };
    setMarkers(markers.map((m) => (m.id === marker.id ? updatedMarker : m)));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Информация о маркере</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.coords}>Широта: {marker.latitude.toFixed(6)}</Text>
        <Text style={styles.coords}>Долгота: {marker.longitude.toFixed(6)}</Text>

        <Button title="Добавить изображение" onPress={pickImage} />

        {marker.images.length === 0 ? (
          <Text style={styles.noImages}>Нет изображений</Text>
        ) : (
          marker.images.map((img) => (
            <TouchableOpacity
              key={img.id}
              onPress={() => setPreviewImage(img.uri)}
              style={styles.imageContainer}
            >
              <Image source={{ uri: img.uri }} style={styles.image} />
              <Button title="Удалить" color="red" onPress={() => deleteImage(img.id)} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={{ marginBottom: 10 }}>
          <Button title="Удалить маркер" color="red" onPress={deleteMarker} />
        </View>
        <Button title="Назад" onPress={onClose} />
      </View>

      <Modal visible={!!previewImage} transparent={true}>
        <View style={styles.modalBackground}>
          <Image source={{ uri: previewImage || "" }} style={styles.previewImage} />
          <Button title="Закрыть" onPress={() => setPreviewImage(null)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  header: { padding: 16, backgroundColor: "black", alignItems: "center" },
  headerText: { color: "white", fontSize: 18, fontWeight: "bold" },
  scrollContent: { padding: 16, paddingBottom: 100 },
  coords: { fontSize: 16, marginBottom: 8, color: "white", fontWeight: "bold" },
  footer: { padding: 16, backgroundColor: "black" },
  imageContainer: { marginVertical: 10 },
  image: { width: "100%", height: 200, borderRadius: 8 },
  noImages: { textAlign: "center", marginTop: 20, color: "gray" },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: { width: "90%", height: "70%", borderRadius: 12, resizeMode: "contain" },
});
