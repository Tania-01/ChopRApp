import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

interface Vehicle {
    _id: string;
    name: string;
    plate: string;
}

interface Trip {
    _id: string;
    route: string;
    vehicle: Vehicle;
    driverName: string;
    status: string;
}

const StartTripScreen: React.FC = () => {
    const [route, setRoute] = useState<string>("");
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<string>("");
    const [openTrips, setOpenTrips] = useState<Trip[]>([]);

    const navigation = useNavigation<any>();

    // Замінити на API вашого бекенду
    const driverName = "Водій (авторизований)"; // можна підставити з login

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const vehicleRes = await axios.get("https://chop-r-backend.onrender.com/api/admin/vehicle");
                setVehicles(vehicleRes.data);
            } catch (error) {
                console.error(error);
                Alert.alert("Помилка", "Не вдалося завантажити транспорт");
            }
        };
        const fetchOpenTrips = async () => {
            try {
                const tripsRes = await axios.get("https://chop-r-backend.onrender.com/trips/open"); // ваш роут для відкритих рейсів
                setOpenTrips(tripsRes.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchVehicles();
        fetchOpenTrips();
    }, []);

    const handleStartTrip = async () => {
        if (!route || !selectedVehicle) {
            Alert.alert("Помилка", "Вкажіть маршрут та транспорт");
            return;
        }
        try {
            const response = await axios.post("https://chop-r-backend.onrender.com/trips/start", {
                route,
                vehicleId: selectedVehicle,
                driverName, // ім'я водія
            });
            Alert.alert("Успіх", "Рейс розпочато");
            const trip = response.data;
            navigation.navigate("AddPositions", { tripId: trip._id });
        } catch (error: any) {
            console.error(error);
            Alert.alert("Помилка", error.response?.data?.message || "Не вдалося розпочати рейс");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Розпочати новий рейс</Text>

            <TextInput
                style={styles.input}
                placeholder="Вкажіть маршрут"
                value={route}
                onChangeText={setRoute}
            />

            <Text style={styles.label}>Виберіть транспорт:</Text>
            {vehicles.map(vehicle => (
                <TouchableOpacity
                    key={vehicle._id}
                    style={[
                        styles.option,
                        selectedVehicle === vehicle._id && styles.selectedOption,
                    ]}
                    onPress={() => setSelectedVehicle(vehicle._id)}
                >
                    <Text style={styles.optionText}>{vehicle.name} {vehicle.plate}</Text>
                </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.button} onPress={handleStartTrip}>
                <Text style={styles.buttonText}>Старт рейсу</Text>
            </TouchableOpacity>

            <Text style={[styles.title, { marginTop: 30 }]}>Відкриті рейси</Text>
            {openTrips.map(trip => (
                <TouchableOpacity
                    key={trip._id}
                    style={styles.tripCard}
                    onPress={() => navigation.navigate("AddPositions", { tripId: trip._id })}
                >
                    <Text style={styles.tripText}>Маршрут: {trip.route}</Text>
                    <Text style={styles.tripText}>Транспорт: {trip.vehicle.name} {trip.vehicle.plate}</Text>
                    <Text style={styles.tripText}>Водій: {trip.driverName}</Text>
                    <Text style={styles.tripText}>Статус: {trip.status}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

export default StartTripScreen;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#fff",
        flexGrow: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#c4001d",
        marginBottom: 15,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#c4001d",
        borderRadius: 10,
        padding: 12,
        marginBottom: 20,
        fontSize: 18,
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
        marginTop: 10,
    },
    option: {
        padding: 12,
        borderWidth: 1,
        borderColor: "#c4001d",
        borderRadius: 10,
        marginBottom: 10,
    },
    selectedOption: {
        backgroundColor: "#c4001d",
    },
    optionText: {
        color: "#000",
    },
    button: {
        backgroundColor: "#c4001d",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    tripCard: {
        borderWidth: 1,
        borderColor: "#c4001d",
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
    },
    tripText: {
        fontSize: 16,
    },
});
