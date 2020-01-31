import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, FlatList, AsyncStorage} from 'react-native';

import { styles, color, windowWidth, fontSize } from "../../styles/theme"

import NavigationBar from "../../../components/NavigationBar";
import BidderItem from "../../../components/BidderItem";

import { NavigationEvents } from 'react-navigation';
import Loading from 'react-native-whc-loading'

import { App } from "../../global"

export default class Bidders extends Component {

    constructor(props) {
        super(props);

        this.state = {
            page_index: 0,
            bidderList: [],
            acceptedList: [],
            canceledList: []
        }
    }

    static navigationOptions = {
        header: null
    }

    async getBidderList() {

        var user_id = await AsyncStorage.getItem("user_id");
        console.log("user_id: " + user_id);

        if (user_id === null || user_id === "") {
            App.landing_page = "Bidders"
            this.props.navigation.navigate('Login')
            
        } else {

            this.setState({
                bidderList: [],
                acceptedList: [],
                canceledList: []
            })

            await fetch(`${App.api_link}bidders`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: user_id
                })
                }).then((response) => response.json())
                .then((responseJson) => {
                    
                    // this.refs.loading.close();

                    console.log("Bidders:", responseJson);

                    if (responseJson.status == "success") {

                        let arrNewBid = this.state.bidderList;
                        let arrAccetedBid = this.state.acceptedList;
                        let arrCanceledBid = this.state.canceledList;
                                
                        for (let index = 0; index < responseJson.data.length; index++) {
                                
                            if (responseJson.data[index].bid_status == "newbid") {
                                arrNewBid.push(responseJson.data[index])                            

                            } else if (responseJson.data[index].bid_status == "accepted") {

                                arrAccetedBid.push(responseJson.data[index])                            

                            } else if (responseJson.data[index].bid_status == "canceled") {

                                arrCanceledBid.push(responseJson.data[index])                            
                            }
                        }

                        this.setState({
                            bidderList: arrNewBid,
                            acceptedList: arrAccetedBid,
                            canceledList: arrCanceledBid
                        })

                    }
                })
                .catch((error) => {
                    console.error(error);

                    // this.refs.loading.close();
            });
        }
    }

    onActionSwitch = (index) => {
        this.setState({
            page_index: index
        })
    }

    pushScreen = (item) => {
        App.isResaved = false
        this.props.navigation.navigate('MerchantProfile', {post_id: item.post_id})
    }

    render() {

        let data = (this.state.page_index === 0) ? this.state.bidderList : ((this.state.page_index === 1) ? this.state.acceptedList : this.state.canceledList)

        return (
            <View style={styles.container}>
                <NavigationEvents
                     onWillFocus={payload => this.getBidderList()} />
                
                <NavigationBar title={"Bidders"} img={require("../../../resource/ic_menu.png")} width={26} height={22} navigation={this.props.navigation} index={0} />

                <View style={{flexDirection: 'row', width: windowWidth - 60, height: 45, backgroundColor: color.disable_btn_bg, borderRadius: 10, marginTop: 20}}>
                    <TouchableOpacity style={[style.switch_view, {borderTopLeftRadius: 10, borderBottomLeftRadius: 10}, (this.state.page_index == 0) ? {backgroundColor: color.navigation_bg} : {backgroundColor:color.disable_btn_bg}]} onPress={() => this.onActionSwitch(0)}>
                        <Text style={style.btn_label}>New Offers</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[style.switch_view, (this.state.page_index == 1) ? {backgroundColor: color.navigation_bg} : {backgroundColor:color.disable_btn_bg}]} onPress={() => this.onActionSwitch(1)}>
                        <Text style={style.btn_label}>Accepted</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[style.switch_view, {borderTopRightRadius: 10, borderBottomRightRadius: 10}, (this.state.page_index == 2) ? {backgroundColor: color.navigation_bg} : {backgroundColor:color.disable_btn_bg}]} onPress={() => this.onActionSwitch(2)}>
                        <Text style={style.btn_label}>Cancelled</Text>
                    </TouchableOpacity>
                </View>

                {(data.length != 0) ?
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={data}
                        keyExtractor={(item, index) => item.index}
                        renderItem={({item, index}) => 
                            <TouchableOpacity onPress={() => this.pushScreen(item)}>
                                <BidderItem item={item} />
                            </TouchableOpacity>
                        }
                    /> : null
                }
                <Loading ref="loading"/>
            </View>
        )
    }


}
const style = StyleSheet.create({
    switch_view: {
        justifyContent: 'center',
        width: (windowWidth - 60) / 3
    },
    btn_label: {
        fontSize: 15, 
        color: 'white',
        textAlign: 'center'
    },
});