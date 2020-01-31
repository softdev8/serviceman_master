import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Platform, Linking, Alert} from 'react-native';

import { styles, color, windowWidth, fontSize } from "../../styles/theme"

import NavigationBar from "../../../components/NavigationBar";

import { NavigationEvents } from 'react-navigation';
import Loading from 'react-native-whc-loading'

import { App } from "../../global"

export default class PostDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            postDetails: null
        }
    }

    async getPostDetails(post_id) {

        this.refs.loading.show();  

        console.log("post_id:", post_id);

        await fetch(`${App.api_link}post-detail`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                post_id: post_id
            })
            }).then((response) => response.json())
            .then((responseJson) => {
                
                this.refs.loading.close();

                console.log("PostDetails:", responseJson);

                if (responseJson.status == "success") {

                    this.setState({
                        postDetails: responseJson.data
                    })
                }
            })
            .catch((error) => {
                console.error(error);

                this.refs.loading.close();
        });
    }

    actionCancelPost = (post_id, user_id) => {

        Alert.alert(
            'Cancel Job',
            'Are you sure to proceed?',
            [
              {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'Yes, I want to cancel', onPress: () => this.cancel(post_id, user_id) },
            ],
            { cancelable: false }
        ) 
    }

    cancel(post_id, user_id) {
        this.refs.loading.show();  

        console.log("User_id: ", user_id);
        console.log("Post_id:", post_id);

        fetch(`${App.api_link}cancel-service-request`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                post_id: post_id,
                user_id: user_id
            })
            }).then((response) => response.json())
            .then((responseJson) => {
                
                this.refs.loading.close();

                if (responseJson.status == "success") {
                    alert(responseJson.message);

                    this.props.navigation.navigate('MyPost')
                }
            })
            .catch((error) => {
                console.error(error);

                this.refs.loading.close();
        });
    }

    viewMap = (lat, lng, address) => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${lat},${lng}`;
        const label = `${address}`;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });

        Linking.openURL(url); 
    }

    fullscreenImage = (file_link) => {
        this.props.navigation.navigate('FullScreenImage', {file_link: file_link})
    }

    render() {

        const {navigation} = this.props
        let post_id = navigation.state.params.post_id
        let status = navigation.state.params.status

        const {postDetails} = this.state

        let questions = ""
        let prefer_time_bg_color, prefer_time_label, prefer_time_label_color, prefer_day_lable

        if (postDetails != null) {

            if (postDetails.is_urgent == "0" && postDetails.preferred_date == "" && postDetails.preferred_time == "") {
                prefer_time_bg_color = color.post_time_bg
                prefer_time_label = "Any time"
                prefer_time_label_color = color.complete_btn_bg
                prefer_day_lable = ""
            } else {
                prefer_time_bg_color = (postDetails.is_urgent !== "1") ? color.post_time_bg : color.pls_complete_now
                prefer_time_label = (postDetails.is_urgent !== "1") ? postDetails.preferred_time : "Please come now"
                prefer_time_label_color = (postDetails.is_urgent !== "1") ? color.complete_btn_bg : color.cancel_btn_bg
                prefer_day_lable = (postDetails.is_urgent !== "1") ? postDetails.preferred_date : ""    
            }

            for (let index = 0; index < postDetails.questions.length; index++) {
                questions = questions + postDetails.questions[index].name + ((postDetails.questions[index].answer !== "") ? " : " + postDetails.questions[index].answer + "\n" : "\n") 
            }
        }        

        return (
            <View style={{flex: 1, backgroundColor: color.white}}>
                <NavigationEvents
                     onWillFocus={payload => this.getPostDetails(post_id)} />

                <NavigationBar title={"Details"} img={require("../../../resource/ic_back.png")} width={20} height={16} index={1} navigation={this.props.navigation}/>
                
                {(postDetails != null) ?
                    <ScrollView showsVerticalScrollIndicator={false}>
                        
                        {/* status == 2 - When click job details from Bidders/MerchantProfile */}
                        {(status != 2) ?
                            <TouchableOpacity onPress={() => this.actionCancelPost(post_id, postDetails.user_id)}>
                                <View style={[styles.view_size, {borderRadius: 22, justifyContent: 'center', marginTop: 25, marginLeft: 25}, (postDetails.status == 'canceled') ? {backgroundColor: color.disable_btn_bg} : {backgroundColor: color.cancel_btn_bg}]}>
                                    <Text style={[styles.btn_label, (postDetails.status == 'canceled') ? {color: color.top_up} : null]}>{(postDetails.status == 'canceled') ? "Cancelled" : "Cancel Post"}</Text>
                                </View>
                            </TouchableOpacity> : null}

                        <View style={{flexDirection: 'row', width: windowWidth - 30, borderRadius: 7, marginTop: 10, marginLeft: 15}}>
                            <View style={{width: 50, height: 50, backgroundColor: color.grey, borderRadius: 7, marginLeft: 15, marginTop: 15, alignItems: 'center', justifyContent: 'center'}}>
                                <Image source={{ uri: postDetails.service_image }} style={{resizeMode: 'contain', width: 32, height: 25}}/>
                            </View>

                            <View style={{flex: 1, flexDirection: 'column', marginLeft: 10, marginRight: 5}}>
                                <Text style={{color: 'black', fontSize: 14, marginTop: 15}}>{postDetails.service_name}</Text>
                                <Text style={styles.label}>{postDetails.sub_service_name}</Text>
                                <Text style={styles.label}>Job Id: {postDetails.job_id}</Text>
                            </View>
                        </View>

                        <View style={styles.line} />

                        <View style={style.sub_view}>
                            <Text style={style.text_font}>Customer Budget</Text>
                            <Text style={style.text_font1}>$ {postDetails.customer_budget}</Text>
                        </View>
                        <View style={styles.line} />

                        <View style={style.sub_view}>
                            <Text style={style.text_font}>Meetup Location</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{flex: 1, fontSize: 14, marginTop: 5}}>{postDetails.address}</Text>
                                
                                <TouchableOpacity onPress={() => this.viewMap(postDetails.latitude, postDetails.longitude, postDetails.address)}>
                                    <View style={{height: 20, backgroundColor: color.accept_btn_bg, alignItems: 'center', justifyContent: 'center', borderRadius: 10, paddingLeft: 10, paddingRight: 10, marginTop: 3}}>
                                        <Text style={styles.white_small_font}>View Map</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <Text style={{fontSize: 14, marginTop: 5}}>{postDetails.country_name}</Text>
                        </View>
                        <View style={styles.line} />
                        
                        <View style={style.sub_view}>
                            <Text style={style.text_font}>Preferred Date</Text>
                            <View style={{flexDirection: 'row', marginTop: 5, flexWrap: 'wrap'}}>
                                {(prefer_day_lable !== "") ?
                                <Text style={[styles.label, {color: color.title_color}]}>{prefer_day_lable}</Text> : null}
                                {((postDetails.is_urgent == "0" && postDetails.preferred_time !== "") || postDetails.is_urgent == "1" || (postDetails.is_urgent == "0" && postDetails.preferred_date == "" && postDetails.preferred_time == "")) ?
                                    <View style={[{height: 20, backgroundColor: prefer_time_bg_color, borderRadius: 9, justifyContent: 'center'}, (prefer_day_lable !== "") ? {marginLeft: 10} : null]}>
                                        <Text style={{fontSize: 12, paddingLeft: 10, paddingRight: 10, color: prefer_time_label_color}}>{prefer_time_label}</Text>
                                    </View> : null }
                            </View>
                        </View>
                        <View style={styles.line} />

                        <View style={style.sub_view}>
                            <Text style={style.text_font}>Property Type</Text>
                            <Text style={style.text_font1}>{postDetails.property_type}</Text>
                        </View>
                        <View style={styles.line} />
                        
                        <View style={style.sub_view}>
                            <Text style={style.text_font}>Questions</Text>
                            <Text style={style.text_font1}>{questions}</Text>
                        </View>
                        <View style={styles.line} />
                        
                        {(postDetails.additional_notes !== "") ?
                            <View style={style.sub_view}>
                                <Text style={style.text_font}>Additional notes</Text>
                                <Text style={style.text_font1}>{postDetails.additional_notes}</Text>

                                <View style={styles.line} />
                            </View> : null }                            
                        
                        {(postDetails.images !== "") ? 
                            <View style={[style.sub_view, {marginBottom: 20}]}>
                                <Text style={style.text_font}>Photo</Text>
                                
                                <View style={{flexDirection: 'row', marginTop: 15}}>
                                    {(postDetails.images.length > 0) ?
                                        <TouchableOpacity onPress={() => this.fullscreenImage(postDetails.images[0].filename)} >
                                            <Image source={{ uri: postDetails.images[0].filename }} style={style.photo_view}/>
                                        </TouchableOpacity> : null}
                                    {(postDetails.images.length > 1) ? 
                                        <TouchableOpacity onPress={() => this.fullscreenImage(postDetails.images[1].filename)} >
                                            <Image source={{ uri: postDetails.images[1].filename }} style={[style.photo_view, {marginLeft: 10}]}/>
                                        </TouchableOpacity> : null }
                                    {(postDetails.images.length > 2) ?        
                                        <TouchableOpacity onPress={() => this.fullscreenImage(postDetails.images[2].filename)} >    
                                            <Image source={{ uri: postDetails.images[2].filename }} style={[style.photo_view, {marginLeft: 10}]}/>
                                        </TouchableOpacity> : null }
                                </View>
                            </View> : null }  
                    </ScrollView> : null } 

                <Loading ref="loading"/>          
            </View>
        )
    }
}

const style = StyleSheet.create({
    sub_view: {
        width: windowWidth - 65,
        marginLeft: 32
    },
    text_font: {
        fontSize: 13, 
        marginTop: 15,
        fontWeight: 'bold'
    },
    text_font1: {
        fontSize: 15, 
        marginTop: 5
    },
    photo_view: {
        width: 75, 
        height: 75, 
        borderRadius: 37.5
    }
});