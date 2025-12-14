import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Помилка", "Введіть email та пароль");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                "https://chop-r-backend.onrender.com/trips/login",
                { email, password }
            );

            // Зберігаємо токен
            await AsyncStorage.setItem("token", response.data.accessToken);

            Alert.alert("Успіх", "Вхід виконано!");

            navigation.navigate("StartTrip"); // або куди треба

        } catch (error) {
            console.log(error);
            Alert.alert("Помилка", "Невірний email або пароль");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Вхід для водіїв</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Пароль"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Увійти</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#f2f2f2"
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 30,
        color: "#333"
    },
    input: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#ddd"
    },
    button: {
        backgroundColor: "#007AFF",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold"
    }
});
