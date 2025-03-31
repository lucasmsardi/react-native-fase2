import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

interface Album {
  userId: number;
  id: number;
  title: string;
}

const folderIcon = "https://freesvg.org/img/Folder-1.png";
const { width: screenWidth } = Dimensions.get("screen");

const numColumns = 3;
const itemSize = screenWidth / numColumns - 20;
const iconSize = itemSize * 0.6;

const Albums = () => {
  const { id } = useLocalSearchParams();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchAlbums = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/albums"
        );
        const data: Album[] = await response.json();
        const filteredAlbums = data.filter(
          (album) => album.userId === Number(id)
        );
        setAlbums(filteredAlbums);
      } catch (error) {
        console.error("Error fetching albums:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, [id]);

  return (
    <View style={styles.container}>
      {loading && <Text style={styles.loading}>Carregando...</Text>}
      <FlatList
        data={albums}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        key={String(numColumns)}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.albumContainer, { width: itemSize }]}
            onPress={() =>
              router.push({
                pathname: "/photos/[id]",
                params: { id: item.id.toString() },
              })
            }
          >
            <Image
              source={{ uri: folderIcon }}
              style={{ width: iconSize, height: iconSize, marginBottom: 10 }}
            />
            <Text style={styles.item}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, alignItems: "center" },
  loading: { textAlign: "center", fontSize: 16, color: "gray", marginTop: 20 },
  listContainer: {
    paddingBottom: 20,
  },
  albumContainer: {
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 10,
  },
  item: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 5,
    maxWidth: itemSize,
    overflow: "hidden",
  },
});

export default Albums;
