import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../UserContext'
import { UserType } from '../UserContext'

const User = ({ item }) => {
    const { userId, setUserId } = useContext(UserType);
    const [isFollowing, setIsFollowing] = useState(item?.followers?.includes(userId));
    console.log("sds",item);

    useEffect(() => {
        console.log("isFollowing state:", isFollowing);
    }, [isFollowing]);

    const sendFollow = async (currentUserId, selectedUserId) => {
        try {
            console.log("Sending follow request...");
            const response = await fetch("http://10.0.0.242:8080/follow", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ currentUserId, selectedUserId })
            });x
            console.log("Follow response status:", response.status);
            console.log("Follow response body:", await response.text());
            if (response.ok) {
                setIsFollowing(true);
                console.log("Follow success");
            } else {
                setIsFollowing(false);
                console.log("Follow failed");
            }
        } catch (err) {
            console.log("Error sending follow request:", err);
        }
    };
    
    const handleUnfollow = async (targetUserId) => {
        try {
            const response = await fetch("http://10.0.0.242:8080/users/unfollow", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    loggedInUserId: userId,
                    targetUserId: targetUserId
                })
            });
            if (response.ok) {
                setIsFollowing(false);
            }
        } catch (err) {
            console.log("Error unfollowing user:", err);
        }
    };

    return (
        <View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 ,marginBottom:15}}>
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
                <Text style={{ fontSize: 15, fontWeight: "bold", flex: 1 }}>{item?.name}</Text>

                {isFollowing ? (
                    <Pressable
                        onPress={() => handleUnfollow(item._id)}
                        style={{
                            borderColor: "#d0d0d0",
                            borderWidth: 1,
                            borderRadius: 7,
                            padding: 10,
                            width: 100,
                            marginLeft: 10
                        }}>
                        <Text style={{ textAlign: "center", fontSize: 15, fontWeight: "bold" }}>Following</Text>
                    </Pressable>
                ) : (
                    <Pressable
                        onPress={() => sendFollow(userId, item._id)}
                        style={{
                            borderColor: "#d0d0d0",
                            borderWidth: 1,
                            borderRadius: 7,
                            padding: 10,
                            width: 100,
                            marginLeft: 10
                        }}>
                        <Text style={{ textAlign: "center", fontSize: 15, fontWeight: "bold" }}>Follow</Text>
                    </Pressable>
                )}
            </View>
        </View>
    )
}

export default User

const styles = StyleSheet.create({})
