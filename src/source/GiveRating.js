import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, TextInput, AsyncStorage} from 'react-native';

import { color, styles, windowWidth, fontSize } from "./styles/theme"
import NavigationBar from "../components/NavigationBar";
import Button from "../components/Button"

import Loading from 'react-native-whc-loading'

import { App } from "./global"

export default class GiveRating extends Component {

    constructor(props) {
        super(props);

        this.state = {
            rating: '',
            review: ''
        }
    }

    actionSubmit = async (post_id, post_bid_id, user_id_of_post_user, role_id, index) => {

        console.log("post_id: " + post_id);
        console.log("user_id_of_post_user: " + user_id_of_post_user);
        console.log("user_role_id: " + role_id);

        const {rating, review} = this.state

        if (rating.length == 0) {
            alert("Please select rating.")
        } else if (review.length == 0) {
            alert("Please write a review");
        } else {
            this.refs.loading.show(); 

            var user_id = await AsyncStorage.getItem("user_id");
            console.log("User_id: ", user_id);
        
            await fetch(`${App.api_link}give-rating`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    post_id: post_bid_id,
                    user_id: user_id,
                    rating: rating,
                    review: review,
                    user_id_of_post_user: user_id_of_post_user,
                    user_role_id: role_id
                })
                }).then((response) => response.json())
                .then((responseJson) => {
                    
                    this.refs.loading.close();

                    console.log("Give Rating:", responseJson);

                    if (responseJson.status == "success") {
                        alert(responseJson.message);

                        if (index == 1) {
                            this.props.navigation.navigate("MerchantProfile", {post_id: post_id})
                        } else {
                            this.props.navigation.navigate("JobDetails")
                        }
                    }
                })
                .catch((error) => {
                    console.error(error);

                    this.refs.loading.close();
            });
        }
    }

    actionSelectRate = (rating) => {
        this.setState({
            rating: rating
        })
    }

    render() {

        const {navigation} = this.props
        let post_id = navigation.state.params.post_id
        let post_bid_id = navigation.state.params.post_bid_id
        let user_id_of_post_user = navigation.state.params.user_id_of_post_user
        let role_id = navigation.state.params.role_id
        let index = navigation.state.params.index

        const {rating} = this.state

        return (
            <View style={styles.container}>
                <NavigationBar title={(index == 1) ? "Rate to Merchant" : "Rate to Customer"} img={require("../resource/ic_back.png")} width={20} height={16} index={1} navigation={this.props.navigation} />

                <Text style={{fontSize: 22, marginTop: 25, color: 'black'}}>
                    <Text>How do you </Text><Text style={{fontWeight: 'bold'}}>feel?</Text>
                </Text>
                <View style={{flexDirection: 'row', height: 30, marginTop: 25, alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity onPress={() => this.actionSelectRate("good")}>
                        {(rating == "good") ?
                            <Image source={ require('../resource/ic_rate1.png') } style={style.icon_size}/> :
                            <Image source={ require('../resource/ic_rate2.png') } style={style.icon_size}/> }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.actionSelectRate("normal")}>
                        {(rating == "normal") ?
                            <Image source={ require('../resource/ic_rate4.png') } style={[style.icon_size, {marginLeft: 15}]}/> :
                            <Image source={ require('../resource/ic_rate2.png') } style={[style.icon_size, {marginLeft: 15}]}/> }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.actionSelectRate("bad")}>
                        {(rating == "bad") ?
                            <Image source={ require('../resource/ic_rate3.png') } style={[style.icon_size, {marginLeft: 15}]}/> :
                            <Image source={ require('../resource/ic_rate2.png') } style={[style.icon_size, {marginLeft: 15}]}/> }
                    </TouchableOpacity>
                </View>

                <View style={{flexDirection: 'row'}}>
                    <Text style={{flex: 1, marginLeft: 25, marginTop: 40}}>Write a review</Text>
                </View>

                <View style={{marginTop: 10, width: windowWidth - 50, height: 125, borderRadius: 15, backgroundColor: color.grey}}>
                    <TextInput style={[{flex: 1, fontSize: fontSize.small, marginLeft: 10, marginTop: 5, textAlignVertical: 'top'}]}
                        underlineColorAndroid = "transparent"
                        placeholder = "Type here"
                        placeholderTextColor = {color.input_hold_color}
                        autoCapitalize = "none"
                        multiline={true}
                        onChangeText = {(review) => this.setState({ review: review })}
                        value={this.state.review} />
                </View>

                <TouchableOpacity onPress={() => this.actionSubmit(post_id, post_bid_id, user_id_of_post_user, role_id, index)}>
                    <Button title={"Submit"}/> 
                </TouchableOpacity>

                <Loading ref="loading"/>
            </View>
        )
    }
}

const style = StyleSheet.create({
    icon_size: {
        width: 30,
        height: 30
    }
});
