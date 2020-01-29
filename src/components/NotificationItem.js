import React, { Component } from 'react';
import { View, TouchableOpacity, Text, AsyncStorage, StyleSheet, Image } from 'react-native';

import { styles, color, windowWidth, navbarHeight, fontSize } from "../source/styles/theme"

import { App } from "../source/global"

export default class NotificationItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            navigation: props.navigation,
        }
    }

    actionNewJob = async (item) => {
        this.readNotification(item.alert_id)
        this.state.navigation.navigate('JobDetails', {item: item})
    }

    actionDetails = async (item) => {
        this.readNotification(item.alert_id)
        this.state.navigation.navigate('MerchantProfile', {post_id: item.post_id})
    }

    actionCredits = async () => {
        this.readNotification(item.alert_id)
        this.state.navigation.navigate('Credits')
    }

    async readNotification(notification_id) {
        var user_id = await AsyncStorage.getItem("user_id");
        console.log("user_id: ", user_id);
    
        await fetch(`${App.api_link}mark-read-alert`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: user_id,
                alert_id: notification_id
            })
            }).then((response) => response.json())
            .then((responseJson) => {
                
                if (responseJson.status == "error") {
                    
                }
            })
            .catch((error) => {
                console.error(error);
        });
    }

    render() {

        const { item } = this.props;
        console.log("item:" + item);

        return (
            <View>
                {(item.type == "new_job") ?
                    <TouchableOpacity onPress={() => this.actionNewJob(item)}>
                        <View style={[{flexDirection: 'row', width: windowWidth - 30, borderRadius: 7, marginTop: 10, paddingBottom: 10}, (item.is_read == 1) ? {backgroundColor: color.cell_bg} : {backgroundColor: color.notification_cell_bg}]}>
                            <View style={[{width: 50, height: 50, marginLeft: 15, marginTop: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: color.grey}]}>
                                {(item.userimage !== "") ?
                                    <Image source={{ uri: item.userimage }} style={style.photo_view}/> :
                                    <Image source={require("../resource/default_avatar.png")} style={style.photo_view}/> }
                            </View>

                            <View style={{flex: 1, flexDirection: 'column', marginLeft: 10, marginRight: 5}}>
                                <Text style={[styles.label, {marginTop: 7}]}>{item.title}</Text>
                                <Text style={styles.label}>{item.created}</Text>
                            </View>

                            <View style={[{width: 90, height: 20, backgroundColor: color.complete_btn_bg, alignItems: 'center', justifyContent: 'center', borderRadius: 10, marginRight: 10, marginTop: 15}]}>
                                <Text style={{color: color.white, fontSize: fontSize.small}}>New Job</Text>
                            </View>
                        </View></TouchableOpacity> : null}
                
                {(item.type == "postbid" || item.type == "cancel_bid") ?
                    <TouchableOpacity onPress={() => this.actionDetails(item)}>
                        <View style={[{flexDirection: 'row', width: windowWidth - 30, borderRadius: 7, marginTop: 10, paddingBottom: 10}, (item.is_read == 1) ? {backgroundColor: color.cell_bg} : {backgroundColor: color.notification_cell_bg}]}>
                            <View style={[{width: 50, height: 50, marginLeft: 15, marginTop: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: color.grey}]}>
                            {(item.userimage !== "") ?
                                <Image source={{ uri: item.userimage }} style={style.photo_view}/> :
                                <Image source={require("../resource/default_avatar.png")} style={style.photo_view}/> }
                            </View>

                            <View style={{flex: 1, flexDirection: 'column', marginLeft: 10, marginRight: 5}}>
                                <Text style={{color: 'black', fontSize: 13, marginTop: 5}}>{item.title}</Text>
                                <Text style={styles.label}>{item.created}</Text>
                            </View>

                            <View style={[{width: 90, height: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 10, marginRight: 10, marginTop: 15}, (item.type == "postbid") ? {backgroundColor: color.open_btn_bg} : {backgroundColor: color.cancel_btn_bg}]}>
                                <Text style={{color: color.white, fontSize: fontSize.small}}>{(item.type == "postbid") ? "New Offer" : "Canceled"}</Text>
                            </View>
                        </View></TouchableOpacity> : null }
                
                {(item.type == "accept_bid") ?
                    <TouchableOpacity onPress={() => this.actionDetails(item)}>
                        <View style={[{flexDirection: 'row', width: windowWidth - 30, borderRadius: 7, marginTop: 10, paddingBottom: 10}, (item.is_read == 1) ? {backgroundColor: color.cell_bg} : {backgroundColor: color.notification_cell_bg}]}>
                            <View style={[{width: 50, height: 50, marginLeft: 15, marginTop: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: color.grey}]}>
                            {(item.userimage !== "") ?
                                <Image source={{ uri: item.userimage }} style={style.photo_view}/> :
                                <Image source={require("../resource/default_avatar.png")} style={style.photo_view}/> }
                            </View>

                            <View style={{flex: 1, flexDirection: 'column', marginLeft: 10, marginRight: 5}}>
                                <Text style={[styles.label, {marginTop: 10}]}>Yah!!</Text>
                                <Text style={{color: 'black', fontSize: 13, marginTop: 5}}>{item.title}</Text>
                                <Text style={styles.label}>{item.created}</Text>
                            </View>

                            <View style={[{width: 90, height: 20, backgroundColor: color.navigation_bg, alignItems: 'center', justifyContent: 'center', borderRadius: 10, marginRight: 10, marginTop: 15}]}>
                                <Text style={{color: color.white, fontSize: fontSize.small}}>Win</Text>
                            </View>
                        </View></TouchableOpacity> : null}
                
                {(item.type == "topup_notice") ?
                    <TouchableOpacity onPress={() => this.actionCredits(item)}>
                        <View style={[{flexDirection: 'row', width: windowWidth - 30, borderRadius: 7, marginTop: 10, paddingBottom: 10}, (item.is_read == 1) ? {backgroundColor: color.cell_bg} : {backgroundColor: color.notification_cell_bg}]}>
                            <View style={[{width: 50, height: 50, marginLeft: 15, marginTop: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: color.grey}]}>
                            {(item.userimage !== "") ?
                                <Image source={{ uri: item.userimage }} style={style.photo_view}/> :
                                <Image source={require("../resource/default_avatar.png")} style={style.photo_view}/> }
                            </View>

                            <View style={{flex: 1, flexDirection: 'column', marginLeft: 10, marginRight: 5}}>
                                <Text style={{fontSize: 13, marginTop: 5}}>{item.title}</Text>
                                <Text style={styles.label}>{item.created}</Text>
                            </View>

                            <View style={[{width: 90, height: 20, backgroundColor: color.top_up, alignItems: 'center', justifyContent: 'center', borderRadius: 10, marginRight: 10, marginTop: 15}]}>
                                <Text style={{color: color.white, fontSize: fontSize.small}}>Top-up notice</Text>
                            </View>
                        </View></TouchableOpacity> : null}
            </View>
        );
    }
}

const style = StyleSheet.create({
    photo_view: {
        width: 50, 
        height: 50, 
        borderRadius: 10
    }
})
