import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

const RecipeDetailScreen = () => {
    const route = useRoute();
    const { recipe } = route.params;
    const [isFavorite, setIsFavorite] = useState(false);
    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {
        checkIfFavorite();
        extractIngredients();
    }, []);

    const checkIfFavorite = async () => {
        try {
            const favorites = await AsyncStorage.getItem('favorites');
            const favoritesArray = favorites ? JSON.parse(favorites) : [];
            const isFav = favoritesArray.some(fav => fav.idMeal === recipe.idMeal);
            setIsFavorite(isFav);
        } catch (error) {
            console.error(error);
        }
    };

    const extractIngredients = () => {
        let ingredientsList = [];
        for (let i = 1; i <= 20; i++) {
            if (recipe[`strIngredient${i}`]) {
                ingredientsList.push({
                    ingredient: recipe[`strIngredient${i}`],
                    measure: recipe[`strMeasure${i}`]
                });
            } else {
                break;
            }
        }
        setIngredients(ingredientsList);
    };

    const handleFavorite = async () => {
        try {
            const favorites = await AsyncStorage.getItem('favorites');
            const favoritesArray = favorites ? JSON.parse(favorites) : [];
            if (isFavorite) {
                const newFavorites = favoritesArray.filter(fav => fav.idMeal !== recipe.idMeal);
                await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
            } else {
                favoritesArray.push(recipe);
                await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
            }
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
            <Text style={styles.title}>{recipe.strMeal}</Text>
            <Text style={styles.category}>{recipe.strCategory}</Text>
            <Text style={styles.ingredientsTitle}>Ingredients</Text>
            {ingredients.map((item, index) => (
                <Text key={index} style={styles.ingredientItem}>
                    {item.measure} {item.ingredient}
                </Text>
            ))}
            <Text style={styles.instructions}>{recipe.strInstructions}</Text>
            
            <Button
                title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                onPress={handleFavorite}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, margin: 16 },
    image: { width: '100%', height: 200, borderRadius: 8 },
    title: { fontSize: 24, fontWeight: 'bold', marginVertical: 10 },
    category: { fontSize: 18, color: '#666' },
    instructions: { fontSize: 16, marginVertical: 10 },
    ingredientsTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20 },
    ingredientItem: { fontSize: 16, marginVertical: 2 },
});

export default RecipeDetailScreen;
