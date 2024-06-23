import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import axios from 'axios';

const HomeScreen = ({ navigation }) => {
    const [recipes, setRecipes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        try {
            const response = await axios.get('https://www.themealdb.com/api/json/v1/1/search.php?s=');
            setRecipes(response.data.meals);
            setRefreshing(false)
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            
        }
    };

    const searchRecipes = async (text) => {
        try {
            const response = await axios.get('https://www.themealdb.com/api/json/v1/1/search.php?s='+text);
            setRecipes(response.data.meals);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };



    const handleSearch = (query) => {
        setSearchQuery(query);
        console.log(query)
        query.length > 3 && searchRecipes(query)
    };

    if (loading) {
        
        return <ActivityIndicator />;
    }

    if (error) {
        return <Text>Error: {error}</Text>;
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBar}
                placeholder="Search recipes..."
                value={searchQuery}
                onChangeText={handleSearch}
            />
            <FlatList
                data={recipes}
                keyExtractor={(item) => item.idMeal}
                refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={()=>{fetchRecipes()}}
                    />
                      }
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
                    >
                        <View style={styles.recipeItem}>
                            <Image source={{ uri: item.strMealThumb }} style={styles.thumbnail} />
                            <View style={styles.info}>
                                <Text style={styles.title}>{item.strMeal}</Text>
                                <Text style={styles.description}>{item.strCategory}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    searchBar: { padding: 10, borderColor: '#ccc', borderWidth: 1, marginBottom: 10 },
    recipeItem: { flexDirection: 'row', marginBottom: 10 },
    thumbnail: { width: 100, height: 100, borderRadius: 8 },
    info: { marginLeft: 10, justifyContent: 'center' },
    title: { fontSize: 18, fontWeight: 'bold' },
    description: { color: '#666' },
});

export default HomeScreen;
