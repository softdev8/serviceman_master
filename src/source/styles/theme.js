import { StyleSheet, Dimensions, Platform } from 'react-native';
import { moderateScale as normalize } from 'react-native-size-matters';

const color = {
    fb_btn_bg: "#2f80ed",
    navigation_bg: "#9dcb15",
    btn_bg_gradient: "#96cd3c",
    btn_bg_gradient1: "#63c256",
    grey: "#ebebeb",
    open_btn_bg: "#f7941d",
    cancel_btn_bg: "#ff0000",
    complete_btn_bg: "#00aeef",
    cancel_post: "#ef473a",
    disable_btn_bg: "#d7d7d7",
    accept_btn_bg: "#3cb878",
    report_btn_bg: "#00aeef",
    top_up: "#534741",
    notification_cell_bg: "#f9ebf0",
    cell_bg: "#fafafa",
    post_time_bg: "#bbe7f7",
    anytime_bg: "#e3dbea",
    anytime_font: "#8560a8",
    pls_complete_now: "#f8ddde",
    white: "#ffffff",
    input_hold_color: "#928ab0",
    title_color: "#464646",
    merchant_profile_bg: "#f8fcee",
    contact_us_btn_bg: '#064475',
    alert_boder: '#ededed'
}

const fontSize = {
    small: normalize(12),
    regular: normalize(15),
    large: normalize(17),
}

const fontFamily = {
    bold: "Montserrat-Bold",
    medium: "Montserrat-Medium",
    regular: "Montserrat-Regular"
}

const padding = 10  ;
const navbarHeight = (Platform.OS === 'ios') ? 74 : 54;
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.white,
        alignItems: 'center'
    },
    input_view: {
        flexDirection: 'row', 
        alignItems: 'center',
        backgroundColor: color.grey,
        borderRadius: 22
    },
    text_input: {
        flex: 1, 
        height: 40, 
        marginLeft: 10
    },
    view_size: {
        height: 45,
        width: windowWidth - 50
    },
    label: {
        color: color.top_up, 
        fontSize: 12, 
        marginTop: 3
    },
    btn_label: {
        fontSize: fontSize.large, 
        color: 'white',
        textAlign: 'center'
    },
    line: {
        height: 0.5, 
        width: windowWidth - 40, 
        backgroundColor: color.grey, 
        marginTop: 15,
        marginLeft: 20
    },
    white_small_font: {
        color: color.white, 
        fontSize: fontSize.small
    }
});

export {
    styles,
    color,
    fontSize,
    fontFamily,
    padding,
    navbarHeight,
    windowWidth,
    windowHeight
}
