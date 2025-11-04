import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";


type Destination = {
  id: number;
  name: string;
  country: string;
  price: string;
  image: string;
};

export default function Explore(): React.ReactElement {
  const destinations: Destination[] = [
    {
      id: 1,
     name: "Sydney",
    country: "Australia",
    price: "$720",
    image: "https://images.unsplash.com/photo-1519677100203-a0e668c92439",
    },
    {
      id: 2,
      name: "Paris",
      country: "France",
      price: "$530",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
    },
    {
      id: 3,
      name: "New York",
      country: "USA",
      price: "$610",
      image: "https://images.unsplash.com/photo-1534447677768-be436bb09401",
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={["#007AFF", "#00C6FF"]} style={styles.header}>
        <Text style={styles.headerTitle}>✈️ BookingFlight</Text>
        <Text style={styles.headerSubtitle}>Explore the world with style</Text>
      </LinearGradient>

      {/* Welcome Section */}
      <View style={styles.welcomeBox}>
        <Text style={styles.welcomeTitle}>Discover Your Next Journey</Text>
        <Text style={styles.welcomeText}>
          Choose from thousands of destinations and exclusive flight offers.
        </Text>
      </View>

      {/* Banner Offer */}
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1",
        }}
        style={styles.banner}
        imageStyle={{ borderRadius: 20 }}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.6)"]}
          style={styles.bannerOverlay}
        >
          <Text style={styles.bannerTitle}>🔥 Special Offer</Text>
          <Text style={styles.bannerDesc}>
            Get up to 30% off on your next international flight!
          </Text>
        </LinearGradient>
      </ImageBackground>

      {/* Destination Section */}
      <Text style={styles.sectionTitle}>Top Destinations</Text>
      <View style={styles.cardContainer}>
        {destinations.map((dest) => (
          <TouchableOpacity key={dest.id} activeOpacity={0.8}>
            <View style={styles.card}>
              <ImageBackground
                source={{ uri: dest.image }}
                style={styles.cardImage}
                imageStyle={{ borderRadius: 18 }}
              >
                <LinearGradient
                  colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.6)"]}
                  style={styles.cardOverlay}
                >
                  <View style={styles.cardTextBox}>
                    <Text style={styles.cardName}>
                      {dest.name}, {dest.country}
                    </Text>
                    <Text style={styles.cardPrice}>{dest.price}</Text>
                  </View>
                  <TouchableOpacity style={styles.bookBtn}>
                    <Text style={styles.bookText}>Book Now</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </ImageBackground>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer */}
      <Text style={styles.footerText}>
        🌐 BookingFlight — travel made simple & elegant.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFD",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerTitle: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "700",
  },
  headerSubtitle: {
    color: "#f1f1f1",
    fontSize: 16,
    marginTop: 4,
  },
  welcomeBox: {
    padding: 20,
    alignItems: "center",
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
  },
  welcomeText: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginTop: 8,
  },
  banner: {
    height: 200,
    marginHorizontal: 20,
    marginBottom: 25,
    borderRadius: 20,
    overflow: "hidden",
  },
  bannerOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
  },
  bannerTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "700",
  },
  bannerDesc: {
    fontSize: 15,
    color: "#f0f0f0",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    marginLeft: 20,
    marginBottom: 15,
  },
  cardContainer: {
    paddingHorizontal: 20,
    gap: 20,
    marginBottom: 30,
  },
  card: {
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  cardImage: {
    height: 220,
    justifyContent: "flex-end",
  },
  cardOverlay: {
    flex: 1,
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 18,
  },
  cardTextBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  cardPrice: {
    color: "#FFDE70",
    fontWeight: "700",
    fontSize: 16,
  },
  bookBtn: {
    alignSelf: "flex-end",
    backgroundColor: "#00C6FF",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  bookText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  footerText: {
    textAlign: "center",
    color: "#888",
    fontSize: 13,
    marginBottom: 40,
  },
});
