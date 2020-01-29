import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, AsyncStorage} from 'react-native';

import { styles, color, windowWidth, fontSize } from "./styles/theme"

import NavigationBar from "../components/NavigationBar";
import Loading from 'react-native-whc-loading'
import Button from "../components/Button"

import { App } from "./global"

export default class CloseAccount extends Component {

    constructor(props) {
        super(props);

        this.state = {
            password: ''
        }
    }

    actionCancel = () => {
        this.props.navigation.navigate('Customer') 
    }

    actionCloseAccount = () => {

        const {password} = this.state

        if (password.length == 0) {
            alert("Please enter password");
        } else {

            this.closeAccount();
        }
    }

    async closeAccount() {

        var user_id = await AsyncStorage.getItem("user_id");
        console.log("user_id: " + user_id);

        if (user_id === null || user_id === "") {
            this.props.navigation.navigate('Login')

        } else {
            const {password} = this.state

            this.refs.loading.show(); 
            
            await fetch(`${App.api_link}close-account`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: user_id,
                    password: password
                })
                }).then((response) => response.json())
                .then((responseJson) => {
                    
                    this.refs.loading.close();

                    if (responseJson.status == "success") {
                        
                        Alert.alert(
                            'ServiceMan',
                            responseJson.message,
                            [
                            {text: 'Yes', onPress: () => this.accountClose() },
                            ],
                            { cancelable: false }
                        )
                    } else {
                        alert(responseJson.message);
                    }
                })
                .catch((error) => {
                    console.error(error);

                    this.refs.loading.close();
            });
        }
    }

    accountClose() {
        AsyncStorage.setItem('uid', '');
        AsyncStorage.setItem('name', '');
        AsyncStorage.setItem('email', '');
        AsyncStorage.setItem('avatar', '');
        AsyncStorage.setItem('mobile', '');
        AsyncStorage.setItem('user_role_id', '');
        AsyncStorage.setItem('is_active', '');
        AsyncStorage.setItem('user_id', '');

        this.props.navigation.navigate('Customer')
    }

    render() {

        return (
            <View style={styles.container}>
                <NavigationBar title={"Close Account"} img={require("../resource/ic_menu.png")} width={26} height={22} navigation={this.props.navigation} index={0} />

                <View style={{width: windowWidth - 50, height: 175, backgroundColor: color.cell_bg, borderRadius: 10, borderColor: color.alert_boder, borderWidth: 1.2, marginTop: 50}}>
                    <Text style={{fontSize: 18, marginTop: 25, marginLeft: 25, textAlign: 'center'}}>Password Required</Text>
                    <Text style={{fontSize: 12, marginTop: 15, textAlign: 'center', color: color.top_up}}>Enter password to close account permanently</Text>

                    <View style={{width: windowWidth - 80, height: 40, backgroundColor: color.white, marginTop: 15, borderRadius: 20, marginLeft: 15}}>
                        <TextInput style={[styles.text_input, {textAlign: 'center'}]}
                            underlineColorAndroid = "transparent"
                            placeholder = "Password"
                            placeholderTextColor = {color.input_hold_color}
                            autoCapitalize = "none"
                            secureTextEntry={true}
                            onChangeText = {(password) => this.setState({ password: password })}
                            value={this.state.password} />
                    </View>
                    
                    {/* <View style={{flexDirection: 'row', height: 30, marginTop: 25}}>
                        <TouchableOpacity onPress={() => this.actionCancel()} style={{flex: 1}}>
                            <Text style={{fontSize: 15, color: color.complete_btn_bg, marginLeft: 20}}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.actionCloseAccount()}>
                            <Text style={{fontSize: 15, color: color.complete_btn_bg, textAlign: 'right', marginRight: 20}}>Close Account</Text>
                        </TouchableOpacity>
                    </View> */}
                </View>

                <TouchableOpacity onPress={() => this.actionCloseAccount()}>
                    <Button title={"Close Account"}/>
                </TouchableOpacity>

                <Loading ref="loading"/> 
            </View>
        )
    }


}
