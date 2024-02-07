import { Button, Image, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { UserType } from '../UserContext'
import axios from 'axios'

const ThreadScreen = () => {
  const [content, setContent] = useState("")
  const {userId, setUserId} = useContext(UserType);

  const handlePostSubmit = () =>{
    const postData ={
      userId,
    }

    if(content){
      postData.content=content;
    }

    axios.post("http://10.0.0.242:8080/create-post", postData)
    .then((response)=>{
      setContent("");
    }).catch((err)=>{
      console.log("error creating post", err)
    })
  }

  return (
    <SafeAreaView style={{ padding: 10 }}>
      <View style={{ flexDirection: "row",padding:10 ,alignItems: "center", gap: 10 }}>
        <Image
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            resizeMode: "contain",
          }}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
          }}
        />
        <Text>Shivam Sharma</Text>
      </View>
      <View style={{ flexDirection: "row", marginLeft: 10 }}>
        <TextInput
          value={content}
          onChangeText={(text) => setContent(text)}
          placeholderTextColor={"black"}
          placeholder="Type your message..."
          multiline
        />
      </View>

      <View style={{ marginTop: 20 }} />

      <Button onPress={handlePostSubmit} title="Share Post" />
    </SafeAreaView>
  )
}

export default ThreadScreen

const styles = StyleSheet.create({})