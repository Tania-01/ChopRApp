import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const DayDetailsScreen = ({ route }) => {
    const { date, items } = route.params;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Витрати за {date}</Text>

            {items.map((pos, index) => (
                <View key={index} style={styles.card}>
                    {pos.fuelUA ? <Text style={styles.row}>Паливо UA: {pos.fuelUA} грн</Text> : null}
                    {pos.fuelEU ? <Text style={styles.row}>Паливо EU: {pos.fuelEU} €</Text> : null}
                    {pos.adBlue ? <Text style={styles.row}>AdBlue: {pos.adBlue}</Text> : null}
                    {pos.distance ? <Text style={styles.row}>Кілометраж: {pos.distance} км</Text> : null}
                    {pos.driverPerDiem ? <Text style={styles.row}>Відрядження: {pos.driverPerDiem}</Text> : null}
                    {pos.extraCosts ? <Text style={styles.row}>Додаткові витрати: {pos.extraCosts}</Text> : null}
                </View>
            ))}
        </ScrollView>
    );
};

export default DayDetailsScreen;

const styles = StyleSheet.create({
    container: { padding: 20 },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#c4001d",
        marginBottom: 15,
        textAlign: "center",
    },
    card: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#c4001d",
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
    },
    row: {
        fontSize: 16,
        marginBottom: 4,
    },
});
