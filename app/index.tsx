import React, { useState } from "react"; // Импортируем React и хук useState для управления состоянием
import { View, StyleSheet } from "react-native"; // Импортируем компоненты View и StyleSheet для построения UI
import Map from "../components/Map"; // Импортируем компонент карты, который отображает маркеры
import MarkerDetailsScreen from "./marker/[id]"; // Импортируем экран с деталями маркера
import { MarkerItem } from "../types"; // Импортируем типы для маркеров

export default function MapScreen() { // Главный компонент экрана с картой
  // Состояние для хранения всех маркеров
  const [markers, setMarkers] = useState<MarkerItem[]>([]); // Инициализируем пустой массив маркеров
  // Состояние для хранения выбранного маркера
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null); // null значит, что маркер не выбран

  // Состояние для хранения текущего региона карты
  const [mapRegion, setMapRegion] = useState({ // Инициализация региона карты по умолчанию на Москву
    latitude: 55.7558, // Центральная широта
    longitude: 37.6173, // Центральная долгота
    latitudeDelta: 0.05, // Ширина видимой области по широте
    longitudeDelta: 0.05, // Ширина видимой области по долготе
  });

  // Находим объект выбранного маркера
  const selectedMarker = markers.find((m) => m.id === selectedMarkerId) || undefined; // Ищем маркер по id, если не найден — undefined

  return (
    // Контейнер для всего экрана
    <View style={styles.container}> 
      {/* Если выбран маркер и он существует, показываем экран деталей */}
      {selectedMarkerId && selectedMarker ? ( 
        <MarkerDetailsScreen
          marker={selectedMarker} // Передаем выбранный маркер
          markers={markers} // Передаем весь список маркеров
          setMarkers={setMarkers} // Передаем функцию обновления маркеров
          onClose={() => setSelectedMarkerId(null)} // Закрытие деталей маркера — просто сбрасываем выбранный id
        />
      ) : (
        // Иначе отображаем карту
        <Map
          markers={markers} // Передаем список маркеров
          setMarkers={setMarkers} // Передаем функцию для добавления/обновления маркеров
          onMarkerPress={(id: string) => setSelectedMarkerId(id)} // При нажатии на маркер сохраняем id выбранного маркера
          region={mapRegion} // Передаем текущий регион карты
          onRegionChangeComplete={(region) => setMapRegion(region)} // Обновляем регион при перемещении карты пользователем
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 }, // Основной контейнер растягивается на весь экран
});