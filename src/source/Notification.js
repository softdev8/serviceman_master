import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, FlatList, AsyncStorage} from 'react-native';

import { styles, color, windowWidth, fontSize } from "./styles/theme"

import NavigationBar from "../components/NavigationBar";
import NotificationItem from "../components/NotificationItem";

import { NavigationEvents } from 'react-navigation';
import Loading from 'react-native-whc-loading'

import { App } from "./global"

export default class Notification extends Component {

    constructor(props) {
        super(props);

        this.state = {
            notificationList: [],
            offset: 0,
            count: 0
        }
    }

    static navigationOptions = () => ({
        header: null
    });

    async getNotification(offset) {

        var user_id = await AsyncStorage.getItem("user_id");
        console.log("user_id: " + user_id);

        if (user_id === null || user_id === "") {
            App.landing_page = "Notification"
            this.props.navigation.navigate('Login')
            
        } else {

            this.refs.loading.show(); 
            
            await fetch(`${App.api_link}alerts`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: user_id,
                    offset: offset
                })
                }).then((response) => response.json())
                .then((responseJson) => {
                    
                    this.refs.loading.close();

                    console.log("Notifications:", responseJson);

                    if (responseJson.status == "success") {
                        
                        if (responseJson.data) {
                            this.setState({
                                notificationList: offset === 0 ? responseJson.data : [...this.state.notificationList, ...responseJson.data],
                                count: responseJson.data.length
                            })
                        }
                    }
                })
                .catch((error) => {
                    console.error(error);

                    this.refs.loading.close();
            });
        }
    }

    handleLoadMore = () => {

        if (this.state.count == 10) {
            this.setState({
                offset: this.state.offset + 1
            }, () => {
                this.getNotification(this.state.offset);
            });    
        }        
    };

    render() {

        return (
            <View style={styles.container}>
                <NavigationEvents
                     onDidFocus={payload => this.getNotification(0)} />

                <NavigationBar title={"Notifications"} img={require("../resource/ic_menu.png")} width={26} height={22} index={0} navigation={this.props.navigation} />
                
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={this.state.notificationList}
                    keyExtractor={(item, index) => item.index}
                    renderItem={({item, index}) => 
                        <NotificationItem item={item} navigation={this.props.navigation} />
                    }
                    onEndReached={this.handleLoadMore}
                    onEndReachedThreshold={0}
                />

                <Loading ref="loading"/>
            </View>
        )
    }
}

