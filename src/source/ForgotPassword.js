import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, Image} from 'react-native';

import { styles, color, windowWidth, fontSize, navbarHeight } from "./styles/theme"

import Loading from 'react-native-whc-loading'

import { App } from "./global"

export default class ForgotPassword extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: ''
        }
    }

    async forgotPassword() {

        const {email} = this.state

        if (email.length == 0) {
            alert("Please enter email");
        } else {

            this.refs.loading.show(); 
            
            await fetch(`${App.api_link}forgot-password`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email
                })
                }).then((response) => response.json())
                .then((responseJson) => {
                    
                    this.refs.loading.close();

                    if (responseJson.status == "success") {
                        
                        alert(responseJson.message)
                        
                        if (App.isCustomer == 2) {
                            this.props.navigation.navigate('Home')    
                        } else {
                            this.props.navigation.navigate('Search')    
                        } 
                    } else {
                        
                    }
                })
                .catch((error) => {
                    console.error(error);

                    this.refs.loading.close();
            });
        }
    }

    actionBack = () => {
        this.props.navigation.navigate('Login')
    }

    render() {

        return (
            <View style={styles.container}>
                
                <View style={{width: windowWidth, height: navbarHeight, backgroundColor: color.navigation_bg, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={[{color: color.white, fontSize: fontSize.large}]}>Forgot Password</Text>
                    <TouchableOpacity onPress={() => this.actionBack()} style={[{position: 'absolute', left: 15, alignSelf: 'center'}]} >
                        <Image source={require("../resource/ic_back.png")} style={[{width: 20, height: 16}]}/>
                    </TouchableOpacity>
                </View>
                
                <View style={{width: windowWidth - 50, height: 200, backgroundColor: color.cell_bg, borderRadius: 10, borderColor: color.alert_boder, borderWidth: 1.2, marginTop: 50}}>
                    <Text style={{fontSize: 18, marginTop: 25, textAlign: 'center'}}>Email Required</Text>
                    <Text style={{fontSize: 12, marginTop: 15, textAlign: 'center', color: color.top_up}}>Enter email to send</Text>

                    <View style={{width: windowWidth - 80, height: 40, backgroundColor: color.white, marginTop: 15, borderRadius: 20, marginLeft: 15}}>
                        <TextInput style={{flex: 1, height:40, textAlign: 'center'}}
                            underlineColorAndroid = "transparent"
                            placeholder = "Email"
                            placeholderTextColor = {color.input_hold_color}
                            autoCapitalize = "none"
                            onChangeText = {(email) => this.setState({ email: email })}
                            value={this.state.email} />
                    </View>
                    
                    <View style={{flexDirection: 'row', height: 30, marginTop: 20}}>
                        <TouchableOpacity onPress={() => this.forgotPassword()} style={{flex: 1}}>
                            <Text style={{flex: 1, fontSize: 20, color: color.complete_btn_bg, textAlign: 'center'}}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Loading ref="loading"/> 
            </View>
        )
    }
}
