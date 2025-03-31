import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import ImagePreview from "../components/ImagePreview";

interface Photo {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

const { width: screenWidth } = Dimensions.get("screen");

const numColumns = 3;

const itemSize = screenWidth / numColumns - 20;

const fallbackUrl =
  "https://images.vexels.com/media/users/3/131734/isolated/preview/05d86a9b63d1930d6298b27081ddc345-photo-preview-frame-icon.png";

const Photos = () => {
  const { id } = useLocalSearchParams();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/photos"
        );
        if (!response.ok) throw new Error("Failed to fetch photos");
        const data: Photo[] = await response.json();
        const filteredPhotos = data.filter(
          (photo) => photo.albumId === Number(id)
        );
        setPhotos(filteredPhotos);
      } catch (error) {
        console.error("Error fetching photos:", error);
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [id]);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer} />
      ) : selectedPhoto ? (
        <TouchableOpacity
          style={styles.fullScreenContainer}
          onPress={() => setSelectedPhoto(null)}
        >
          <Image
            source={{ uri: fallbackUrl }}
            style={styles.fullImage}
            resizeMode="contain"
          />
          <Text style={styles.item}>{selectedPhoto.title}</Text>
        </TouchableOpacity>
      ) : (
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numColumns}
          key={numColumns}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedPhoto(item)}
              style={[
                styles.photoContainer,
                { width: itemSize, height: itemSize },
              ]}
            >
              <ImagePreview source={fallbackUrl} itemSize={itemSize} />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, alignItems: "center" },
  loadingContainer: { justifyContent: "center", alignItems: "center" },
  fullScreenContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  photoContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  fullImage: { width: "100%", height: "60%" },
  listContainer: {
    paddingBottom: 20,
  },
  item: {
    fontSize: 18,
    fontWeight: "600",
    margin: 5,
    overflow: "hidden",
  },
});

export default Photos;
