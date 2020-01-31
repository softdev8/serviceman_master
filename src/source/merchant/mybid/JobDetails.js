import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Linking, Platform, AsyncStorage} from 'react-native';

import { styles, color, windowWidth, fontSize } from "../../styles/theme"

import NavigationBar from "../../../components/NavigationBar";
import Loading from 'react-native-whc-loading'

import { Email } from 'react-native-openanything';
import { App } from "../../global"

import moment from 'moment-timezone';

const utcDateToString = (momentInUTC) => {
    var june = moment(momentInUTC);
    june.tz('Asia/Tokyo').format('YYYY-MM-DD HH:mm:ss');

    return june;
};

export default class JobDetails extends Component {

    constructor(props) {
        super(props);
    }

    actionButton = (status, post_id, customer_price) => {
        if (status == "open") {
            this.props.navigation.navigate('Bid', {post_id: post_id, price: customer_price})
        } else if (status == "newbid" || status == "accepted") {

            var title = "Cancel Bid"
            if (status == "newbid") title = "Reject Bid"

            Alert.alert(
                title,
                'Are you sure to proceed?',
                [
                  {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  {text: 'Yes', onPress: () => this.cancel(status, post_id) },
                ],
                { cancelable: false }
            ) 
        }
    }

    async cancel(status, post_id) {    

        var user_id = await AsyncStorage.getItem("user_id");
        console.log("User_id: ", user_id);

        this.refs.loading.show();  

        var api_link = ''
        if (status == "newbid") {   //before accept
            api_link = `${App.api_link}cancel-bid-before-accept-by-merchant`
        } else {    //after accept
            api_link = `${App.api_link}cancel-bid-after-accept-by-merchant`
        }

        await fetch(api_link, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                post_bid_id: post_id,
                user_id: user_id
            })
            }).then((response) => response.json())
            .then((responseJson) => {
                
                this.refs.loading.close();

                console.log("Bid canceled by Merchant:", responseJson);

                if (responseJson.status == "success") {
                    this.props.navigation.navigate('MyBid', {page: (status == "newbid") ? 0 : 1})
                } 
            })
            .catch((error) => {
                console.error(error);

                this.refs.loading.close();
        });
    }

    actionGiveRating = (item) => {
        this.props.navigation.navigate('GiveRating', {post_id: item.post_bid_id, user_id_of_post_user: item.customer_id, role_id: item.customer_role_id, index: 2})
    }

    actionReportUser = (customer_id, username, jobId) => {
        let supportId = App.supportID

        Email("contact@servicemanapp.com", "Contact Customer Support " + supportId, "User Id: " + customer_id + "\nUser Name: " + username + "\nJob ID: " + jobId + "\n\n", "contact@servicemanapp.com", "contact@servicemanapp.com");

        App.supportID = supportId + 1
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

    actionReview = (customer_id, customer_role_id) => {
        this.props.navigation.navigate('CustomerProfile', {user_id: customer_id, user_role_id: customer_role_id})
    }

    render() {

        const {navigation} = this.props
        let item = navigation.state.params.item
        let login_userId = navigation.state.params.login_userId
        let page = navigation.state.params.page
        
        //0: newbid, 1: accepted, 2: canceled, 3: open
        let btn_bg_color = (item.status == "open") ? color.navigation_bg : ((item.status == "newbid" || item.status == "accepted") ? color.cancel_btn_bg : color.disable_btn_bg)
        let label = (item.status == "open") ? "Bid Now" : ((item.status == "newbid" || item.status == "accepted") ? "Cancel Bid" : "Cancelled")
        let fontColor = (item.status == "canceled") ? color.top_up : color.white

        let prefer_time_bg_color, prefer_time_label, prefer_time_label_color, prefer_day_lable
        if (item.is_urgent == "0" && item.preferred_date == "" && item.preferred_time == "") {
            prefer_time_bg_color = color.post_time_bg
            prefer_time_label = "Any time"
            prefer_time_label_color = color.complete_btn_bg
            prefer_day_lable = ""
        } else {
            prefer_time_bg_color = (item.is_urgent !== "1") ? color.post_time_bg : color.pls_complete_now
            prefer_time_label = (item.is_urgent !== "1") ? item.preferred_time : "Please come now"
            prefer_time_label_color = (item.is_urgent !== "1") ? color.complete_btn_bg : color.cancel_btn_bg
            prefer_day_lable = (item.is_urgent !== "1") ? item.preferred_date : ""
        }

        let questions = ""
        if (item.questions) {
            for (let index = 0; index < item.questions.length; index++) {
                questions = questions + item.questions[index].name + ((item.questions[index].answer !== "") ? ": " + item.questions[index].answer + ", \n" : "\n") 
            }    
        } 
        
        let post_user_id = (page === "Search") ? item.user_id : item.customer_id

        // console.log("item.user_id:" + item.user_id);
        // console.log("item.customer_id:" + item.customer_id);
        // console.log("login_userId:" + login_userId);

        var currentDate_timestamp = parseInt(utcDateToString(new Date()).valueOf() / 1000)
        console.log("currentDate_timestamp: " + currentDate_timestamp);

        var acceptDate_timestamp = parseInt(utcDateToString(item.created).valueOf() / 1000)
        console.log("acceptDate_timestamp: " + acceptDate_timestamp);

        var deadline = ((currentDate_timestamp - acceptDate_timestamp) >= 1209600) ? true : false

        return (
            <View style={{flex: 1, backgroundColor: color.white}}>
                <NavigationBar title={"Job Details"} img={require("../../../resource/ic_back.png")} width={20} height={16} index={1} navigation={this.props.navigation} />
                
                <ScrollView showsVerticalScrollIndicator={false}>

                    {(post_user_id !== login_userId && (item.status == "open" || item.status == "canceled" || item.status == "newbid" || (item.status == "accepted" && !deadline))) ?
                        <TouchableOpacity onPress={() => this.actionButton(item.status, item.post_id, item.customer_price)}>
                            <View style={[styles.view_size, {backgroundColor: btn_bg_color, borderRadius: 22, justifyContent: 'center', marginTop: 25, marginLeft: 25}]}>
                                <Text style={[styles.btn_label, {color: fontColor}]}>{label}</Text>
                            </View>
                        </TouchableOpacity> : null }

                    <TouchableOpacity onPress={() => this.actionReview(item.customer_id, item.customer_role_id)}>
                        <View style={style.content_view}>
                            {(item.customer_photo !== "") ?
                                <Image source={{ uri: item.customer_photo }} style={{width: 60, height: 60, marginLeft: 15, marginTop: 15, marginBottom: 15, borderRadius: 30}}/> :
                                <Image source={require("../../../resource/default_avatar.png")} style={{resizeMode: 'stretch', width: 60, height: 60, borderRadius: 30, marginLeft: 15, marginTop: 15, marginBottom: 15, }}/> }                       

                            <View style={{flex: 1, flexDirection: 'column', marginLeft: 20, marginRight: 5}}>
                                <Text style={{fontSize: 20, marginTop: 15}}>{item.customer_name}</Text>
                                <View style={{flexDirection: 'row', marginTop: 5}}>
                                    <View style={{flexDirection: 'row', marginTop: 3}}>
                                        <Image source={ require('../../../resource/ic_rate1.png') } style={{width: 15, height: 15}}/>
                                        <Text style={{color: color.top_up, fontSize: 12, marginLeft: 5}}>{item.customer_good_reviews}</Text>

                                        <Image source={ require('../../../resource/ic_rate2.png') } style={{width: 15, height: 15, marginLeft: 10}}/>
                                        <Text style={{color: color.top_up, fontSize: 12, marginLeft: 5}}>{item.customer_normal_reviews}</Text>

                                        <Image source={ require('../../../resource/ic_rate3.png') } style={{width: 15, height: 15, marginLeft: 10}}/>
                                        <Text style={{color: color.top_up, fontSize: 12, marginLeft: 5}}>{item.customer_bad_reviews}</Text>
                                    </View>
                                </View>

                                <View style={[{flexDirection: 'row', height: 45, alignItems: 'center'}]}>
                                    <Image source={ require('../../../resource/ic_phone.png') } style={{width: 20, height: 20}}/>
                                    <Text style={[(item.status == "accepted") ? {fontSize: 15, color: color.top_up} : {fontSize: 20, fontWeight: 'bold', marginTop: 8}, {marginLeft: 15}]}>{(item.status == "accepted" && !deadline) ? item.customer_mobile : "*** *** ****"}</Text>
                                    {(item.status != "accepted" || (item.status == "accepted" && deadline)) ?
                                        <Text style={{color: color.cancel_btn_bg, fontSize: 12, marginLeft: 10}}>Hidden</Text> : null }
                                </View>
                                
                                {/* --------- Accepted Bidder ----------- */}
                                {(item.status == "accepted") ?
                                    <View style={{flexDirection: 'row', marginTop: 5, marginBottom: 10}}>
                                        <TouchableOpacity onPress={() => this.actionGiveRating(item)}>
                                            <View style={[style.rating_btn, {backgroundColor: color.navigation_bg}]}>
                                                <Text style={styles.white_small_font}>Give Rating</Text>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => this.actionReportUser(item.customer_id, item.customer_name, item.post_id)}>
                                            <View style={[style.rating_btn, {backgroundColor: color.complete_btn_bg, marginLeft: 10}]}>
                                                <Text style={styles.white_small_font}>Report User</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View> : null }
                            </View>
                        </View>
                    </TouchableOpacity>

                    <View style={{flexDirection: 'row', width: windowWidth - 30, borderRadius: 7, marginTop: 10, marginLeft: 15}}>
                        <View style={{width: 50, height: 50, backgroundColor: color.grey, borderRadius: 7, marginLeft: 15, marginTop: 15, alignItems: 'center', justifyContent: 'center'}}>
                            <Image source={{ uri: item.service_image }} style={{resizeMode: 'contain', width: 32, height: 25}}/>
                        </View>

                        <View style={{flex: 1, flexDirection: 'column', marginLeft: 10, marginRight: 5}}>
                            <Text style={{color: 'black', fontSize: 14, marginTop: 15}}>{item.service_name}</Text>
                            <Text style={styles.label}>{item.sub_service_name}</Text>
                            <Text style={styles.label}>Job Id: {item.post_id}</Text>
                            {/* <Text style={styles.label}>Create: {item.created}</Text>                         */}
                        </View>
                    </View>

                    <View style={styles.line} />

                    <View style={{flexDirection: 'row', width: windowWidth - 30, marginLeft: 15}}>
                        <View style={style.budget_view}>
                            <Text style={style.text_font}>Customer Budget</Text>
                            <Text style={style.text_font1}>$ {item.customer_price}</Text>
                        </View>
                        {(item.status !== "open") ?
                            <View style={[style.budget_view, {paddingRight: 15}]}>
                                <Text style={[style.text_font, {textAlign: 'right'}]}>Your Bid Price</Text>
                                <Text style={[style.text_font1, {textAlign: 'right'}]}>$ {item.bid_price}</Text>
                                <Text style={{fontSize: 13, marginTop: 5, textAlign: 'right'}}>{item.fee}</Text>
                            </View> : null }
                    </View>
                    <View style={styles.line} />

                    <View style={style.sub_view}>
                        <Text style={style.text_font}>Meetup Location</Text>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{flex: 1, fontSize: 13, marginTop: 5}}>{item.address}</Text>

                            <TouchableOpacity onPress={() => this.viewMap(item.latitude, item.longitude, item.address)}>
                                <View style={{height: 20, backgroundColor: color.accept_btn_bg, alignItems: 'center', justifyContent: 'center', borderRadius: 10, paddingLeft: 10, paddingRight: 10}}>
                                    <Text style={styles.white_small_font}>View Map</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <Text style={{fontSize: 14, marginTop: 5}}>{item.country_name}</Text>
                    </View>
                    <View style={styles.line} />

                    <View style={style.sub_view}>
                        <Text style={style.text_font}>Preferred Date</Text>
                        <View style={{flexDirection: 'row', marginTop: 5, flexWrap: 'wrap'}}>
                            {(prefer_day_lable !== "") ?
                            <Text style={[styles.label, {color: color.title_color}]}>{prefer_day_lable}</Text> : null }
                            {((item.is_urgent == "0" && item.preferred_time !== "") || item.is_urgent == "1" || (item.is_urgent == "0" && item.preferred_date == "" && item.preferred_time == "")) ?
                                <View style={[{height: 20, backgroundColor: prefer_time_bg_color, borderRadius: 9, justifyContent: 'center'}, (prefer_day_lable !== "") ? {marginLeft: 10} : null]}>
                                    <Text style={{fontSize: 12, paddingLeft: 10, paddingRight: 10, color: prefer_time_label_color}}>{prefer_time_label}</Text>
                                </View> : null }
                        </View>
                    </View>
                    <View style={styles.line} />

                    {(item.property_type !== "") ?
                        <View style={style.sub_view}>
                            <Text style={style.text_font}>Property Type</Text>
                            <Text style={style.text_font1}>{item.property_type}</Text>

                            <View style={styles.line} />
                        </View> : null }                    

                    <View style={style.sub_view}>
                        <Text style={style.text_font}>Questions</Text>
                        <Text style={style.text_font1}>{questions}</Text>
                        {/* <Text style={style.text_font1}>Size: Below 500 sqt</Text> */}
                    </View>
                    <View style={styles.line} />

                    {(item.notes !== "") ? 
                        <View style={style.sub_view}>
                            <Text style={style.text_font}>Additional notes</Text>
                            <Text style={style.text_font1}>{item.notes}</Text>

                            <View style={styles.line} />
                        </View> : null }                    

                    {(item.images !== "") ?
                        <View style={[style.sub_view, {marginBottom: 20}]}>
                            <Text style={style.text_font}>Photo</Text>
                            
                            <View style={{flexDirection: 'row', marginTop: 15}}>
                                {(item.images.length > 0) ?
                                    <TouchableOpacity onPress={() => this.fullscreenImage(item.images[0].filename)} >
                                        <Image source={{ uri: item.images[0].filename }} style={style.photo_view}/>
                                    </TouchableOpacity> : null}
                                {(item.images.length > 1) ? 
                                    <TouchableOpacity onPress={() => this.fullscreenImage(item.images[1].filename)} >
                                        <Image source={{ uri: item.images[1].filename }} style={[style.photo_view, {marginLeft: 10}]}/>
                                    </TouchableOpacity> : null }
                                {(item.images.length > 2) ?        
                                    <TouchableOpacity onPress={() => this.fullscreenImage(item.images[2].filename)} >    
                                        <Image source={{ uri: item.images[2].filename }} style={[style.photo_view, {marginLeft: 10}]}/>
                                    </TouchableOpacity> : null }
                            </View>
                        </View> : null } 
                </ScrollView>    

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
    budget_view: {
        width: (windowWidth - 65) / 2,
        marginLeft: 15
    },
    text_font: {
        fontSize: 13, 
        marginTop: 15
    },
    text_font1: {
        fontSize: 15, 
        marginTop: 5
    },
    content_view: {
        flexDirection: 'row', 
        width: windowWidth - 30, 
        backgroundColor: color.cell_bg, 
        marginTop: 10,
        borderRadius: 7,
        marginLeft: 15
    },
    rating_btn: {
        width: 90, 
        height: 22, 
        alignItems: 'center', 
        justifyContent: 'center', 
        borderRadius: 11
    },
    photo_view: {
        width: 75, 
        height: 75, 
        borderRadius: 37.5
    }
});