import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, AsyncStorage} from 'react-native';

import { styles, color, windowWidth, fontSize } from "../../styles/theme"

import NavigationBar from "../../../components/NavigationBar";
import RateItem from "../../../components/RateItem";

import { NavigationEvents } from 'react-navigation';
import Loading from 'react-native-whc-loading'
import MultiSelectView from 'react-native-multiselect-view';

import { Email } from 'react-native-openanything';
import { App } from "../../global"

import moment from 'moment-timezone';

var selectedFilter = []
var interest = [
    'All', 'Home Cleaner', 'Professional Cleaner', 'Air-Con', 'Car service', 'Pet Service', 'Home Chef', 'Movers', 'Telemarketer / Flyer', 'Handyman', 'Electrician', 'Plumber', 'Mother / Elderly Care', 'Sports Coach', 'Education & Tuition', 'Wedding & Beauty'
];

const utcDateToString = (momentInUTC) => {
    var june = moment(momentInUTC);
    june.tz('Europe/Moscow').format('YYYY-MM-DD');

    return june;
};

export default class MerchantProfile extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            item: null
        }
    }

    async getMerchantProfile(post_id) {
        
        selectedFilter = []
        // this.refs.loading.show(); 

        var user_id = await AsyncStorage.getItem("user_id");
        console.log("user_id: " + user_id);

        await fetch(`${App.api_link}bidder-detail`, {
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
                
                // this.refs.loading.close();

                console.log("Bidders Details:", responseJson);

                if (responseJson.status == "success") {

                    this.setState({
                        item: responseJson.data,
                    })
                }
            })
            .catch((error) => {
                console.error(error);

                // this.refs.loading.close();
        });
    }

    actionJobDetails = (post_id) => {
        this.props.navigation.navigate('PostDetails', {post_id: post_id, status: 2})
    }

    actionAccept = async (post_id, post_bid_id) => {

        // this.refs.loading.show(); 

        var user_id = await AsyncStorage.getItem("user_id");
        console.log("User_id: ", user_id);

        await fetch(`${App.api_link}accept-bid`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                post_bid_id: post_bid_id,
                user_id: user_id
            })
            }).then((response) => response.json())
            .then((responseJson) => {
                
                // this.refs.loading.close();

                console.log("Accpeted Bid:", responseJson);

                if (responseJson.status == "success") {

                    Alert.alert(
                        'Success',
                        responseJson.message,
                        [
                            {text: 'Yes', onPress: () => this.getMerchantProfile(post_id), style: 'cancel'}
                        ],
                        { cancelable: false }
                    )                     
                }
            })
            .catch((error) => {
                console.error(error);

                // this.refs.loading.close();
        });
    }

    actionReject = (post_bid_id) => {
        Alert.alert(
            'Reject Bid',
            'Are you sure to proceed?',
            [
              {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'Yes', onPress: () => this.reject(post_bid_id) },
            ],
            { cancelable: false }
        ) 
    }

    actionCancel = (post_id, post_bid_id) => {
        Alert.alert(
            'Cancel Bid',
            'Are you sure to proceed?',
            [
              {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'Yes', onPress: () => this.cancel(post_id, post_bid_id) },
            ],
            { cancelable: false }
        ) 
    }

    async reject(post_bid_id) {
        this.refs.loading.show(); 
        
        var user_id = await AsyncStorage.getItem("user_id");
        console.log("User_id: ", user_id);

        await fetch(`${App.api_link}reject-bid`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                post_bid_id: post_bid_id,
                user_id: user_id
            })
            }).then((response) => response.json())
            .then((responseJson) => {
                
                this.refs.loading.close();

                console.log("Reject Bid:", responseJson);

                if (responseJson.status == "success") {
                    alert(responseJson.message);

                    this.props.navigation.navigate('Bidders')
                }
            })
            .catch((error) => {
                console.error(error);

                this.refs.loading.close();
        });
    }

    async cancel(post_id, post_bid_id) {

        this.refs.loading.show(); 

        var user_id = await AsyncStorage.getItem("user_id");
        console.log("User_id: ", user_id);
        
        await fetch(`${App.api_link}cancel-bid`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                post_bid_id: post_bid_id,
                user_id: user_id
            })
            }).then((response) => response.json())
            .then((responseJson) => {
                
                this.refs.loading.close();

                console.log("Cancel Bid:", responseJson);

                if (responseJson.status == "success") {
                    alert(responseJson.message);

                    this.getMerchantProfile(post_id)
                }
            })
            .catch((error) => {
                console.error(error);

                this.refs.loading.close();
        });
    }

    actionGiveRating = (item) => {
        this.props.navigation.navigate('GiveRating', {post_id: item.post_id, post_bid_id: item.post_bid_id, user_id_of_post_user: item.bidder_id, role_id: item.merchant_role_id, index: 1})
    }

    actionReportUser = (merchant_id, username, jobId) => {
        let supportId = App.supportID

        Email("contact@servicemanapp.com", "Contact Customer Support " + supportId, "User Id: " + merchant_id + "\nUser Name: " + username + "\nJob ID: " + jobId, "contact@servicemanapp.com", "contact@servicemanapp.com");

        App.supportID = supportId + 1
    }

    fullscreenImage = (file_link) => {
        this.props.navigation.navigate('FullScreenImage', {file_link: file_link})
    }

    render() {

        const {item} = this.state

        const {navigation} = this.props
        let post_id = navigation.state.params.post_id

        let real_width = windowWidth - 30

        let prefer_time_bg_color, prefer_time_label, prefer_time_label_color, prefer_day_lable
        
        let list = []
        if (item != null) {
            list = item.reviews.map((item, index) => {
                return <RateItem item={item} />;
            });

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
    
            var myArray = item.user_services.split(',');
            for (let index = 0; index < myArray.length; index++) {
                selectedFilter.push(interest[Number(myArray[index])])            
            }

            console.log("selectedFilter: " + selectedFilter);

            var currentDate_timestamp = parseInt(new Date().valueOf() / 1000)
            console.log("currentDate_timestamp: " + currentDate_timestamp);

            var acceptDate_timestamp = parseInt(utcDateToString(item.datetime).valueOf() / 1000)
            console.log("acceptDate_timestamp: " + acceptDate_timestamp);

            var deadline = ((currentDate_timestamp - acceptDate_timestamp) >= 1209600) ? true : false
        }        

        return (
            <View style={styles.container}>
                <NavigationEvents
                     onWillFocus={payload => this.getMerchantProfile(post_id)} />
                
                <NavigationBar title={"Merchant Profile"} img={require("../../../resource/ic_back.png")} width={20} height={16} index={1} navigation={this.props.navigation} />
                
                {(item != null) ?
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{flexDirection: 'column', width: real_width, backgroundColor: color.merchant_profile_bg, borderRadius: 7, marginTop: 10, alignItems: 'center'}}>

                            {/*  ---------- Canceled Bidder ------- */}
                            {(item.bid_status == "canceled") ?
                                <View style={[{width: real_width - 30, height: 40, backgroundColor: color.disable_btn_bg, borderRadius: 20, justifyContent: 'center', marginTop: 20}]}>
                                    <Text style={styles.btn_label}>Cancelled</Text>
                                </View> : null }
                            
                            <TouchableOpacity onPress={() => this.actionJobDetails(item.post_id)} style={{flexDirection: 'row', marginBottom: 10}}>
                                <View style={{width: 60, height: 60, backgroundColor: color.grey, borderRadius: 7, marginLeft: 15, marginTop: 15, alignItems: 'center', justifyContent: 'center'}}>
                                    <Image source={{ uri: item.service_image }} style={{resizeMode: 'contain', width: 32, height: 25}}/>
                                </View>

                                <View style={{flex: 1, flexDirection: 'column', marginLeft: 10, marginRight: 5, justifyContent: 'center'}}>
                                    <Text style={{fontSize: 14, marginTop: 15}}>{item.service_name}</Text>
                                    <Text style={{fontSize: 14, marginTop: 3}}>{item.sub_service_name}</Text>
                                    {/* <View style={{flexDirection: 'row', marginTop: 5}}>
                                        {(prefer_day_lable !== "") ?
                                        <Text style={[styles.label, {color: color.title_color}]}>{prefer_day_lable}</Text> : null}
                                        {((item.is_urgent == "0" && item.preferred_time !== "") || item.is_urgent == "1" || (item.is_urgent == "0" && item.preferred_date == "" && item.preferred_time == "")) ?
                                            <View style={[{height: 20, backgroundColor: prefer_time_bg_color, borderRadius: 9, justifyContent: 'center'}, (prefer_day_lable !== "") ? {marginLeft: 10} : null]}>
                                                <Text style={{fontSize: 12, paddingLeft: 10, paddingRight: 10, color: prefer_time_label_color}}>{prefer_time_label}</Text>
                                            </View> : null }
                                    </View> */}
                                </View>

                                <Image source={ require("../../../resource/ic_arrow_right.png") } style={{width: 10, height: 17, marginRight: 15, alignSelf: 'center'}}/>
                            </TouchableOpacity>
                        </View>

                        <View style={{flexDirection: 'column', width: real_width, backgroundColor: color.merchant_profile_bg, borderRadius: 7, marginTop: 10, alignItems: 'center'}}>
                            
                            {/* -------- Canceled Bidder - backgroundColor: color.disable_btn_bg, 'grey' --------- */}
                            <View style={[{width: 170, height: 90, borderRadius: 7, marginTop: 20, marginBottom: 10, alignItems: 'center', justifyContent: 'center'}, (item.bid_status == "canceled") ? {backgroundColor: color.disable_btn_bg} : {backgroundColor: color.white}]}>
                                <Text style={{fontSize: 15}}>Merchant Bid Price</Text>
                                <Text style={[{fontSize: 25, fontWeight: 'bold', marginTop: 5}, (item.bid_status == "canceled") ? {color: 'grey'} : {color: color.navigation_bg}]}>$ {item.bid_price}</Text>
                                <Text style={{fontSize: 14}}>{item.fee}</Text>
                            </View>

                            {/* ------ New Bidder, Accepted Bidder ------- */}
                            {(item.bid_status == "newbid") ?
                                <View style={{flexDirection: 'row', height: 40, marginTop: 25, marginBottom: 10}}>

                                    {/*  New Bidder */}
                                    
                                    <TouchableOpacity onPress={() => this.actionAccept(item.post_id, item.post_bid_id)} style={[{width: (real_width - 40) / 2, backgroundColor: color.navigation_bg, borderRadius: 20, justifyContent: 'center'}]}>
                                        <Text style={styles.btn_label}>Accept Bid</Text>
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity onPress={() => this.actionReject(item.post_bid_id)} style={[{width: (real_width - 40) / 2, backgroundColor: color.cancel_btn_bg, borderRadius: 20, justifyContent: 'center', marginLeft: 10}]}>
                                        <Text style={styles.btn_label}>Reject Bid</Text>
                                    </TouchableOpacity>
                                </View> :
                                (item.bid_status == "accepted" && !deadline) ?
                                    <TouchableOpacity onPress={() => this.actionCancel(item.post_id, item.post_bid_id)} style={[{width: (real_width - 40) / 2, height: 40, marginTop: 25, backgroundColor: color.cancel_btn_bg, borderRadius: 20, justifyContent: 'center', marginBottom: 10}]}>
                                        <Text style={styles.btn_label}>Cancel Bid</Text>
                                    </TouchableOpacity> : null}

                            <Text style={{width: real_width - 40, fontSize: 14, marginBottom: 15}}>{item.add_note}</Text>
                        </View>

                        <View style={style.content_view}>
                            {(item.user_image !== "") ?
                                <Image source={{ uri: item.user_image }} style={{width: 60, height: 60, marginLeft: 15, marginTop: 15, marginBottom: 15, borderRadius: 30}}/> :
                                <Image source={ require('../../../resource/default_avatar.png') } style={{width: 60, height: 60, marginLeft: 15, marginTop: 15, marginBottom: 15, borderRadius: 30}}/> }

                            <View style={{flex: 1, flexDirection: 'column', marginLeft: 20, marginRight: 5, marginBottom: 10}}>
                                <Text style={{fontSize: 20, marginTop: 15}}>{item.username}</Text>
                                <Text style={styles.label}>{(item.user_experience == 0) ? "<1" : item.user_experience} experience</Text>
                                <Text style={styles.label}>{(item.job_completed < 5) ? "<5 jobs completed" : item.job_completed + " jobs completed"}</Text>
                                <View style={{flexDirection: 'row', marginTop: 5}}>
                                    <View style={{flexDirection: 'row', marginTop: 3}}>
                                        <Image source={ require('../../../resource/ic_rate1.png') } style={{width: 15, height: 15}}/>
                                        <Text style={{color: color.top_up, fontSize: 12, marginLeft: 5}}>{item.good_review}</Text>

                                        {/* <Image source={ require('../../../resource/ic_rate2.png') } style={{width: 15, height: 15, marginLeft: 10}}/>
                                        <Text style={{color: color.top_up, fontSize: 12, marginLeft: 5}}>{item.normal_review}</Text>

                                        <Image source={ require('../../../resource/ic_rate3.png') } style={{width: 15, height: 15, marginLeft: 10}}/>
                                        <Text style={{color: color.top_up, fontSize: 12, marginLeft: 5}}>{item.bad_review}</Text> */}
                                    </View>
                                </View>
                                
                                {/* --------- Accepted Bidder ----------- */}
                                {(item.bid_status == "accepted") ? 
                                    <View style={{flexDirection: 'row', marginTop: 10}}>
                                        <TouchableOpacity onPress={() => this.actionGiveRating(item)} >
                                            <View style={[style.rating_btn, {backgroundColor: color.navigation_bg}]}>
                                                <Text style={styles.white_small_font}>Give Rating</Text>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => this.actionReportUser(item.bidder_id, item.username, item.post_bid_id)} >
                                            <View style={[style.rating_btn, {backgroundColor: color.complete_btn_bg, marginLeft: 10}]}>
                                                <Text style={styles.white_small_font}>Report User</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View> : null}
                            </View>
                        </View>

                        <View style={[style.content_view, {height: 45, alignItems: 'center'}]}>
                            <Image source={ require('../../../resource/ic_phone.png') } style={{width: 20, height: 20, marginLeft: 15}}/>
                            <Text style={[(item.bid_status == "accepted") ? {fontSize: 15, color: color.top_up} : {fontSize: 25, fontWeight: 'bold', marginTop: 8}, {marginLeft: 15}]}>{(item.bid_status == "accepted") ? item.user_mobile : "*** *** ****"}</Text>
                            {(item.bid_status != "accepted") ?
                                <Text style={{color: color.cancel_btn_bg, fontSize: 12, marginLeft: 10}}>Hidden</Text> : null }
                        </View>

                        {/* <View style={[style.content_view, {height: 45, alignItems: 'center'}]}>
                            <Text style={{fontSize: 15, marginLeft: 15}}>Citizen/Work Permit</Text>
                            <Image source={ require('../../../resource/ic_verify.png') } style={{width: 15, height: 15, marginLeft: 10}}/>
                            {(item.work_permit_verifed == 0) ?
                                <Text style={{color: color.cancel_btn_bg, fontSize: 12, marginLeft: 10}}>Not verified</Text> :
                                <Text style={{color: color.white, fontSize: 12, marginLeft: 10, width: 75, height: 25, backgroundColor: color.navigation_bg, textAlign: 'center', textAlignVertical: 'center', borderRadius: 15}}>Verifed</Text> }
                        </View> */}
                        
                        {(item.user_services != "") ?
                            <View style={[style.content_view, {height: 100, flexDirection: 'column'}]}>
                                <Text style={{fontSize: 15, marginLeft: 15}}>Services</Text>
                                
                                <MultiSelectView
                                    // reload={App.isResaved}
                                    ref='list2'
                                    data={selectedFilter}
                                    activeContainerStyle={style.activeCom}
                                    inactiveContainerStyle={style.inactiveCom}
                                    activeTextStyle={style.activeText}
                                    inactiveTextStyle={style.inactiveText} />
                            </View> : null }
                        
                        {(item.user_description != "") ?
                            <View style={{width: real_width, backgroundColor: color.cell_bg, marginTop: 10, borderRadius: 7}}>
                                <Text style={{fontSize: 15, marginLeft: 15}}>Description</Text>
                                <Text style={{fontSize: 13, color: color.title_color, marginLeft: 15, marginRight: 15, marginBottom: 15, marginTop: 5}}>{item.user_description}</Text>
                            </View> : null }

                        {(item.bidder_previous_work_images !== "") ?
                            <View style={{width: real_width, marginTop: 10, marginBottom: 20}}>
                                <Text style={{fontSize: 15, marginLeft: 15}}>Photo</Text>
                                
                                <View style={{flexDirection: 'row', marginLeft: 15, marginTop: 15}}>
                                    {(item.bidder_previous_work_images.length > 0 && item.bidder_previous_work_images !== "") ?
                                        <TouchableOpacity onPress={() => this.fullscreenImage(item.bidder_previous_work_images[0].filename)} >
                                            <Image source={{ uri: item.bidder_previous_work_images[0].filename }} style={style.photo_view}/>
                                        </TouchableOpacity> : null}
                                    {(item.bidder_previous_work_images.length > 1 && item.bidder_previous_work_images !== "") ? 
                                        <TouchableOpacity onPress={() => this.fullscreenImage(item.bidder_previous_work_images[1].filename)} >
                                            <Image source={{ uri: item.bidder_previous_work_images[1].filename }} style={[style.photo_view, {marginLeft: 10}]}/>
                                        </TouchableOpacity> : null }
                                    {(item.bidder_previous_work_images.length > 2 && item.bidder_previous_work_images !== "") ?        
                                        <TouchableOpacity onPress={() => this.fullscreenImage(item.bidder_previous_work_images[2].filename)} >    
                                            <Image source={{ uri: item.bidder_previous_work_images[2].filename }} style={[style.photo_view, {marginLeft: 10}]}/>
                                        </TouchableOpacity> : null }
                                </View>
                            </View> : null } 

                        <View style={{width: real_width, borderRadius: 7, backgroundColor: color.cell_bg, marginTop: 15, marginBottom: 15}}>
                            <Text style={{fontSize: 15, marginLeft: 15, marginTop: 10, marginBottom: 10}}>Reviews</Text>

                            {list}
                            
                        </View>
                    </ScrollView> : null
                }

                <Loading ref="loading"/>
            </View>
        )
    }


}
const style = StyleSheet.create({
    content_view: {
        flexDirection: 'row', 
        width: windowWidth - 30, 
        backgroundColor: color.cell_bg, 
        marginTop: 10,
        borderRadius: 7
    },
    service_item_view: {
        height: 25, 
        borderWidth: 1, 
        borderColor: color.accept_btn_bg, 
        borderRadius: 12.5, 
        justifyContent: 'center', 
        marginLeft: 10
    },
    service_item_label: {
        color: color.accept_btn_bg, 
        paddingLeft: 12, 
        paddingRight: 12, 
        fontSize: fontSize.small
    },
    line: {
        height: 0.5, 
        width: windowWidth - 60, 
        backgroundColor: color.grey, 
        marginTop: 10,
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
    },
    activeCom: {
        backgroundColor: color.navigation_bg,
    },
    inactiveCom: {
        backgroundColor: 'white',
    },
    activeText: {
        color: color.white,
    },
    inactiveText: {
        color: color.top_up,
    },
});