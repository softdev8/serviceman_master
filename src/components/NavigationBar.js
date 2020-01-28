import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Platform, Image} from 'react-native';

import { color, windowWidth, navbarHeight, fontSize } from "../source/styles/theme"
import { App } from "../source/global"

export default class NavigationBar extends Component {
    constructor(props) {
        super(props);
    }

    actionOpenMenu = (navigation) => {
        App.isOpenMenu = true
        navigation.openDrawer(); 
    }

    render() {

        const { title, img, width, height, navigation, index } = this.props;

        const {goBack} = navigation;
        
        return (
            <View style={[{width: windowWidth, height: navbarHeight, backgroundColor: color.navigation_bg, alignItems: 'center', justifyContent: 'center'}, (Platform.OS == 'ios') ? {paddingTop: 25} : null]}>
                {(title === "ServiceMan") ?
                    <Text style={[{color: color.white, fontSize: fontSize.large}]}>Service<Text style={{fontWeight: 'bold'}}>Man</Text></Text> :
                    <Text style={[{color: color.white, fontSize: fontSize.large}]}>{title}</Text> }
                <TouchableOpacity onPress={() => (index === 1) ? goBack() : this.actionOpenMenu(navigation)} style={[{position: 'absolute', left: 15, alignSelf: 'center'}, (Platform.OS == 'ios') ? {top: 38} : null]} >
                    <Image source={img} style={[{width: width, height: height}]}/>
                </TouchableOpacity>
            </View>
        );
    }
}

