import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Platform} from 'react-native';

import Swiper from '../components/Swiper';

import { color, windowWidth, windowHeight, navbarHeight, fontSize } from "./styles/theme"

let customer = [
    {
        img_link: require('../resource/home.png'),
    },
    {
        img_link: require('../resource/date_time.png'),
    },
    {
        img_link: require('../resource/note.png'),
    },
    {
        img_link: require('../resource/bidders.png'),
    },
    {
        img_link: require('../resource/merchant.png'),
    }
];

let merchant = [
    {
        img_link: require('../resource/search.png'),
    },
    {
        img_link: require('../resource/bid.png'),
    },
    {
        img_link: require('../resource/credit.png'),
    }
];

export default class Guide extends Component {

    constructor(props) {
        super(props);
    }

    renderItem(item) {
        return (
            <View key={item.title} style={styles.slide}>
                <View>
                    <Image source={ item.img_link } style={{resizeMode: 'stretch', height: windowHeight - 250, width: windowWidth - 40, margin: 20}}/>
                </View>
            </View>
        );
    }
    onMomentumScrollEnd(e, state, content) {
        this.setState({
            index: state.index
        })
    }

    render() {

        const {navigation} = this.props
        let index = navigation.state.params.index

        let listPages = null

        if (index == 0) {
            listPages = customer.map((item) => {
                return this.renderItem(item);
            });    
        } else {
            listPages = merchant.map((item) => {
                return this.renderItem(item);
            });    
        }        

        return (
            <View style={styles.container}>
                <View style={[{width: windowWidth, height: navbarHeight, backgroundColor: color.navigation_bg, alignItems: 'center', justifyContent: 'center'}, (Platform.OS == 'ios') ? {paddingTop: 25} : null]}>
                    <Text style={[{color: color.white, fontSize: fontSize.large}]}>{(index == 0) ? "Customer Guide" : "Merchant Guide"}</Text> 
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Help')} style={[{position: 'absolute', left: 15, alignSelf: 'center'}, (Platform.OS == 'ios') ? {top: 38} : null]} >
                        <Image source={require("../resource/ic_back.png")} style={[{width: 20, height: 16}]}/>
                    </TouchableOpacity>
                </View>

                <Swiper
                    activeDotColor={"#27BCEF"}
                    style={styles.wrapper}
                    showsButtons={false}
                    onMomentumScrollEnd={this.onMomentumScrollEnd.bind(this)}
                    ref="Swiper" >
                    {listPages}
                </Swiper>
            </View>
        )
    }


}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.white
    }
});