import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Platform, StyleSheet, Image } from 'react-native';

import { styles, color, windowWidth, navbarHeight, fontSize } from "../source/styles/theme"

export default class RateItem1 extends Component {
    constructor(props) {
        super(props);
    }

    onAction() {
        
        if (this.props.callback) {
            this.props.callback();
        }
    }

    render() {
        
        const { happy_cnt, average_cnt, sad_cnt } = this.props;

        return (
            <View style={{flexDirection: 'row', height: 30, marginTop: 25, alignItems: 'center', justifyContent: 'center'}}>
                <Image source={ require('../resource/ic_rate1.png') } style={style.icon_size}/>
                <Text style={style.cnt_lable}>{happy_cnt}</Text>

                <Image source={ require('../resource/ic_rate2.png') } style={[style.icon_size, {marginLeft: 10}]}/>
                <Text style={style.cnt_lable}>{average_cnt}</Text>

                <Image source={ require('../resource/ic_rate3.png') } style={[style.icon_size, {marginLeft: 10}]}/>
                <Text style={style.cnt_lable}>{sad_cnt}</Text>
            </View>
        );
    }
}

const style = StyleSheet.create({
    cnt_lable: {
        color: color.top_up, 
        fontSize: 16, 
        marginLeft: 10, 
        alignSelf: 'center'
    },
    icon_size: {
        width: 30,
        height: 30
    }
});