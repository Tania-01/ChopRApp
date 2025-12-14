import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView
} from "react-native";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddPositionsScreen: React.FC = () => {
    const route = useRoute();
    const { tripId } = route.params as { tripId: string };

    const [fuelUA, setFuelUA] = useState("");
    const [fuelEU, setFuelEU] = useState("");
    const [adBlue, setAdBlue] = useState("");
    const [distance, setDistance] = useState("");
    const [driverPerDiem, setDriverPerDiem] = useState("");
    const [extraCosts, setExtraCosts] = useState("");

    const [positions, setPositions] = useState<any[]>([]);

    useEffect(() => {
        loadPositions();
    }, []);

    // --- Функція завантаження позицій ---
    const loadPositions = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) return;

            const res = await axios.get(`https://chop-r-backend.onrender.com/trips/${tripId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPositions(res.data.positions || []);
        } catch (e: any) {
            console.log("Помилка завантаження позицій:", e);
            Alert.alert("Помилка", "Не вдалося завантажити позиції");
        }
    };

    // --- Додавання нової позиції ---
    const handleSavePositions = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Помилка", "Ви не авторизовані");
                return;
            }

            const res = await axios.put(
                "https://chop-r-backend.onrender.com/trips/positions",
                {
                    tripId,
                    fuelUA: Number(fuelUA),
                    fuelEU: Number(fuelEU),
                    adBlue: Number(adBlue),
                    distance: Number(distance),
                    driverPerDiem: Number(driverPerDiem),
                    extraCosts: Number(extraCosts),
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            Alert.alert("Успіх", "Позицію додано");

            // Очищаємо поля
            setFuelUA("");
            setFuelEU("");
            setAdBlue("");
            setDistance("");
            setDriverPerDiem("");
            setExtraCosts("");

            // Оновлюємо список позицій
            setPositions(res.data.positions || []);

        } catch (error: any) {
            console.log(error);
            Alert.alert("Помилка", error.response?.data?.message || "Не вдалося зберегти позицію");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Додати витрати по рейсу</Text>

            {/* --- Паливо --- */}
            <Text style={styles.sectionTitle}>Паливо</Text>
            <Text style={styles.label}>Паливо Україна</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={fuelUA} onChangeText={setFuelUA} />
            <Text style={styles.label}>Паливо Європа</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={fuelEU} onChangeText={setFuelEU} />
            <Text style={styles.label}>AdBlue</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={adBlue} onChangeText={setAdBlue} />

            {/* --- Витрати водія --- */}
            <Text style={styles.sectionTitle}>Витрати водія</Text>
            <Text style={styles.label}>Відрядження</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={driverPerDiem} onChangeText={setDriverPerDiem} />

            {/* --- Інше --- */}
            <Text style={styles.sectionTitle}>Інше</Text>
            <Text style={styles.label}>Кілометраж</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={distance} onChangeText={setDistance} />
            <Text style={styles.label}>Додаткові витрати</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={extraCosts} onChangeText={setExtraCosts} />

            <TouchableOpacity style={styles.button} onPress={handleSavePositions}>
                <Text style={styles.buttonText}>Зберегти позицію</Text>
            </TouchableOpacity>

            {/* --- Список доданих позицій --- */}
            <Text style={styles.sectionTitle}>Додані позиції</Text>
            {positions.length === 0 ? (
                <Text style={{ color: "gray", textAlign: "center" }}>Ще немає витрат</Text>
            ) : (
                positions.map((p, index) => (
                    <View key={index} style={styles.positionBox}>
                        <Text style={styles.positionText}>Паливо UA: {p.fuelUA} грн</Text>
                        <Text style={styles.positionText}>Паливо EU: {p.fuelEU} €</Text>
                        <Text style={styles.positionText}>AdBlue: {p.adBlue} грн</Text>
                        <Text style={styles.positionText}>Км: {p.distance} км</Text>
                        <Text style={styles.positionText}>Відрядження: {p.driverPerDiem} грн</Text>
                        <Text style={styles.positionText}>Інше: {p.extraCosts} грн</Text>
                        <Text style={styles.positionText}>Дата: {new Date(p.createdAt).toLocaleDateString()}</Text>
                    </View>
                ))
            )}
        </ScrollView>
    );
};

export default AddPositionsScreen;

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: "#fff", flexGrow: 1 },
    title: { fontSize: 26, fontWeight: "bold", color: "#c4001d", textAlign: "center", marginBottom: 20 },

    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#c4001d",
        marginTop: 20,
        marginBottom: 10,
        textDecorationLine: "underline",
    },

    label: { fontSize: 16, fontWeight: "600", marginBottom: 5 },
    input: {
        borderWidth: 1,
        borderColor: "#c4001d",
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        fontSize: 18,
    },
    button: {
        backgroundColor: "#c4001d",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 20,
    },
    buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },

    positionBox: {
        borderWidth: 1,
        borderColor: "#c4001d",
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
        backgroundColor: "#fff5f7",
    },
    positionText: { fontSize: 15, marginBottom: 3 },
});
