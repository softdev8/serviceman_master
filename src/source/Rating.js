import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, AsyncStorage, FlatList} from 'react-native';

import { styles, color, windowWidth, fontSize } from "./styles/theme"

import NavigationBar from "../components/NavigationBar";
import RateItem from "../components/RateItem";
import RateItem1 from "../components/RateItem1";

import { NavigationEvents } from 'react-navigation';
import Loading from 'react-native-whc-loading'

import { App } from "./global"

var goodCnt = 0, normalCnt = 0, badCnt = 0

export default class Rating extends Component {

    constructor(props) {
        super(props);

        this.state = {
            reviewList: [],
            user_role_id: 3,
            totalCancelation: 0,
            offset: 0,
            count: 0
        }
    }

    static navigationOptions = {
        header: null
    }

    async getRatings(isFirst) {

        var user_id = await AsyncStorage.getItem("user_id");
        console.log("user_id: " + user_id);

        if (user_id === null || user_id === "") {
            App.landing_page = "Rating"
            this.props.navigation.navigate('Login')
            
        } else {

            if (isFirst) {
                goodCnt = 0
                normalCnt = 0
                badCnt = 0

                this.setState({
                    offset: 0,
                    reviewList: []
                })
            }

            this.refs.loading.show(); 
            
            var user_role_id = await AsyncStorage.getItem("user_role_id");

            console.log("user_id:" + user_id);
            console.log("user_role_id:" + user_role_id);

            this.setState({
                user_role_id: user_role_id
            })
            
            if (user_role_id == 3) {
                this.getTotalCancellations(user_id)
            }

            await fetch(`${App.api_link}ratings`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: user_id,
                    user_role_id: user_role_id,
                    offset: this.state.offset
                })
                }).then((response) => response.json())
                .then((responseJson) => {
                    
                    this.refs.loading.close();

                    console.log("Merchant Ratings:", responseJson);

                    if (responseJson.status == "success") {

                        if (responseJson.data) {
                            for (let index = 0; index < responseJson.data.length; index++) {
                                if (responseJson.data[index].rating == "good") {
                                    goodCnt++
                                } else if (responseJson.data[index].rating == "normal") {
                                    normalCnt++
                                } else if (responseJson.data[index].rating == "bad") {
                                    badCnt++
                                }
                            }

                            this.setState({
                                reviewList: this.state.offset === 0 ? responseJson.data : [...this.state.reviewList, ...responseJson.data],
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

    getTotalCancellations(user_id) {
        fetch(`${App.api_link}total-cancellations`, {
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
                
                console.log("Total Cancelations: ", responseJson);

                if (responseJson.status == "success") {

                    this.setState({
                        totalCancelation: responseJson.data,
                    })
                }
            })
            .catch((error) => {
                console.error(error);

                this.refs.loading.close();
        });
    }

    actionAlert = () => {
        alert("Merchants with job cancellation may face sanctions such as receive less job alerts, account suspensioin and complete ban from the platform.");
    }

    handleLoadMore = () => {
        if (this.state.count == 10) {
            this.setState({
                offset: this.state.offset + 1
            }, () => {
                this.getRatings(false);
            });
        }
    };

    render() {

        // let list = this.state.reviewList.map((item, index) => {
        //     return <RateItem item={item} />;
        // });  

        return (
            <View style={styles.container}>
                <NavigationEvents
                     onWillFocus={payload => this.getRatings(true)} />

                <NavigationBar title={"My Ratings"} img={require("../resource/ic_menu.png")} width={26} height={22} navigation={this.props.navigation} index={0} />
                
                {/* <ScrollView> */}
                    <RateItem1 happy_cnt={goodCnt} average_cnt={normalCnt} sad_cnt={badCnt} />

                    {(this.state.user_role_id == 3) ?
                        <TouchableOpacity onPress={() => this.actionAlert()}>
                            <View style={{width: 170, height: 75, backgroundColor: color.cell_bg, borderRadius: 7, marginTop: 25, alignItems: 'center', justifyContent: 'center', alignSelf: 'center'}}>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{fontSize: 15, textDecorationLine: 'underline', textDecorationColor: color.complete_btn_bg, color: color.complete_btn_bg}}>Total Cancelation</Text>
                                    <Image source={ require('../resource/ic_verify.png') } style={{width: 15, height: 15, marginLeft: 10}}/>
                                </View>                        
                                <Text style={{fontSize: 25, color: color.navigation_bg, fontWeight: 'bold', marginTop: 5}}>{this.state.totalCancelation}</Text>
                            </View></TouchableOpacity> : null }
                        
                    <View style={{width: windowWidth - 30, borderRadius: 7, backgroundColor: color.cell_bg, marginTop: 25, marginBottom: 15}}>
                        <Text style={{fontSize: 15, marginLeft: 15, marginTop: 10, marginBottom: 5}}>Reviews</Text>
                        
                        <FlatList
                            data={this.state.reviewList}
                            keyExtractor={(item, index) => item.index}
                            renderItem={({item, index}) => 
                                <RateItem item={item} />
                            }
                            onEndReached={this.handleLoadMore}
                            onEndReachedThreshold={0}
                        />
                        {/* {list} */}
                    </View>

                {/* </ScrollView> */}

                <Loading ref="loading"/>
            </View>
        )
    }


}
const style = StyleSheet.create({
    
});