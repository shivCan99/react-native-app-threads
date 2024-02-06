import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { UserContext } from '../UserContext'
import { UserType } from '../UserContext'
const User = ({ item }) => {
    const { userId, setUserId } = useContext(UserType);
    console.log(userId)
    const [requestSent, setRequestSent] = useState(false);
    const sendFollow = async (currentUserId, selectedUsedId) => {
        try {
            const response = await fetch("http://10.0.0.242:8080/follow", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ currentUserId, selectedUsedId })
            })
            if (response.ok) {
                setRequestSent(true);
            }
        }
        catch (err) {

        }
    }
    const handleUnfollow  =async (targetId) =>{
        try{
            const response = await fetch("http://10.0.0.242:8080/users/unfollow", {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    loggedInUserId:userId,
                    targetUserId:targetId
                })
            })
            if(response.ok){
                setRequestSent(false);
                console.log("Unfollowd Successfully")

            }
        }catch(err){
            console.log("Error",err)
        }
    }
    return (
        <View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
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

                {requestSent || item?.followers?.includes(userId) ? (
                    <Pressable
                        onPress={()=>handleUnfollow(item._id)}
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