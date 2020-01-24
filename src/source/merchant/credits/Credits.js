import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, FlatList, AsyncStorage, Linking} from 'react-native';

import { styles, color, windowWidth, fontSize } from "../../styles/theme"

import NavigationBar from "../../../components/NavigationBar";

import { NavigationEvents } from 'react-navigation';
import Loading from 'react-native-whc-loading'

import {App} from "../../global"

export default class Credits extends Component {

    constructor(props) {
        super(props);

        this.state = {
            list: [],
            current_balance: 0,
            offset: 0
        }
    }

    async getCredit(offset) {

        var user_id = await AsyncStorage.getItem("user_id");
        console.log("user_id: " + user_id);

        if (user_id === null || user_id === "") {
            App.landing_page = "Credits"
            this.props.navigation.navigate('Login')

        } else {

            this.refs.loading.show(); 
            
            await fetch(`${App.api_link}credits`, {
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

                    console.log("Credits:", responseJson);

                    if (responseJson.status == "success") {

                        this.setState({
                            current_balance: responseJson.current_balance,
                            list: offset === 0 ? responseJson.data : [...this.state.list, ...responseJson.data]
                        })
                    }
                })
                .catch((error) => {
                    console.error(error);

                    this.refs.loading.close();
            });
        }
    }

    openLink = () => {

        Linking.canOpenURL(App.topup_link).then(supported => {
            if (supported) {
              Linking.openURL(App.topup_link);
            } else {
              console.log("Don't know how to open URI: " + App.topup_link);
            }
        });
    }

    renderItem = (item, index) => {

        let label_color = (item.type === "charge") ? color.cancel_btn_bg : color.navigation_bg

        var value = (Math.round(item.balance * 100) / 100).toFixed(2)
        var transaction_amount = (Math.round(item.transaction_amount * 100) / 100).toFixed(2)

        let price = (item.type === "charge") ? "- $"+transaction_amount.toString() : "+ $"+transaction_amount.toString()

        return (
            <View style={{flexDirection: 'column', width: windowWidth - 30, backgroundColor: color.cell_bg, marginLeft: 15, borderRadius: 7, marginTop: 10}}>
                <Text style={{marginLeft: 15, marginTop: 8}}>{item.created}</Text>
                <View style={style.line} />
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1, marginTop: 5, marginBottom: 15}}>
                        <Text style={[style.text, {marginRight: 15}]}>{item.transaction_name}</Text>
                        <Text style={[style.text, {marginTop: 5}]}>Job ID: {item.job_id}</Text>
                        {(item.type === "refund") ?
                            <Text style={[style.text, {marginTop: 5, color: label_color}]}>(Refund)</Text> : null }
                        <Text style={[styles.label, {marginLeft: 15, fontSize: 15, marginTop: 5, fontWeight: 'bold'}]}>Balance: ${value}</Text>
                    </View>
                    <Text style={{marginTop: 5, marginRight: 15, color: label_color}}>{price}</Text>
                </View>
            </View> 
        );
    }

    handleLoadMore = () => {
        this.setState({
            offset: this.state.offset + 1
        }, () => {
            this.getCredit(this.state.offset);
        });
    };

    render() {

        var value = (Math.round(this.state.current_balance * 100) / 100).toFixed(2)

        return (
            <View style={styles.container}>
                <NavigationEvents
                     onWillFocus={payload => this.getCredit(0)} />
                
                <NavigationBar title={"ServiceMan Credits"} img={require("../../../resource/ic_menu.png")} width={26} height={22} navigation={this.props.navigation} index={0} /> 
                
                <Text style={[style.label, {marginTop: 20, fontSize: fontSize.regular}]}>Your current credits</Text>
                <Text style={[style.label, {marginTop: 10, fontSize: fontSize.regular, fontWeight: 'bold'}]}>${value}</Text>

                <TouchableOpacity onPress={() => this.openLink()}>
                    <View style={{flexDirection: 'row', marginTop: 10, alignSelf: 'center'}}>
                        <Text style={{fontSize: fontSize.small, color: color.complete_btn_bg, textDecorationLine: 'underline', textDecorationColor: color.complete_btn_bg}}>To to-pop your credits, please read instructions</Text>
                        <Image source={ require('../../../resource/ic_verify.png') } style={{width: 15, height: 15, marginLeft: 10}}/>
                    </View>    
                </TouchableOpacity>

                <FlatList
                    // showsVerticalScrollIndicator={false}
                    data={this.state.list}
                    keyExtractor={(item, index) => item.index}
                    renderItem={({item, index}) => 
                        this.renderItem(item, index)
                    }
                    onEndReached={this.handleLoadMore}
                    onEndReachedThreshold={0}
                />
                    
                <Loading ref="loading"/>                
            </View>
        )
    }


}
const style = StyleSheet.create({
    label: {
        width: windowWidth, 
        color: color.title_color, 
        textAlign: 'center'
    },
    line: {
        height: 0.5, 
        width: windowWidth - 60, 
        backgroundColor: color.grey, 
        marginTop: 10,
        marginLeft: 15
    },
    text: {
        fontSize: 13, 
        color: color.title_color, 
        marginLeft: 15
    }
});