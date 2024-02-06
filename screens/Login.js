import { StyleSheet, Text, View, SafeAreaView, Image, KeyboardAvoidingView, TextInput, Pressable, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  useEffect(()=>{
    const checkLoginStatus = async() =>{
      try{
        const token = await AsyncStorage.getItem("authToken");

        if(token){
          setTimeout(()=>{
            navigation.replace("Main");
          },400)
        }
      }
      catch(err){
        console.log("error",err)
      }
    }
    checkLoginStatus();
  },[])

  const handleLogin = () => {
    const user = {
      email: email,
      password: password
    }

    axios.post("http://10.0.0.242:8080/login", user)
      .then((response) => {
        console.log(response)
        const token = response.data.token;
        AsyncStorage.setItem("authToken", token)
        navigation.navigate("Home")
      })
      .catch((err) => {
        Alert.alert("Login Errr")
        console.log("Login Failed", err);
      })
  }

  return (
    <SafeAreaView style={{
      flex: 1, backgroundColor: "white", alignItems: "center"
    }}>
      <View style={{ marginTop: 50 }}>
        <Image style={{ width: 150, height: 100, resizeMode: "contain" }}
          source={{
            uri: "https://freelogopng.com/images/all_img/1688663386threads-logo-transparent.png",
          }}
        />
      </View>

      <KeyboardAvoidingView>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text style={{
            fontSize: 17,
            fontWeight: "bold",
            marginTop: 20
          }}>Login To your Account</Text>
        </View>
        <View style={{ marginTop: 30 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5, borderColor: '#d0d0d0', borderWidth: 1, paddingVertical: 5, borderRadius: 5 }}>
            <MaterialCommunityIcons style={{ marginLeft: 8 }} name="email" size={24} color="grey" />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{
                color: "grey",
                marginVertical: 10,
                width: 300,
                fontSize: email ? 16 : 16
              }}
              placeholder='Enter Your Email:'
              placeholderTextColor={"grey"} />
          </View>
        </View>

        <View style={{ marginTop: 30 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5, borderColor: '#d0d0d0', borderWidth: 1, paddingVertical: 5, borderRadius: 5 }}>
            <Entypo name="lock" size={24} color="grey" style={{ marginLeft: 8 }} />
            <TextInput
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => setPassword(text)}
              style=
              {{
                color: "grey",
                marginVertical: 10,
                width: 300,
                fontSize: password ? 16 : 16
              }}
              placeholder='Enter Your password:'
              placeholderTextColor={"grey"} />
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
          <Text>Keep me Logged In</Text>
          <Text style={{ fontWeight: "500", color: "#007fff" }}>Fogot Password</Text>
        </View>

        <View style={{ marginTop: 30 }} />

        <Pressable
          onPress={handleLogin}
          style={{
            width: 200,
            backgroundColor: "black",
            padding: 15,
            marginTop: 40,
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 6
          }}>
          <Text style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 16,
            color: "white"
          }}>Login</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate("Register")} style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 16, textAlign: "center" }}>Don't have an account? Sign up</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Login

const styles = StyleSheet.create({})