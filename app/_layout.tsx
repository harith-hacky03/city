import { FontAwesome } from '@expo/vector-icons';
import { Session } from '@supabase/supabase-js';
import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LocationProvider, useLocation } from '../context/LocationContext';
import { supabase } from '../lib/supabase';

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

// Real auth state using Supabase
const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    session,
    loading,
    isAuthenticated: !!session,
  };
};

export default function RootLayout() {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    setIsNavigationReady(true);
  }, []);

  useEffect(() => {
    if (!isNavigationReady || loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)/city-talk');
    }
  }, [isAuthenticated, segments, isNavigationReady, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <LocationProvider>
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            {segments[0] !== '(auth)' && <LocationBar />}
            <Slot />
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
