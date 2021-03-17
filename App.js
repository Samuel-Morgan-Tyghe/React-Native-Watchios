// React Native Counter Example using Hooks!

import React, {useState, useEffect} from 'react';
import {View, Text, Button, StyleSheet, Vibration} from 'react-native';
import RNLocation from 'react-native-location';
import Geolocation from '@react-native-community/geolocation';
import Bottleneck from 'bottleneck';
import axios from 'axios';
import rateLimit from 'axios-rate-limit';

const App = () => {
  const [timesCalled, setTimesCalled] = useState(0);
  const [speedLimit, setSpeedLimit] = useState(0);
  const [vibrate, setVibrate] = useState('');
  const [overSpeedLimit, setOverSpeedLimit] = useState('uknown');
  const [url, setUrl] = useState('uknown');
  const [geoData, setGeoData] = useState('');
  const [speedData, setSpeedData] = useState('uknown');
  const [urlCallCount, setUrlCallCount] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState('ERROR');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('ERROR');
  const [speedDifference, setSpeedDifference] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setTimesCalled(prevTimesCalled => prevTimesCalled + 1);
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
      console.log('test');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setLatitude(geoData.coords?.latitude);
    // console.log(geoData)
    setLongitude(geoData.coords?.longitude);
    setCurrentSpeed(Math.round(geoData.coords?.speed * 2.23694));
    setUrl(
      'https://api.opencagedata.com/geocode/v1/json?q=' +
        geoData.coords?.latitude +
        ',' +
        geoData.coords?.longitude +
        '&roadinfo=1&key=c67ae531a698468d973f4760a4b14e1a',
    );

    if ('vibrate' in navigator) {
      setVibrate('Vibration supported');
      navigator.vibrate([3000, 500, 2000, 500, 1000]);
    } else {
      setVibrate('Vibration not supported');
    }

    compareSpeed();
  });

  function compareSpeed() {
    if (speedLimit > 5) {
      if (typeof speedLimit == 'number' && typeof currentSpeed == 'number') {
        setSpeedDifference(currentSpeed - speedLimit);
        if (currentSpeed > speedLimit) {
          setOverSpeedLimit(true);
          Vibration.vibrate()
        } else {
          // Vibration.vibrate(10000)

          setOverSpeedLimit(false);
        }
      }
    }
  }

  function startApi() {
    const interval = setInterval(() => {
      axios
        .get(url)
        .then(function (response) {
          setUrlCallCount(prevUrlCallCount => prevUrlCallCount + 1);
          setSpeedData(response);
          console.log('api Called');
          setSpeedLimit(response.data.results[0].annotations.roadinfo.maxspeed);
        })
        .catch(function (error) {
          console.log(error);
        });
    }, 5000);

    return () => clearInterval(interval);
  }

  return (
    <View style={styles.container}>
      <Text
        style={overSpeedLimit ? styles.overSpeedLimit : styles.underSpeedLimit }>
        {overSpeedLimit ? '+' : ''}
        {speedDifference}<Text style={{fontSize:20}}>MPH</Text>
      </Text>
      {/* <Text>{locationText}</Text> */}
      <Text>lat: {latitude}</Text>
      <Text>long: {longitude}</Text>
      <Text>speed: {currentSpeed} mph</Text>
      <Text>vibrate: {vibrate ? vibrate : 'error'}</Text>
      <Text>speed limit: {speedLimit ? speedLimit : 'error'}</Text>
      <Text>over Speed Limit: {overSpeedLimit ? 'true' : 'false'}</Text>
      <Text> api called: {urlCallCount}</Text>
      <Text>times called: {timesCalled}</Text>
      <Text>
        Speed Difference:
        <Text style={{backgroundColor: speedDifference ? 'red' : 'green'}}>
          {overSpeedLimit ? '+' : ''}
          {speedDifference}
        </Text>
      </Text>
      <Button onPress={() => startApi()} title="Click me!" />
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
  underSpeedLimit: {
    fontSize: 80,
    backgroundColor: 'green',
    color : 'black' ,
    borderRadius:50,
    borderWidth: 10,
    borderColor: 'white',

    overflow:'hidden',
    padding: 40,
    margin: 20,
  },
  overSpeedLimit: {
    fontSize: 80,
    backgroundColor: 'red',
    color : 'white' ,
    borderRadius:50,
    borderWidth: 10,
    borderColor: 'white',
    overflow:'hidden',
    padding: 40,
    margin: 20,

  },
});

export default App;
