import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import CustomCallout from "./CustomCallout";
import * as Location from "expo-location";
import { get_events_within_radius } from "../functions/queries";

export default function Map() {
  const [region, setRegion] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [loading, setLoading] = useState(true)
  const [markers, setMarkers] = useState([])

  useEffect(() => {
    onMount();
  }, [])

  let onMount = () => {
    getLocationAsync()
      .then(() => {
        setLoading(false)
      })
      .catch((error) => {
        console.error("error", error)
        setLoading(false)
      })
  }

  let getLocationAsync = () => {
    return new Promise((resolve, reject) => {
      Location.requestForegroundPermissionsAsync()
        .then(({ status }) => {
          if (status !== 'granted') {
            setErrorMsg("Permissions not granted")
            setRegion(defaultRegion);
            reject('Permissions not granted.');
          } else {
            return Location.getCurrentPositionAsync({});
          }
        })
        .then((location) => {
          const loc = location.coords;
          setRegion({
            latitude: loc.latitude,
            longitude: loc.longitude,
            latitudeDelta: 0.2,
            longitudeDelta: 0.3,
          });
          console.log(loc.latitude, loc.longitude)
          fetchMarkers(loc.latitude, loc.longitude);
          resolve();
        })
        .catch((error) => {
          console.error('Error in getLocationAsync:', error);
          reject(error);
        });
    });
  }

  const fetchMarkers = async (latitude, longitude) => {
    try {
      const data = await get_events_within_radius(latitude, longitude, 8000);
      console.log('Events:', data.length);
      setMarkers(data);
    } catch (error) {
      console.error('Error in fetchMarkers:', error);
      setMarkers([]);
    }
  };

  //const assetPath = "../assets/images/markers/";
  /*
  const markerImages = {
    'Downed Tree': require('../assets/images/markers/downed_tree.png'),
    'Request Supplies': require('../assets/images/markers/request_supplies.png'),
    'Power Line': require('../assets/images/markers/power_lines.png'),
    'Traffic Light': require('../assets/images/markers/traffic_light.png'),
    'Flooding': require('../assets/images/markers/flooding.png'),
    'Need Ride': require('../assets/images/markers/need_ride.png'),
    'Debris cleanup': require('../assets/images/markers/debris_cleanup.png'),
    'Provide Supplies': require('../assets/images/markers/provide_supplies.png'),
    'Provide Shelter': require('../assets/images/markers/provide_shelter.png'),
    'Misc': require('../assets/images/markers/misc.png'),
  };*/
  const markerImages = {
    'Downed Tree': '../assets/images/markers/downed_tree.png',
    'Request Supplies': '../assets/images/markers/request_supplies.png',
    'Power Line': '../assets/images/markers/power_lines.png',
    'Traffic Light': '../assets/images/markers/traffic_light.png',
    'Flooding': '../assets/images/markers/flooding.png',
    'Need Ride': '../assets/images/markers/need_ride.png',
    'Debris cleanup': '../assets/images/markers/debris_cleanup.png',
    'Provide Supplies': '../assets/images/markers/provide_supplies.png',
    'Provide Shelter': '../assets/images/markers/provide_shelter.png',
    'Misc': '../assets/images/markers/misc.png',
  };

  
  return (
    <>
      {loading ? (
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}>
          <Text>Loading...</Text>
        </View >
      ) : (
        <MapView
          region={region} // Use region instead of initialRegion, to make the map responsive to changes
          loadingEnabled
          showsMyLocationButton
          showsCompass
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            height: '100%',
          }}
          zoomEnabled
          showsUserLocation
        >
          {/* Display markers */}
          {markers?.length > 0 && markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{ latitude: marker.lat, longitude: marker.lng }}
              title={marker.title}
              description={marker.description}
              //image={markerImages[marker.type]}
            >
              <CustomCallout marker={marker} />
            </Marker>
          ))}
        </MapView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  marker: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    borderRadius: 30,
    borderWidth: 2,
  }
});

/*
<Image style={styles.marker} source={markerImages[marker.type]} />
{<CustomCallout marker={marker} />}
*/