import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, AsyncStorage} from 'react-native';

import { styles, color, windowWidth, fontSize } from "../../styles/theme"

import NavigationBar from "../../../components/NavigationBar";
import RateItem from "../../../components/RateItem";
import RateItem1 from "../../../components/RateItem1";

import { NavigationEvents } from 'react-navigation';
import Loading from 'react-native-whc-loading'

import { App } from "../../global"

export default class CustomerProfile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            reviewList: [],
            goodCnt: 0,
            normalCnt: 0,
            badCnt: 0
        }
    }

    static navigationOptions = {
        header: null
    }

    async getRatings(user_id, user_role_id) {

        this.refs.loading.show(); 
        
        console.log("user_id:" + user_id);
        console.log("user_role_id:" + user_role_id);

        this.setState({
            goodCnt: 0,
            normalCnt: 0,
            badCnt: 0,
            user_role_id: user_role_id
        })
        
        await fetch(`${App.api_link}ratings`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: user_id,
                user_role_id: user_role_id
            })
            }).then((response) => response.json())
            .then((responseJson) => {
                
                this.refs.loading.close();

                console.log("Merchant Ratings:", responseJson);

                var goodCnt = 0, normalCnt = 0, badCnt = 0

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
                            reviewList: responseJson.data,
                            goodCnt: goodCnt,
                            normalCnt: normalCnt,
                            badCnt: badCnt
                        })
                    }
                }
            })
            .catch((error) => {
                console.error(error);

                this.refs.loading.close();
        });
    }

    render() {

        const {navigation} = this.props
        let user_id = navigation.state.params.user_id
        let user_role_id = navigation.state.params.user_role_id

        const {goodCnt, normalCnt, badCnt} = this.state

        let list = this.state.reviewList.map((item, index) => {
            return <RateItem item={item} />;
        });  

        return (
            <View style={styles.container}>
                <NavigationEvents
                     onWillFocus={payload => this.getRatings(user_id, user_role_id)} />

                <NavigationBar title={"Customer Profile"} img={require("../../../resource/ic_back.png")} width={20} height={16} navigation={this.props.navigation} index={1} />
                
                <ScrollView>
                    <RateItem1 happy_cnt={goodCnt} average_cnt={normalCnt} sad_cnt={badCnt} />

                    <View style={{width: windowWidth - 30, borderRadius: 7, backgroundColor: color.cell_bg, marginTop: 25, marginBottom: 15}}>
                        <Text style={{fontSize: 15, marginLeft: 15, marginTop: 10, marginBottom: 5}}>Reviews</Text>

                        {list}
                    </View>

                </ScrollView>

                <Loading ref="loading"/>
            </View>
        )
    }


}
