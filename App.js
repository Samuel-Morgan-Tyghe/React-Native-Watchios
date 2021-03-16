// React Native Counter Example using Hooks!

import React, {useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import RNLocation from 'react-native-location';
import Geolocation from '@react-native-community/geolocation';
import Bottleneck from 'bottleneck';
import axios from 'axios';
import rateLimit from 'axios-rate-limit';
const http = rateLimit(axios.create(), {maxRequests: 1, perMilliseconds: 5000});

const App = () => {
  const [location, setLocation] = useState('');
  const [timesCalled, setTimesCalled] = useState(0);
  const [speedLimit, setSpeedLimit] = useState(0);
  const [vibrate, setVibrate] = useState('');
  const [overSpeedLimit, setOverSpeedLimit] = useState('uknown');
  const [url, setUrl] = useState('uknown');
  const [geoData, setGeoData] = useState('');
  const [speedData, setSpeedData] = useState('uknown');
  const [urlCallCount, setUrlCallCount] = useState('ERROR');
  const [currentSpeed, setCurrentSpeed] = useState('ERROR');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('ERROR');

  Geolocation.watchPosition(
    data => setGeoData(data),
    error => console.log(error),
    {
      timeout: 3000,
      maximumAge: 0,
      enableHighAccuracy: true,
      distanceFilter: 10,
      // useSignificantChanges: true,
    },
  );

  const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 5000,
    highWater: 1,
    reservoir: 1000,
  });

  RNLocation.configure({
    distanceFilter: 25.0,
  });

  RNLocation.requestPermission({
    ios: 'whenInUse',
    android: {
      detail: 'coarse',
    },
  }).then(granted => {
    if (granted) {
      // Geolocation.watchPosition(
      //   data => setGeoData(data),
      //   error => console.log(error),
      //   {
      //     timeout: 3000,
      //     maximumAge: 0,
      //     enableHighAccuracy: true,
      //     distanceFilter: 10,
      //     // useSignificantChanges: true,
      //   },
      // );
      setLatitude(geoData.coords?.latitude);
      setLongitude(geoData.coords?.longitude);
      setCurrentSpeed(Math.round(geoData.coords?.speed * 2.23694));
      setUrl(
        'https://api.opencagedata.com/geocode/v1/json?q=' +
          geoData.coords?.latitude +
          ',' +
          geoData.coords?.longitude +
          '&roadinfo=1&key=07746bd156944816be53150df0e9a8c3',
      );

      // const locationSubscription = RNLocation.subscribeToLocationUpdates(
      //   locations => {

      //     setLocation(locations);
      //     setUrl(
      //       'https://api.opencagedata.com/geocode/v1/json?q=' +
      //         locations[0].latitude +
      //         ',' +
      //         locations[0].longitude +
      //         '&roadinfo=1&key=07746bd156944816be53150df0e9a8c3',
      //     );
      // setCurrentSpeed(locations[0].speed),

      //  callRoadApi();
      if ('vibrate' in navigator) {
        setVibrate('Vibration supported');
        navigator.vibrate([3000, 500, 2000, 500, 1000]);
      } else {
        setVibrate('Vibration not supported');
      }
      setTimesCalled(timesCalled + 1);

      compareSpeed();
    }

    // );
  });
  // });

  function callRoadApi() {
    http
      .get(url)
      .then(function (response) {
        setUrlCallCount(urlCallCount + 1);
        setSpeedData(response);
        // handle success
        console.log(response);
        setSpeedLimit(response.results[0].annotations.roadinfo.maxspeed);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });

    // fetch(url)
    //   .then(response => {
    //     if (response.ok) {
    //       return response.json();
    //     } else {
    //       throw new Error('Something went wrong');
    //     }
    //   })
    //   .then(data => setSpeedData(data))
    //   .catch(error => {
    //     console.error(error);
    //   });

    // if (data?.results[0]?.annotations?.roadinfo?.maxspeed) {
    //   setSpeedLimit(data.results[0].annotations.roadinfo.maxspeed);
    // } else {
    //   setSpeedLimit('This Road Has No Speed Limit');
    // }
  }

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

  return (
    <View style={styles.container}>
      {/* <Text>{locationText}</Text> */}
      <Text>lat: {latitude}</Text>
      <Text>long: {longitude}</Text>
      <Text>speed: {currentSpeed} mph</Text>
      <Text>does vibrate ? {vibrate ? vibrate : 'error'}</Text>
      <Text>speed limit ? {speedLimit ? speedLimit : 'error'}</Text>
      <Text>current driving speed is over the limit ? {overSpeedLimit}</Text>
      <Text> api called{urlCallCount}</Text>
      <Text>times called{timesCalled}</Text>
      {/* <Text>{data}</Text> */}
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
