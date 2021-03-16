// React Native Counter Example using Hooks!

import React, {useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import RNLocation from 'react-native-location';

const App = () => {
  const [location, setLocation] = useState('');
  const [timesCalled, setTimesCalled] = useState(0);
  const [speedLimit, setSpeedLimit] = useState(0);
  const [vibrate, setVibrate] = useState('');
  const [overSpeedLimit, setOverSpeedLimit] = useState('uknown');

  RNLocation.configure({
    distanceFilter: 5.0,
  });

  RNLocation.requestPermission({
    ios: 'whenInUse',
    android: {
      detail: 'coarse',
    },
  }).then(granted => {
    if (granted) {
      const locationSubscription = RNLocation.subscribeToLocationUpdates(
        locations => {
          setLocation(locations);
          url =
            'https://api.opencagedata.com/geocode/v1/json?q=' +
            locations[0].latitude +
            ',' +
            locations[0].longitude +
            '&roadinfo=1&key=7c4e578f4a0a4bb09f585c2e3c280c76';
          fetch(url)
            .then(response => response.json())
            .then(data =>
              setSpeedLimit(
                data.results[0].annotations.roadinfo.maxspeed
                  ? data.results[0].annotations.roadinfo.maxspeed
                  : 'This Road Has No Speed Limit',
                compareSpeed(),
              ),
            )
            .catch(error => {
              console.error(error);
            });

          if ('vibrate' in navigator) {
            setVibrate('Vibration supported');
            navigator.vibrate([3000, 500, 2000, 500, 1000]);
          } else {
            setVibrate('Vibration not supported');
          }
          setTimesCalled(timesCalled + 1);

          function compareSpeed() {
            if (location[0]?.speed) {
              if (speedLimit) {
                if (
                  typeof speedLimit == 'number' &&
                  typeof location[0].speed == 'number'
                ) {
                  if (location[0].speed > speedLimit) {
                    setOverSpeedLimit(true);
                  } else {
                    setOverSpeedLimit(false);
                  }
                }
              }
            }
          }

          /* Example location returned
          {
            speed: -1,
            longitude: -0.1337,
            latitude: 51.50998,
            accuracy: 5,
            heading: -1,
            altitude: 0,
            altitudeAccuracy: -1
            floor: 0
            timestamp: 1446007304457.029,
            fromMockProvider: false
          }
          */
        },
      );
    }
  });

  return (
    <View style={styles.container}>
      {/* <Text>{locationText}</Text> */}
      <Text>lat: {location ? location[0].latitude : 'notworking'}</Text>
      <Text>long: {location ? location[0].longitude : 'notworking'}</Text>
      <Text>speed: {location ? location[0].speed : 'notworking'}</Text>
      <Text>
        multiple locations? {location[1] ? location[1].latitude : 'notworking'}
      </Text>
      <Text>does vibrate ? {vibrate ? vibrate : 'error'}</Text>
      <Text>speed limit ? {speedLimit ? speedLimit : 'error'}</Text>
      <Text>current driving speed is over the limit ? {overSpeedLimit}</Text>
      {/* <Text>{error}</Text>
      <Button onPress={() => getLocation()} title="Click me!" /> */}
    </View>
  );
};

// React Native Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
