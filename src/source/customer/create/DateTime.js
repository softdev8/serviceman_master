import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, AsyncStorage} from 'react-native';

import { styles, color, windowWidth, fontSize } from "../../styles/theme"

import NavigationBar from "../../../components/NavigationBar";
import Button from "../../../components/Button"
import Button1 from "../../../components/Button1"

export default class DateTime extends Component {

    constructor(props) {
        super(props);

        this.state = {
            sel_urgent: 0,
            arr_sel_date: [false, false, false, false, false, false, false, false],
            arr_sel_time: [false, false, false, false]
        }
    }

    actionNext = () => {

        const {arr_sel_date, arr_sel_time, sel_urgent} = this.state

        const str = ["Asap", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        const strTime = ["Morning", "Afternoon", "Evening", "Night"]
        var preferred_date = ""
        var preferred_time = ""

        for (let index = 0; index < arr_sel_date.length; index++) {
            if (arr_sel_date[index]) {
                preferred_date += str[index] + ", "
            }
        }

        for (let idx = 0; idx < arr_sel_time.length; idx++) {
            if (arr_sel_time[idx]) {
                preferred_time += strTime[idx] + ", "
            }
        }

        console.log("preferred_date:", preferred_date.substring(0, preferred_date.length - 2));
        console.log("preferred_time:", preferred_time.substring(0, preferred_time.length - 2));
        console.log("is_urgent:", sel_urgent.toString());

        AsyncStorage.setItem('preferred_date', preferred_date.substring(0, preferred_date.length - 2));
        AsyncStorage.setItem('preferred_time', preferred_time.substring(0, preferred_time.length - 2));
        AsyncStorage.setItem('is_urgent', sel_urgent.toString());

        this.props.navigation.navigate('Questions')
    }

    actionSelect = (index) => {

        let temp = this.state.arr_sel_date

        if (this.state.arr_sel_date[index]) {
            temp[index] = false
        } else {
            temp[index] = true
        }

        this.setState({
            arr_sel_date: temp,
            sel_urgent: 0
        })
    }

    actionTimeSelect = (index) => {

        let temp = this.state.arr_sel_time

        if (this.state.arr_sel_time[index]) {
            temp[index] = false
        } else {
            temp[index] = true
        }

        this.setState({
            arr_sel_time: temp,
            sel_urgent: 0
        })
    }

    actionUrgentSelect = (sel) => {
        if (sel == 0) {
            let temp = this.state.arr_sel_date

            for (let index = 0; index < temp.length; index++) {
                temp[index] = false                
            }
            
            let temp1 = this.state.arr_sel_time
            for (let index = 0; index < temp1.length; index++) {
                temp1[index] = false                
            }

            this.setState({
                arr_sel_date: temp,
                arr_sel_time: temp1
            })
        }

        this.setState({
            sel_urgent: (sel == 0) ? 1 : 0
        })
    }

    render() {

        return (
            <View style={styles.container}>
                <NavigationBar title={"Date & Time"} img={require("../../../resource/ic_back.png")} width={20} height={16} index={1} navigation={this.props.navigation} />

                <View style={{width: windowWidth, height: 115, backgroundColor: color.cell_bg, marginTop: 10}}>
                    <Text style={{height: 25, marginLeft: 15, marginTop: 10, fontSize: fontSize.regular}}>My preferred date</Text>

                    <View style={{flexDirection: 'row', marginLeft: 5, marginTop: 5}}>
                        <TouchableOpacity onPress={() => this.actionSelect(0)}>
                            <Button1 title={"Asap"} status={(this.state.arr_sel_date[0]) ? 1 : 0} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.actionSelect(1)}>
                            <Button1 title={"Mon"} status={(this.state.arr_sel_date[1]) ? 1 : 0} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.actionSelect(2)}>
                            <Button1 title={"Tue"} status={(this.state.arr_sel_date[2]) ? 1 : 0} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.actionSelect(3)}>
                            <Button1 title={"Wed"} status={(this.state.arr_sel_date[3]) ? 1 : 0} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.actionSelect(4)}>
                            <Button1 title={"Thu"} status={(this.state.arr_sel_date[4]) ? 1 : 0} />
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: 'row', marginLeft: 5, marginTop: 10}}>
                        <TouchableOpacity onPress={() => this.actionSelect(5)}>
                            <Button1 title={"Fri"} status={(this.state.arr_sel_date[5]) ? 1 : 0} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.actionSelect(6)}>
                            <Button1 title={"Sat"} status={(this.state.arr_sel_date[6]) ? 1 : 0} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.actionSelect(7)}>
                            <Button1 title={"Sun"} status={(this.state.arr_sel_date[7]) ? 1 : 0} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{width: windowWidth, height: 85, backgroundColor: color.cell_bg, marginTop: 20}}>
                    <Text style={{height: 25, marginLeft: 15, marginTop: 10, fontSize: fontSize.regular}}>My preferred time</Text>

                    <View style={{flexDirection: 'row', marginLeft: 5, marginTop: 5}}>
                        <TouchableOpacity onPress={() => this.actionTimeSelect(0)}>
                            <Button1 title={"Morning"} status={(this.state.arr_sel_time[0]) ? 1 : 0} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.actionTimeSelect(1)}>
                            <Button1 title={"Afternoon"} status={(this.state.arr_sel_time[1]) ? 1 : 0} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.actionTimeSelect(2)}>
                            <Button1 title={"Evening"} status={(this.state.arr_sel_time[2]) ? 1 : 0} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.actionTimeSelect(3)}>
                            <Button1 title={"Night"} status={(this.state.arr_sel_time[3]) ? 1 : 0} />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity onPress={() => this.actionUrgentSelect(this.state.sel_urgent)}>
                    <View style={{flexDirection: 'row', width: windowWidth, marginTop: 25, alignItems: 'center'}}>
                        <Image source={ (this.state.sel_urgent) ? require("../../../resource/ic_radio.png") : require("../../../resource/ic_radio1.png") } style={{width: 24, height: 24, marginLeft: 15}}/>
                        <Text style={{marginLeft: 15, fontSize: fontSize.regular, color: color.top_up}}>Very urgent / please come now</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.actionNext()}>
                    <Button title={"Next"}/>
                </TouchableOpacity>
            </View>
        )
    }


}
const style = StyleSheet.create({
    view_size: {
        height: 26
    },
    linearGradient: {
        borderRadius: 7, 
        alignItems: 'center',
        justifyContent: 'center'
    },
});