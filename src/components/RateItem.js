import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Platform, StyleSheet, Image } from 'react-native';

import { styles, color, windowWidth, navbarHeight, fontSize } from "../source/styles/theme"

export default class RateItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { item } = this.props;

        let ic_rate = (item.rating == "good") ? require('../resource/ic_rate1.png') : ((item.rating == "normal") ? require('../resource/ic_rate2.png') : require('../resource/ic_rate3.png'))

        return (
            <View style={{flexDirection: 'column'}}>
                <View style={style.line} />
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1, marginTop: 10, marginBottom: 15}}>
                        <Text style={{fontSize: 14, marginLeft: 15}}>By {item.username}</Text>
                        <Text style={[styles.label, {marginLeft: 15, marginTop: 5}]}>{item.date_posted}</Text>
                        <Text style={{fontSize: 13, color: color.title_color, marginLeft: 15, marginRight: 15, marginTop: 5}}>{item.review}</Text>
                    </View>
                    <Image source={ ic_rate } style={{width: 25, height: 25, marginTop: 15, marginRight: 10}}/>
                </View>
            </View>
        );
    }
}

const style = StyleSheet.create({
    line: {
        height: 0.5, 
        width: windowWidth - 60, 
        backgroundColor: color.grey, 
        marginTop: 10,
        marginLeft: 15
    },
});