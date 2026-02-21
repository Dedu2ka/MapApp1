import React, { useState } from "react";
import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker as MapMarker } from "react-native-maps";// Импортируем MapView и Marker из react-native-maps
import { MarkerItem } from "../types";

export default function Map({// Основной компонент карты
  markers,// Список маркеров
  setMarkers,// Функция для обновления маркеров
  onMarkerPress,// Функция обработки нажатия на маркер
  region, // Текущий регион карты
  onRegionChangeComplete, // Функция при завершении перемещения карты
}: {
  markers: MarkerItem[];
  setMarkers: React.Dispatch<React.SetStateAction<MarkerItem[]>>;//Dispatch - обновление состояния, SetStateAction - передаём либо новое значение либо функцию котрая вернет новое значение 
  onMarkerPress: (id: string) => void;
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  onRegionChangeComplete: (region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }) => void;
}) {
  const [mapReady, setMapReady] = useState(false);// Состояние готовности карты (true после полной загрузки)

  const generateId = () =>
    Date.now().toString() + Math.random().toString(36).substring(2);//получаем число от 0 до 1 переводим в систему счисления 36 отрезаем первые 2 символа (0.)

  
  const handleLongPress = (event: any) => {// Функция добавления маркера при долгом нажатии
    try {
      const { latitude, longitude } = event.nativeEvent.coordinate;// Получаем координаты точки на карте
      const newMarker: MarkerItem = {// Создаем новый объект маркера
        id: generateId(),
        latitude,
        longitude,
        images: [],
      };
      setMarkers([...markers, newMarker]);// Добавляем новый маркер в массив маркеров
    } catch {
      Alert.alert("Ошибка", "Не удалось добавить маркер");// Сообщаем об ошибке, если добавление не удалось
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region} // Текущий регион карты
        onRegionChangeComplete={onRegionChangeComplete} // Вызывается после перемещения карты
        onLongPress={handleLongPress}
        onMapReady={() => setMapReady(true)} // Устанавливаем флаг готовности карты после загрузки
      >
        {markers.map((marker) => ( // Перебираем массив маркеров для отображения на карте
          <MapMarker
            key={marker.id}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            onPress={() => onMarkerPress(marker.id)}
          />
        ))}
      </MapView>

      {!mapReady && (// Если карта еще не готова, показываем индикатор загрузки
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#1E90FF" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loader: {
    ...StyleSheet.absoluteFillObject,//Занимает всю область родителя
    justifyContent: "center",//Верт вырав
    alignItems: "center",//Гориз вырав
    backgroundColor: "rgba(255,255,255,0.5)",
  },
});