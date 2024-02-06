import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useContext } from 'react'
import axios from 'axios';
import { UserType } from '../UserContext'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import { decode, encode } from 'base-64';
if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

const HomeScreen = () => {
  const { userId, setUserId } = useContext(UserType);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwtDecode(token)
      const userId = decodedToken.userId;
      setUserId(userId);

      axios
        .get(`http://10.0.0.242:8080/users/${userId}`)
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.log("error", error);
        });
    };

    fetchUsers();
  }, []);
  return (
    <View>
      <Text>HomeScreen</Text>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})