import * as Location from 'expo-location';
import { createContext, useContext, useEffect, useState } from 'react';

type LocationContextType = {
  location: string;
  selectedLocation: { latitude: number; longitude: number } | null;
  loading: boolean;
  errorMsg: string | null;
  searchLocation: (query: string) => Promise<void>;
  getCurrentLocation: () => Promise<void>;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<string>('Loading...');
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLocation('Location permission denied');
        setLoading(false);
        return false;
      }
      return true;
    } catch (error) {
      setErrorMsg('Error requesting location permission');
      setLocation('Error getting location');
      setLoading(false);
      return false;
    }
  };

  const formatLocationString = (address: Location.LocationGeocodedAddress | null, latitude: number, longitude: number) => {
    if (!address) return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    
    const parts = [];
    if (address.street) parts.push(address.street);
    if (address.city) parts.push(address.city);
    if (address.region) parts.push(address.region);
    
    return parts.length > 0 ? parts.join(', ') : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  };

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      // Get address from coordinates
      const [address] = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });

      const locationString = formatLocationString(address, latitude, longitude);
      
      if (locationString) {
        setLocation(locationString);
        setSelectedLocation({ latitude, longitude });
      } else {
        setLocation('Location not available');
        setErrorMsg('Could not determine location');
      }
    } catch (error) {
      setErrorMsg('Error getting current location');
      setLocation('Error getting location');
    } finally {
      setLoading(false);
    }
  };

  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setErrorMsg('Please enter a location to search');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);

      const results = await Location.geocodeAsync(query);
      
      if (results.length > 0) {
        const { latitude, longitude } = results[0];
        const [address] = await Location.reverseGeocodeAsync({
          latitude,
          longitude
        });

        const locationString = formatLocationString(address, latitude, longitude);
        
        if (locationString) {
          setSelectedLocation({ latitude, longitude });
          setLocation(locationString);
        } else {
          setErrorMsg('Could not determine location details');
        }
      } else {
        setErrorMsg('Location not found');
      }
    } catch (error) {
      setErrorMsg('Error searching location');
    } finally {
      setLoading(false);
    }
  };

  // Fetch location on initial load
  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <LocationContext.Provider value={{
      location,
      selectedLocation,
      loading,
      errorMsg,
      searchLocation,
      getCurrentLocation,
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}

export default LocationProvider; 