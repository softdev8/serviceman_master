import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, FlatList, AsyncStorage} from 'react-native';

import { styles, color, windowWidth, fontSize } from "../../styles/theme"

import NavigationBar from "../../../components/NavigationBar";
import MyBidItem from "../../../components/MyBidItem";

import { NavigationEvents } from 'react-navigation';
import Loading from 'react-native-whc-loading'

import { App } from "../../global"

export default class MyBid extends Component {

    constructor(props) {
        super(props);

        this.state = {
            page_index: 0,
            bidList: [],
            winList: [],
            canceledList: []
        }
    }

    async getMyBidList() {

        var user_id = await AsyncStorage.getItem("user_id");
        console.log("user_id: " + user_id);

        if (user_id === null || user_id === "") {
            App.landing_page = "MyBid"
            this.props.navigation.navigate('Login')

        } else {

            this.setState({
                bidList: [],
                winList: [],
                canceledList: []
            })

            this.refs.loading.show(); 
            
            await fetch(`${App.api_link}my-bids`, {
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
                    
                    this.refs.loading.close();

                    console.log("My Bids:", responseJson);

                    if (responseJson.status == "success") {

                        let arrBid = this.state.bidList;
                        let arrWin = this.state.winList;
                        let arrCanceled = this.state.canceledList;
                        
                        if (responseJson.data) {
                            for (let index = 0; index < responseJson.data.length; index++) {
                                
                                if (responseJson.data[index].status == "newbid") {
                                    arrBid.push(responseJson.data[index])                            
    
                                } else if (responseJson.data[index].status == "accepted") {
    
                                    arrWin.push(responseJson.data[index])                            
    
                                } else if (responseJson.data[index].status == "canceled") {
    
                                    arrCanceled.push(responseJson.data[index])                            
                                }
                            }
    
                            this.setState({
                                bidList: arrBid,
                                winList: arrWin,
                                canceledList: arrCanceled
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

    onActionSwitch = (index) => {
        this.setState({
            page_index: index
        })
    }

    pushScreen = async (item, index) => {
        var user_id = await AsyncStorage.getItem("user_id");
        console.log("user_id:" + user_id);
        this.props.navigation.navigate('JobDetails', {item: item, login_userId: user_id, page: "MyBid"})
    }

    render() {

        let page = -1
        const {navigation} = this.props
        if (navigation.state.params) {
            page = navigation.state.params.page    
        }        

        let data = (this.state.page_index == 0 || page == 0) ? this.state.bidList : ((this.state.page_index == 1 || page == 1) ? this.state.winList : this.state.canceledList)

        return (
            <View style={styles.container}>
                <NavigationEvents
                     onWillFocus={payload => this.getMyBidList()} />
                
                <NavigationBar title={"My Bids"} img={require("../../../resource/ic_menu.png")} width={26} height={22} navigation={this.props.navigation} index={0} />
                
                <View style={{flexDirection: 'row', width: windowWidth - 60, height: 45, backgroundColor: color.disable_btn_bg, borderRadius: 10, marginTop: 20}}>
                    <TouchableOpacity style={[style.switch_view, {borderTopLeftRadius: 10, borderBottomLeftRadius: 10}, (this.state.page_index == 0) ? {backgroundColor: color.navigation_bg} : {backgroundColor:color.disable_btn_bg}]} onPress={() => this.onActionSwitch(0)}>
                        <Text style={style.btn_label}>Bid</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[style.switch_view, (this.state.page_index == 1) ? {backgroundColor: color.navigation_bg} : {backgroundColor:color.disable_btn_bg}]} onPress={() => this.onActionSwitch(1)}>
                        <Text style={style.btn_label}>Win</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[style.switch_view, {borderTopRightRadius: 10, borderBottomRightRadius: 10}, (this.state.page_index == 2) ? {backgroundColor: color.navigation_bg} : {backgroundColor:color.disable_btn_bg}]} onPress={() => this.onActionSwitch(2)}>
                        <Text style={style.btn_label}>Cancelled</Text>
                    </TouchableOpacity>
                </View>
                
                {(data.length != 0) ?
                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => item.index}
                        renderItem={({item, index}) => 
                            <TouchableOpacity onPress={() => this.pushScreen(item, index)}>
                                <MyBidItem item={item} />
                            </TouchableOpacity>
                        }
                    /> : null }

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