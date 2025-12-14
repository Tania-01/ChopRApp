import React, { useEffect, useState } from "react";
import {
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useRoute, useNavigation } from "@react-navigation/native";

const TripDetailsScreen: React.FC = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { tripId } = route.params as { tripId: string };

    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTrip();
    }, []);

    const loadTrip = async () => {
        try {
            const response = await axios.get(`https://chop-r-backend.onrender.com/trips/${tripId}`);

            const positions = response.data.positions;

            // 👉 Групуємо за датою
            const grouped = positions.reduce((acc: any, pos: any) => {
                const date = new Date(pos.createdAt).toLocaleDateString("uk-UA");
                if (!acc[date]) acc[date] = [];
                acc[date].push(pos);
                return acc;
            }, {});

            setHistory(Object.entries(grouped)); // [["17.01.2026", [...позиції]], ...]
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <ActivityIndicator size="large" />;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Історія витрат</Text>

            {history.map(([date, items]: any) => (
                <TouchableOpacity
                    key={date}
                    style={styles.block}
                    onPress={() =>
                        navigation.navigate("DayDetailsScreen", {
                            date,
                            items,
                        })
                    }
                >
                    <Text style={styles.dateText}>{date}</Text>
                    <Text style={styles.countText}>{items.length} записів</Text>
                </TouchableOpacity>
            ))}

            {history.length === 0 && (
                <Text style={styles.empty}>Поки немає витрат</Text>
            )}
        </ScrollView>
    );
};

export default TripDetailsScreen;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#c4001d",
        marginBottom: 20,
        textAlign: "center",
    },
    block: {
        padding: 16,
        backgroundColor: "#fff5f6",
        borderWidth: 1,
        borderColor: "#c4001d",
        borderRadius: 12,
        marginBottom: 12,
    },
    dateText: {
        fontSize: 20,
        fontWeight: "700",
        color: "#c4001d",
    },
    countText: {
        fontSize: 14,
        marginTop: 4,
    },
    empty: {
        textAlign: "center",
        marginTop: 40,
        fontSize: 18,
        opacity: 0.6,
    },
});
