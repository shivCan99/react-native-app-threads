import { StyleSheet, Text, View, ScrollView, Image } from 'react-native'
import React, { useEffect, useContext, useState, useCallback } from 'react'
import axios from 'axios';
import { UserType } from '../UserContext'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import { decode, encode } from 'base-64';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

const HomeScreen = () => {
  const { userId, setUserId } = useContext(UserType);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUsers();
  }, []);
  useEffect(() => {
    fetchPosts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://10.0.0.242:8080/get-posts");
      setPosts(response.data);
    } catch (error) {
      console.log("error fetching posts", error);
    }
  };

  console.log("posts", posts);
  const handleLike = async (postId) => {
    try {
      const response = await axios.put(
        `http://10.0.0.242:8080/posts/${postId}/${userId}/like`
      );
      const updatedPost = response.data;

      const updatedPosts = posts?.map((post) =>
        post?._id === updatedPost._id ? updatedPost : post
      );

      setPosts(updatedPosts);
    } catch (error) {
      console.log("Error liking the post", error);
    }
  };

  const handleDislike = async (postId) => {
    try {
      const response = await axios.put(
        `http://10.0.0.242:8080/posts/${postId}/${userId}/unlike`
      );
      const updatedPost = response.data;
      // Update the posts array with the updated post
      const updatedPosts = posts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      );
      console.log("updated ",updatedPosts)
    
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };
  return (
    <ScrollView style={{ marginTop: 50, flex: 1, backgroundColor: "white" }}>
    <View style={{ alignItems: "center", marginTop: 20 }}>
      <Image
        style={{ width: 60, height: 40, resizeMode: "contain" }}
        source={{
          uri: "https://freelogopng.com/images/all_img/1688663386threads-logo-transparent.png",
        }}
      />
    </View>

    <View style={{ marginTop: 20 }}>
      {posts?.map((post) => (
        <View
          style={{
            padding: 15,
            borderColor: "#D0D0D0",
            borderTopWidth: 1,
            flexDirection: "row",
            gap: 10,
            marginVertical: 10,
          }}
        >
          <View>
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
          </View>

          <View>
            <Text
              style={{ fontSize: 15, fontWeight: "bold", marginBottom: 4 }}
            >
              {post?.user?.name}
            </Text>
            <Text style={{width:320}}>{post?.content}</Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginTop: 15,
              }}
            >
              {post?.likes?.includes(userId) ? (
                <AntDesign
                  onPress={() => handleDislike(post?._id)}
                  name="heart"
                  size={18}
                  color="red"
                />
              ) : (
                <AntDesign
                  onPress={() => handleLike(post?._id)}
                  name="hearto"
                  size={18}
                  color="black"
                />
              )}

              <FontAwesome name="comment-o" size={18} color="black" />

              <Ionicons name="share-social-outline" size={18} color="black" />
            </View>

            <Text style={{ marginTop: 7, color: "gray" }}>
              {post?.likes?.length} likes • {post?.replies?.length} reply
            </Text>
          </View>
        </View>
      ))}
    </View>
  </ScrollView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})