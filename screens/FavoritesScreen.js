import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Button, Pressable, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesScreen = ({ navigation }) => {
    const [favorites, setFavorites] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [allFavorites, setAllFavorites] = useState([]);


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadFavorites();
        });
        return unsubscribe;
    }, [navigation]);

    const loadFavorites = async () => {
        try {
            const favorites = await AsyncStorage.getItem('favorites');
            setFavorites(favorites ? JSON.parse(favorites) : []);
            setAllFavorites(favorites ? JSON.parse(favorites) : []);
        } catch (error) {
            console.error(error);
        }
    };

    const removeFromFavorites = async (idMeal) => {
        try {
            const newFavorites = favorites.filter(item => item.idMeal !== idMeal);
            await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
            setFavorites(newFavorites);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.length == 0) {
            loadFavorites()

        } else {

            const filteredRecipes = allFavorites.filter(recipe =>
                recipe.strMeal.toLowerCase().includes(query.toLowerCase()) ||
                recipe.strIngredient1.toLowerCase().includes(query.toLowerCase())
            );
            setFavorites(filteredRecipes);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBar}
                placeholder="Search favorite recipes..."
                value={searchQuery}
                onChangeText={handleSearch}
            />
            {favorites.length === 0 ? (
                <Text>No favorite recipes.</Text>
            ) : (

                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item.idMeal}
                    renderItem={({ item }) => (
                        <Pressable style={styles.recipeItem}
                            onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
                        >
                            <Image source={{ uri: item.strMealThumb }} style={styles.thumbnail} />
                            <View style={styles.info}>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
                                >
                                    <Text style={styles.title}>{item.strMeal}</Text>
                                </TouchableOpacity>
                                <Button
                                    title="Remove"
                                    onPress={() => removeFromFavorites(item.idMeal)}
                                />
                            </View>
                        </Pressable>
                    )}
                />

            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, margin: 16 },
    recipeItem: { flexDirection: 'row', marginBottom: 10 },
    searchBar: { padding: 10, borderColor: '#ccc', borderWidth: 1, marginBottom: 10 },
    thumbnail: { width: 100, height: 100, borderRadius: 8 },
    info: { marginLeft: 10, justifyContent: 'center' },
    title: { fontSize: 18, fontWeight: 'bold' },
    description: { color: '#666' },
});

export default FavoritesScreen;
