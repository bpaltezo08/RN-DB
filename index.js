import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import URL from '../api/endpoints.js';

const DBName = "@UnioilLoyaltyApp_";

export const get = async (key) => {
  try {
    const result = await AsyncStorage.getItem(DBName + key)
    return typeof result == 'object' ? JSON.parse(result) : result
  } catch (error) {
    return error
  }
}

export const set = async (key, data, onSuccess, onError) => {
  try {
    const result = await AsyncStorage.setItem(DBName + key, data)
    await onSuccess(result)
  } catch (error) {
    await onError(error)
  }
}

export const session = async () => {
  try {
    const session = await AsyncStorage.getItem(DBName + "session")
    const token = await AsyncStorage.getItem(DBName + "token")
    return {user: JSON.parse(session), token: token.includes("Bearer ") ? token : "Bearer " + token}
  } catch (error) {
    return error
  }
}

export const AddNotification = async (notification) => {
  try{
    let notifications = []
    const allNotifs = await AsyncStorage.getItem(DBName + "notifications")
    if(!allNotifs){
      notifications.push(notification)
      let result = await AsyncStorage.setItem(DBName + "notifications", JSON.stringify(notifications))
      return "Notification successfully added"
    }else{
      notifications = JSON.parse(allNotifs)
      notifications.push(notification)
      let result = await AsyncStorage.setItem(DBName + "notifications", JSON.stringify(notifications))
      return "Notification successfully added"
    }
  }catch(e){
    return e
  }
}

export const remove = async (key) => {
  try{
    const result = await AsyncStorage.removeItem(DBName + key)
  }catch(e){
    return e
  }
}

export const logout = async (callback, catcher) => {
  try{

    const session = await AsyncStorage.getItem(DBName + "session")
    const token = await AsyncStorage.getItem(DBName + "token")

    fetch(URL.logout, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: token.includes("Bearer ") ? token : "Bearer " + token
      },
      body: {},
    }).then(response => response.json())
    .then(async (data) => {
      await AsyncStorage.removeItem(DBName + "session")
      await AsyncStorage.removeItem(DBName + "token")
      callback(data)
    });

  }catch(error){
    catcher(error)
  }
}

export default {
  get,
  set,
  session,
  logout,
  AddNotification,
  remove
}
