import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';

import { styles, color, windowWidth, navbarHeight, fontSize } from "../source/styles/theme"

export default class MyBidItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        
        const { item } = this.props;

        let bg_color = (item.status == "newbid") ? color.cancel_btn_bg : ((item.status == "accepted") ? color.open_btn_bg : color.complete_btn_bg)
        let label = (item.status == "newbid") ? "Pending" : ((item.status == "accepted") ? "Accepted" : "Cancelled")

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

        return (
            <View style={{flexDirection: 'row', width: windowWidth - 30, backgroundColor: color.cell_bg, borderRadius: 7, marginTop: 10}}>
                <View style={{width: 50, height: 50, backgroundColor: color.grey, borderRadius: 7, marginLeft: 15, marginTop: 10, alignItems: 'center', justifyContent: 'center'}}>
                    <Image source={{ uri: item.service_image }} style={{resizeMode: 'contain', width: 32, height: 25}}/>
                </View>

                <View style={{flex: 1, flexDirection: 'column', marginLeft: 10, marginRight: 5}}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                            <Text style={{fontSize: 13, marginTop: 7}}>{item.service_name}</Text>
                            <Text style={{fontSize: 12, marginTop: 3}}>{item.sub_service_name}</Text>
                            {/* <Text style={{fontSize: 14, marginTop: 3, fontWeight: 'bold'}}>{item.customer_name}</Text>     */}
                        </View>

                        <View style={{flexDirection: 'column', marginRight: 10}}>
                            <View style={[{height: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 10, marginTop: 7}, (item.status == "newbid") ? {backgroundColor: color.accept_btn_bg} : ((item.status == "accepted") ? {backgroundColor: color.navigation_bg} : {backgroundColor: color.cancel_btn_bg})]}>
                                <Text style={{color: color.white, fontSize: fontSize.small, paddingLeft: 10, paddingRight: 10}}>{label}</Text>
                            </View>

                            <Text style={{fontSize: 12, marginTop: 8, textAlign: 'right'}}>My Bid: ${item.bid_price}</Text>
                            <Text style={{fontSize: 12, marginTop: 3, textAlign: 'right'}}>Customer: ${item.customer_price}</Text>
                        </View>
                    </View>
                    
                    <Text style={styles.label}>{item.address}</Text>

                    <View style={{flexDirection: 'row', marginTop: 5, flexWrap: 'wrap'}}>
                        {(prefer_day_lable !== "") ?
                        <Text style={[styles.label, {color: color.title_color}]}>{prefer_day_lable}</Text> : null }
                        <View style={[{height: 20, backgroundColor: prefer_time_bg_color, borderRadius: 9, justifyContent: 'center'}, (prefer_day_lable !== "") ? {marginLeft: 10} : null]}>
                            <Text style={{fontSize: 12, paddingLeft: 10, paddingRight: 10, color: prefer_time_label_color}}>{prefer_time_label}</Text>
                        </View>
                    </View>

                    <Text style={[styles.label, {marginBottom: 10}]}>{item.created}</Text>
                </View>

                {/* <View style={{flexDirection: 'column', marginRight: 10}}>
                    <View style={[{height: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 10, marginTop: 7}, (item.status == "newbid") ? {backgroundColor: color.accept_btn_bg} : ((item.status == "accepted") ? {backgroundColor: color.navigation_bg} : {backgroundColor: color.cancel_btn_bg})]}>
                        <Text style={{color: color.white, fontSize: fontSize.small, paddingLeft: 10, paddingRight: 10}}>{label}</Text>
                    </View>

                    <Text style={{fontSize: 12, marginTop: 8, textAlign: 'right'}}>My Bid: ${item.bid_price}</Text>
                    <Text style={{fontSize: 12, marginTop: 3, textAlign: 'right'}}>Budget: ${item.customer_price}</Text>
                </View> */}
            </View>
        );
    }
}

