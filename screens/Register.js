import { StyleSheet, Text, View, SafeAreaView, Image, KeyboardAvoidingView, TextInput, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigtion = useNavigation();

  const handleRegister = () =>{
    const user = {
      name:name,
      email:email,
      password:password
    }
    axios.post("http://10.0.0.242:8080/register", user)
    .then((response)=>{
      console.log(response);
      Alert.alert("Registration Successful");
      setName("")
      setEmail("")
      setPassword("")
    })
    .catch((err)=>{
      console.log(err);
      Alert.alert("Registration Failed","Error Occured During Registration")
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
        <View style={{alignItems:"center", justifyContent:"center"}}>
          <Text style={{fontSize:17,
          fontWeight:"bold",
          marginTop:20}}>Register To your Account</Text>
        </View>

        <View style={{marginTop:30}}>
            <View style={{flexDirection:"row",alignItems:"center", gap:5, borderColor:'#d0d0d0',borderWidth:1, paddingVertical:5,borderRadius:5}}>
            <MaterialCommunityIcons style={{marginLeft:8}} name="email" size={24} color="grey" />
            <TextInput 
            value={name}
            onChangeText={(text)=>setName(text)}
            style={{
              color:"grey", 
              marginVertical:10,
              width:300,
              fontSize:email?16:16}} 
              placeholder='Enter Your Name:' 
              placeholderTextColor={"grey"}/>
            </View>
        </View>

        <View style={{marginTop:30}}>
            <View style={{flexDirection:"row",alignItems:"center", gap:5, borderColor:'#d0d0d0',borderWidth:1, paddingVertical:5,borderRadius:5}}>
            <MaterialCommunityIcons style={{marginLeft:8}} name="email" size={24} color="grey" />
            <TextInput 
            value={email}
            onChangeText={(text)=>setEmail(text)}
            style={{
              color:"grey", 
              marginVertical:10,
              width:300,
              fontSize:email?16:16}} 
              placeholder='Enter Your Email:' 
              placeholderTextColor={"grey"}/>
            </View>
        </View>

        <View style={{marginTop:30}}>
            <View style={{flexDirection:"row",alignItems:"center", gap:5, borderColor:'#d0d0d0',borderWidth:1, paddingVertical:5,borderRadius:5}}>
            <Entypo name="lock" size={24} color="grey" style={{marginLeft:8}}/>
            <TextInput 
            secureTextEntry={true}
            value={password}
            onChangeText={(text)=>setPassword(text)}
            style=
            {{color:"grey", 
            marginVertical:10,
            width:300,
            fontSize:password?16:16}} 
            placeholder='Enter Your password:' 
            placeholderTextColor={"grey"}/>
            </View>
        </View>


        <Pressable 
        onPress={handleRegister}
        style={{
          width:200,
          backgroundColor:"black",
          padding:15,
          marginTop:40,
          marginLeft:"auto",
          marginRight:"auto",
          borderRadius:6
      }}>
        <Text 
        style={{
          textAlign:"center",
          fontWeight:"bold",
          fontSize:16,
          color:"white"
        }}>Register</Text>
      </Pressable>

      <Pressable onPress={()=>navigtion.goBack()} style={{marginTop:10}}>
        <Text style={{fontSize:16, textAlign:"center"}}>Already have an account? Login</Text>
      </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Register

const styles = StyleSheet.create({})