import React, { useState, useEffect } from "react";
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

interface User {
  id: number;
  name: string;
}

const Index = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users/");
        const data: User[] = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = search.length > 0 
    ? users.filter((user) => user.name.toLowerCase().includes(search.toLowerCase())) 
    : [];

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Procure pelo nome"
        value={search}
        onChangeText={setSearch}
      />
      {loading && <Text style={styles.emptyState}>Carregando...</Text>}
      {search.length > 0 && filteredUsers.length === 0 && !loading && (
        <Text style={styles.emptyState}>Nenhum usuário encontrado</Text>
      )}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push({ pathname: "/albums/[id]", params: { id: item.id.toString() } })}
          >
            <Text style={styles.item}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  emptyState: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
    marginTop: 20,
  },
  item: { padding: 10, fontSize: 18, borderBottomWidth: 1 },
});

export default Index;
