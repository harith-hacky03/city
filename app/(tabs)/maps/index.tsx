import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import RoomChat from '../../../components/RoomChat';
import { useLocation } from '../../../context/LocationContext';

const { width, height } = Dimensions.get('window');

const MAX_RADIUS = 1000000; // 1000km in meters
const MIN_RADIUS_KM_INPUT = 1; // Minimum radius for KM input in kilometers
const MIN_RADIUS_METERS = 100; // Absolute minimum radius in meters for the circle display

const formatRadiusForDisplay = (radius: number) => {
  if (radius >= 1000) {
    return `${(radius / 1000).toFixed(1)}km`;
  }
  return `${radius}m`;
};

const formatRadiusToKmInput = (radius: number) => {
    return Math.max(MIN_RADIUS_KM_INPUT, Math.round(radius / 1000)).toString();
};

const sharingPosts = [
  {
    id: 1,
    title: "2BHK Apartment for Rent",
    type: "House",
    location: "Indiranagar",
    price: "₹25,000/month",
    description: "Fully furnished 2BHK apartment available for rent. Close to metro station and tech parks.",
    image: "https://example.com/apartment.jpg",
    postedBy: "Rahul S.",
    postedTime: "2h ago",
    likes: 45,
    comments: 12
  },
  {
    id: 2,
    title: "Football Turf Booking",
    type: "Turf",
    location: "Koramangala",
    price: "₹1,200/hour",
    description: "Professional football turf available for booking. Floodlights, changing rooms, and parking available.",
    image: null,
    postedBy: "Sports Hub",
    postedTime: "5h ago",
    likes: 89,
    comments: 23
  },
  {
    id: 3,
    title: "Gym Equipment Sale",
    type: "Fitness",
    location: "HSR Layout",
    price: "₹15,000",
    description: "Selling complete home gym setup. Includes treadmill, weights, and bench. Barely used.",
    image: null,
    postedBy: "Fitness Freak",
    postedTime: "1d ago",
    likes: 34,
    comments: 8
  }
];

export default function MapsScreen() {
  const router = useRouter();
  const { selectedLocation, loading, errorMsg } = useLocation();
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'hybrid'>('standard');
  const [searchRadius, setSearchRadius] = useState(100);
  const [showRadiusInput, setShowRadiusInput] = useState(false);
  const [radiusInputKm, setRadiusInputKm] = useState(formatRadiusToKmInput(100));
  const [selectedRoom, setSelectedRoom] = useState<{
    name: string;
    participants: number;
  } | null>(null);

  const handleRadiusInputChange = (text: string) => {
    setRadiusInputKm(text);
    const km = parseInt(text, 10);
    if (!isNaN(km)) {
      let meters = km * 1000;
      meters = Math.max(MIN_RADIUS_KM_INPUT * 1000, Math.min(MAX_RADIUS, meters));
      setSearchRadius(meters);
    }
  };

  const handleOverlayPress = () => {
    setShowRadiusInput(false);
    setRadiusInputKm(formatRadiusToKmInput(searchRadius));
  };

  const handleTalkPress = (talkId: number) => {
    router.push({
      pathname: "/routes/city-talk/[id]",
      params: { id: talkId }
    });
  };

  const handlePostPress = (postId: number) => {
    // Implement the logic to handle post press
  };

  const handleRoomPress = (room: any) => {
    setSelectedRoom({
      name: room.title,
      participants: room.likes
    });
  };

  const handleCloseRoom = () => {
    setSelectedRoom(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.errorContainer}>
        <FontAwesome name="exclamation-circle" size={50} color="#FF3B30" />
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {selectedLocation && (
        <>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <View style={styles.contentContainer}>
              <View style={styles.mapContainer}>
                <MapView
                  provider={PROVIDER_GOOGLE}
                  style={styles.map}
                  initialRegion={{
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                    latitudeDelta: 0.003,
                    longitudeDelta: 0.003,
                  }}
                  region={{
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                    latitudeDelta: 0.003,
                    longitudeDelta: 0.003,
                  }}
                  showsUserLocation={true}
                  showsMyLocationButton={true}
                  showsCompass={true}
                  showsScale={true}
                  showsBuildings={true}
                  showsIndoors={true}
                  mapType={mapType}
                  customMapStyle={[
                    {
                      "featureType": "all",
                      "elementType": "geometry",
                      "stylers": [
                        { "color": "#f5f5f5" }
                      ]
                    },
                    {
                      "featureType": "water",
                      "elementType": "geometry",
                      "stylers": [
                        { "color": "#c9c9c9" }
                      ]
                    },
                    {
                      "featureType": "water",
                      "elementType": "labels.text.fill",
                      "stylers": [
                        { "color": "#9e9e9e" }
                      ]
                    },
                    {
                      "featureType": "road",
                      "elementType": "geometry",
                      "stylers": [
                        { "color": "#ffffff" }
                      ]
                    },
                    {
                      "featureType": "road.arterial",
                      "elementType": "geometry",
                      "stylers": [
                        { "color": "#ffffff" }
                      ]
                    },
                    {
                      "featureType": "road.highway",
                      "elementType": "geometry",
                      "stylers": [
                        { "color": "#dadada" }
                      ]
                    },
                    {
                      "featureType": "poi",
                      "elementType": "geometry",
                      "stylers": [
                        { "color": "#eeeeee" }
                      ]
                    },
                    {
                      "featureType": "poi.park",
                      "elementType": "geometry",
                      "stylers": [
                        { "color": "#e5e5e5" }
                      ]
                    },
                    {
                      "featureType": "poi.park",
                      "elementType": "labels.text.fill",
                      "stylers": [
                        { "color": "#6b9a76" }
                      ]
                    },
                    {
                      "featureType": "road",
                      "elementType": "labels.text.fill",
                      "stylers": [
                        { "color": "#9e9e9e" }
                      ]
                    },
                    {
                      "featureType": "road.arterial",
                      "elementType": "labels.text.fill",
                      "stylers": [
                        { "color": "#757575" }
                      ]
                    },
                    {
                      "featureType": "road.highway",
                      "elementType": "labels.text.fill",
                      "stylers": [
                        { "color": "#616161" }
                      ]
                    },
                    {
                      "featureType": "transit",
                      "elementType": "labels.text.fill",
                      "stylers": [
                        { "color": "#757575" }
                      ]
                    },
                    {
                      "featureType": "administrative.locality",
                      "elementType": "labels.text.fill",
                      "stylers": [
                        { "color": "#bdbdbd" }
                      ]
                    },
                    {
                      "featureType": "administrative.neighborhood",
                      "elementType": "labels.text.fill",
                      "stylers": [
                        { "color": "#bdbdbd" }
                      ]
                    },
                    {
                      "featureType": "administrative.land_parcel",
                      "elementType": "labels.text.fill",
                      "stylers": [
                        { "color": "#bdbdbd" }
                      ]
                    },
                    {
                      "featureType": "building",
                      "elementType": "geometry",
                      "stylers": [
                        { "color": "#e0e0e0" }
                      ]
                    }
                  ]}
                >
                  <Circle
                    center={{
                      latitude: selectedLocation.latitude,
                      longitude: selectedLocation.longitude,
                    }}
                    radius={searchRadius}
                    strokeColor="rgba(0, 122, 255, 0.5)"
                    fillColor="rgba(0, 122, 255, 0.1)"
                  />
                </MapView>

                {/* Map Controls */}
                <View style={styles.controlsContainer}>
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={() => setMapType(mapType === 'standard' ? 'satellite' : mapType === 'satellite' ? 'hybrid' : 'standard')}
                  >
                    <FontAwesome name="map" size={20} color="#007AFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={() => setShowRadiusInput(!showRadiusInput)}
                  >
                    <FontAwesome name="circle-o" size={20} color="#007AFF" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Active Rooms Section */}
              <View style={styles.activeRoomsContainer}>
                <View style={styles.titleContainer}>
                  <Text style={styles.activeRoomsTitle}>Active Rooms</Text>
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => router.push('/routes/maps/create')}
                    activeOpacity={1}
                  >
                    <FontAwesome name="plus" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
                <View style={styles.activeRoomsList}>
                  <TouchableOpacity 
                    style={styles.roomCard} 
                    onPress={() => handleRoomPress({
                      title: "Coffee Chat",
                      likes: 5
                    })}
                    activeOpacity={1}
                  >
                    <View style={styles.roomContent}>
                      <View style={styles.roomHeader}>
                        <Text style={styles.roomTitle}>Coffee Chat</Text>
                        <View style={styles.roomMeta}>
                          <Text style={styles.roomParticipants}>5 participants</Text>
                          <FontAwesome name="circle" size={8} color="#4CAF50" style={styles.statusDot} />
                        </View>
                      </View>
                      <Text style={styles.roomDescription}>Join us for a casual coffee chat at Starbucks</Text>
                      <View style={styles.roomFooter}>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.roomCard} 
                    onPress={() => handleRoomPress({
                      title: "Movie Night",
                      likes: 3
                    })}
                    activeOpacity={1}
                  >
                    <View style={styles.roomContent}>
                      <View style={styles.roomHeader}>
                        <Text style={styles.roomTitle}>Movie Night</Text>
                        <View style={styles.roomMeta}>
                          <Text style={styles.roomParticipants}>3 participants</Text>
                          <FontAwesome name="circle" size={8} color="#4CAF50" style={styles.statusDot} />
                        </View>
                      </View>
                      <Text style={styles.roomDescription}>Watching the latest Bollywood release</Text>
                      <View style={styles.roomFooter}>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Radius Input Overlay */}
          {showRadiusInput && (
            <TouchableOpacity
              style={styles.overlay}
              activeOpacity={1}
              onPress={handleOverlayPress}
            />
          )}

          {showRadiusInput && (
            <View style={styles.radiusInputContainerAbsolute}>
              <View style={styles.radiusInputHeader}>
                <Text style={styles.radiusInputTitle}>Search Radius</Text>
              </View>
              <View style={styles.radiusInputRow}>
                <TextInput
                  style={styles.radiusInput}
                  keyboardType="numeric"
                  value={radiusInputKm}
                  onChangeText={handleRadiusInputChange}
                  onBlur={() => {
                    setRadiusInputKm(formatRadiusToKmInput(searchRadius));
                  }}
                  placeholder={MIN_RADIUS_KM_INPUT.toString()}
                  placeholderTextColor="#999"
                />
                <Text style={styles.radiusUnit}>km</Text>
              </View>
            </View>
          )}
        </>
      )}

      {/* Room Chat Modal */}
      <Modal
        visible={selectedRoom !== null}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleCloseRoom}
      >
        {selectedRoom && (
          <RoomChat
            roomName={selectedRoom.name}
            participants={selectedRoom.participants}
            onClose={handleCloseRoom}
          />
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  mapContainer: {
    width: '100%',
    height: height * 0.4,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  controlsContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  controlButton: {
    padding: 8,
    marginVertical: 4,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  radiusInputContainerAbsolute: {
    position: 'absolute',
    top: 80,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  radiusInputHeader: {
    marginBottom: 8,
  },
  radiusInputTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  radiusInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  radiusInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 0,
    textAlign: 'right',
  },
  radiusUnit: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#007AFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
  talkMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  talkAuthor: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  talkTimestamp: {
    fontSize: 12,
    color: '#999',
  },
  searchContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeRoomsContainer: {
    width: '100%',
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  activeRoomsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  addButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
  },
  activeRoomsList: {
    gap: 12,
    paddingHorizontal: 16,
  },
  roomCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  roomContent: {
    padding: 16,
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  roomMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roomParticipants: {
    fontSize: 14,
    color: '#666',
  },
  statusDot: {
    marginLeft: 4,
  },
  roomDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  roomFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  postImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  postContent: {
    padding: 16,
  },
  roomsContainer: {
    flex: 1,
  },
}); 