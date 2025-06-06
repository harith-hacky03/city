import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from "expo-router";
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LocationProvider, useLocation } from '../context/LocationContext';

function LocationBar() {
  const { location, loading, errorMsg, searchLocation, getCurrentLocation } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async () => {
    await searchLocation(searchQuery);
    setSearchQuery('');
  };

  const parseLocation = (locationString: string) => {
    const parts = locationString.split(', ');
    return {
      mainArea: parts[0] || '',
      details: parts.slice(1).join(', ')
    };
  };

  const locationInfo = parseLocation(location);

  return (
    <View style={styles.topBar}>
      <View style={styles.locationContainer}>
        {loading ? (
          <ActivityIndicator size="small" color="#8A4FFF" />
        ) : (
          <>
            <Text style={styles.mainLocationText}>{locationInfo.mainArea}</Text>
            {locationInfo.details && (
              <Text style={styles.locationDetailsText}>{locationInfo.details}</Text>
            )}
          </>
        )}
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search location..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <FontAwesome name="search" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.currentLocationButton}
          onPress={getCurrentLocation}
        >
          <FontAwesome name="location-arrow" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function RootLayout() {
  return (
    <LocationProvider>
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <LocationBar />
            <Tabs screenOptions={{
              tabBarActiveTintColor: '#007AFF',
              tabBarInactiveTintColor: '#666',
              tabBarStyle: {
                backgroundColor: '#fff',
                borderTopWidth: 1,
                borderTopColor: '#eee',
                elevation: 0,
                shadowOpacity: 0,
                height: 60,
                paddingBottom: 10,
                paddingTop: 5,
              },
              header: () => null,
            }}>
              <Tabs.Screen
                name="routes/city-talk"
                options={{
                  title: 'City Talk',
                  tabBarLabel: 'City Talk',
                  tabBarIcon: ({ color, focused }) => (
                    <View style={focused && styles.glowContainer}>
                      <FontAwesome name="comments" size={24} color={focused ? '#007AFF' : color} />
                    </View>
                  ),
                }}
              />
              <Tabs.Screen
                name="routes/hangouts"
                options={{
                  title: 'Hangouts',
                  headerShown: false,
                  tabBarIcon: ({ color, focused }) => (
                    <View style={focused && styles.glowContainer}>
                      <FontAwesome name="users" size={24} color={focused ? '#007AFF' : color} />
                    </View>
                  ),
                }}
              />
              <Tabs.Screen
                name="routes/maps"
                options={{
                  title: 'Maps',
                  tabBarIcon: ({ color, focused }) => (
                    <View style={focused && styles.glowContainer}>
                      <FontAwesome name="map-marker" size={24} color={focused ? '#007AFF' : color} />
                    </View>
                  ),
                }}
              />
              <Tabs.Screen
                name="routes/sharing"
                options={{
                  title: 'Sharing',
                  tabBarIcon: ({ color, focused }) => (
                    <View style={focused && styles.glowContainer}>
                      <FontAwesome name="share-alt" size={24} color={focused ? '#007AFF' : color} />
                    </View>
                  ),
                }}
              />
              <Tabs.Screen
                name="routes/profile"
                options={{
                  title: 'Profile',
                  tabBarLabel: 'Profile',
                  tabBarIcon: ({ color, focused }) => (
                    <View style={focused && styles.glowContainer}>
                      <FontAwesome name="user" size={24} color={focused ? '#007AFF' : color} />
                    </View>
                  ),
                }}
              />
            </Tabs>
          </SafeAreaView>
        </View>
      </SafeAreaProvider>
    </LocationProvider>
  );
}

const styles = StyleSheet.create({
  topBar: {
    width: '100%',
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  locationContainer: {
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  mainLocationText: {
    fontSize: 24,
    color: '#000',
    fontWeight: '700',
    marginBottom: 4,
  },
  locationDetailsText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '400',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: '#f5f5f5',
    color: '#000',
  },
  searchButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  currentLocationButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    marginLeft: 8,
  },
  glowContainer: {
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
});
