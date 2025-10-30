import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plane, Search } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import { TypeNavigationProp } from '../types/types';

export default function Home() {
  const navigation = useNavigation<TypeNavigationProp>();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconContainer}>
              <Plane size={28} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Explore flight</Text>
              <Text style={styles.headerSubtitle}>Welcome to flight booking</Text>
            </View>
          </View>

          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>A</Text>
          </View>

        </View>

        {/* Search */}
        <Pressable  onPress={() => {navigation.navigate('RoundTripFlight')}}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#9E9E9E" style={styles.searchIcon} />
            <Text style={styles.searchText}>Find a flight</Text>
          </View>
        </Pressable>


        {/* Cities */}
        <Text style={styles.sectionTitle}>The best cities for you</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
          style={styles.citiesScroll}
        >
          {[
            {
              name: 'HongKong',
              price: 'from $33.00 to $38.00',
              img: 'https://images.pexels.com/photos/161901/paris-sunset-france-monument-161901.jpeg?auto=compress&cs=tinysrgb&w=600'
            },
            {
              name: 'San Antonio',
              price: 'from $48.00 to $65.00',
              img: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=600'
            },
            {
              name: 'Tokyo',
              price: 'from $55.00 to $72.00',
              img: 'https://images.pexels.com/photos/1796715/pexels-photo-1796715.jpeg?auto=compress&cs=tinysrgb&w=600'
            }
          ].map((item, i) => (
            <View key={i} style={styles.cityCard}>
              <Image source={{ uri: item.img }} style={styles.cityImage} />
              <View style={styles.cityInfo}>
                <Text style={styles.cityName}>{item.name}</Text>
                <Text style={styles.cityPrice}>{item.price}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Explore */}
        <Text style={styles.sectionTitle}>Explore Destinations</Text>

        <View style={styles.destinationCard}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/1309644/pexels-photo-1309644.jpeg?auto=compress&cs=tinysrgb&w=800' }}
            style={styles.destinationImage}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#00BCD4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
  },
  searchText : {
    fontSize: 16,
    color: '#9E9E9E',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  citiesScroll: {
    marginBottom: 32,
    paddingLeft: 20,
  },
  cityCard: {
    width: 240,
    marginRight: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,

    // Android shadow
    elevation: 4,

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  cityImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  cityInfo: {
    padding: 12,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  cityPrice: {
    fontSize: 13,
    color: '#757575',
  },
  destinationCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
  },
  destinationImage: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
  }
});
