import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';

import { styles, color, windowWidth, navbarHeight, fontSize } from "../source/styles/theme"

export default class MyPostItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        
        const { item, post } = this.props;

        let bg_color = (item.status === 'canceled') ? color.cancel_btn_bg : color.open_btn_bg
        let label = (item.status === 'canceled') ? "Cancelled" : "Open"

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
            <View style={{flexDirection: 'row', width: windowWidth - 30, backgroundColor: color.cell_bg, borderRadius: 7, marginTop: 10, marginLeft: 15}}>
                <View style={[{width: 50, height: 50, borderRadius: 7, marginLeft: 15, marginTop: 15, alignItems: 'center', justifyContent: 'center'}, {backgroundColor: color.grey}]}>
                    <Image source={{ uri: item.service_image }} style={{resizeMode: 'contain', width: 32, height: 25}}/>
                </View>

                <View style={{flex: 1, flexDirection: 'column', marginLeft: 10, marginRight: 5, backgroundColor: color.cell_bg, marginBottom: 10}}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1, marginRight: 10}}>
                            <Text style={{color: 'black', fontSize: 13, marginTop: 15}}>{item.service_name} - {item.sub_service_name}</Text>
                            {(post != 0) ?
                                <Text style={styles.label}>Created: {item.created}</Text> : null }
                        </View>
                        <View style={{width: 90}}>
                            {(post == 0) ? <Text style={{fontSize: fontSize.small, textAlign: 'right', marginRight: 10, marginTop: 15}}>${item.customer_price}</Text> : null}
                            <View style={[{height: 20, backgroundColor: bg_color, alignItems: 'center', justifyContent: 'center', borderRadius: 10, marginRight: 10}, (post == 1) ? {marginTop: 15} : {marginTop: 5}]}>
                                <Text style={{color: color.white, fontSize: fontSize.small}}>{label}</Text>
                            </View>
                        </View>
                    </View>
                    
                    <Text style={styles.label}>{item.address}</Text>
                    <View style={{flexDirection: 'row', marginTop: 5, flexWrap: 'wrap'}}>
                        {(prefer_day_lable !== "") ?
                        <Text style={[styles.label, {color: color.title_color}]}>{prefer_day_lable}</Text> : null}
                        {((item.is_urgent == "0" && item.preferred_time !== "") || item.is_urgent == "1" || (item.is_urgent == "0" && item.preferred_date == "" && item.preferred_time == "")) ?
                            <View style={[{height: 20, backgroundColor: prefer_time_bg_color, borderRadius: 9, justifyContent: 'center'}, (prefer_day_lable !== "") ? {marginLeft: 10} : null]}>
                                <Text style={{fontSize: 12, paddingLeft: 10, paddingRight: 10, color: prefer_time_label_color}}>{prefer_time_label}</Text>
                            </View> : null }
                    </View>
                </View>

                {/* <View style={{flexDirection: 'column'}}>
                    {(post == 0) ? <Text style={{fontSize: fontSize.small, textAlign: 'right', marginRight: 10, marginTop: 15}}>${item.customer_price}</Text> : null}
                    <View style={[{width: 90, height: 20, backgroundColor: bg_color, alignItems: 'center', justifyContent: 'center', borderRadius: 10, marginRight: 10}, (post == 1) ? {marginTop: 15} : {marginTop: 5}]}>
                        <Text style={{color: color.white, fontSize: fontSize.small}}>{label}</Text>
                    </View>
                </View> */}
            </View>
        );
    }
}

