import React, {Component} from 'react';
import {Text, Image, View, StyleSheet, Dimensions, Platform} from 'react-native';

import { color, windowWidth, fontSize } from "../source/styles/theme"

export default class HomeItem extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        
        const { title, thumb_img } = this.props;

        return (
            <View style={style.card}>
                <Image style={{resizeMode: 'contain', width: 54, height: 34}} source={ { uri: thumb_img }}/>
                <Text style={{fontSize: fontSize.small, color: color.top_up, paddingTop: 8, textAlign: 'center'}}>{ title }</Text>
            </View>
        )
    }
};

const style = StyleSheet.create({
    card: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: color.cell_bg,
        height: windowWidth / 3 - 20,
        borderRadius: 5
    }
});
