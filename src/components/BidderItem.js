import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';

import { styles, color, windowWidth, navbarHeight, fontSize } from "../source/styles/theme"

export default class BidderItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        
        const { item } = this.props;

        let label = (item.bid_status == "newbid") ? "Accept Bid" : ((item.bid_status == "accepted") ? "Accepted" : "Cancelled")

        return (
            <View style={{flexDirection: 'row', width: windowWidth - 30, backgroundColor: color.cell_bg, borderRadius: 7, marginTop: 10}}>
                <View style={{width: 50, height: 50, borderRadius: 7, marginLeft: 15, marginTop: 10}}>
                    {(item.user_image !== "") ?
                        <Image source={{ uri: item.user_image }} style={{width: 40, height: 40, borderRadius: 10}}/> :
                        <Image source={ require('../resource/default_avatar.png') } style={{width: 40, height: 40, borderRadius: 10}}/> }
                </View>

                <View style={{flex: 1, flexDirection: 'column', marginLeft: 10, marginRight: 5, marginBottom: 7}}>
                    <Text style={{fontSize: 13, marginTop: 7}}>{item.service_name}</Text>
                    <Text style={{fontSize: 12, marginTop: 3}}>{item.sub_service_name}</Text>
                    <Text style={{fontSize: 14, marginTop: 3, fontWeight: 'bold'}}>{item.username}</Text>

                    <View style={{flexDirection: 'row', marginTop: 3}}>
                        <Image source={ require('../resource/ic_rate1.png') } style={{width: 15, height: 15}}/>
                        <Text style={{color: color.top_up, fontSize: 12, marginLeft: 3}}>{item.good_review}</Text>
                    </View>

                    <Text style={styles.label}>{(item.user_experience == 0) ? "<1" : item.user_experience} experiences </Text>
                    <Text style={styles.label}>{(item.job_completed < 5) ? "<5 jobs completed" : item.job_completed + "jobs completed"}</Text>
                    <Text style={styles.label}>{item.bid_placed_date}</Text>
                </View>

                <View style={{flexDirection: 'column', marginRight: 10}}>
                    <Text style={{fontSize: 14, marginTop: 8, fontWeight: 'bold', textAlign: 'right'}}>${item.bid_price}</Text>
                    <Text style={{fontSize: 12, marginTop: 8, fontWeight: 'bold', textAlign: 'right'}}>{item.fee}</Text>

                    {(item.bid_status !== "newbid") ?
                        <View style={[{height: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 10, marginTop: 7}, (item.bid_status == "newbid") ? {backgroundColor: color.accept_btn_bg} : ((item.bid_status == "accepted") ? {backgroundColor: color.navigation_bg} : {backgroundColor: color.cancel_btn_bg})]}>
                            <Text style={{color: color.white, fontSize: fontSize.small, paddingLeft: 10, paddingRight: 10}}>{label}</Text>
                        </View> : null }
                </View>
            </View>
        );
    }
}

