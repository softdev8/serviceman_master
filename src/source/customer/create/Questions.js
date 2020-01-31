import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, AsyncStorage, TextInput} from 'react-native';

import { styles, color, windowWidth, fontSize } from "../../styles/theme"

import NavigationBar from "../../../components/NavigationBar";
import Button from "../../../components/Button"

import { NavigationEvents } from 'react-navigation';
import Loading from 'react-native-whc-loading'

import { App } from "../../global"

export default class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            questions: [],
            radio: [],
            checked: [],
            numberPicker: [],
            switchVal: [],
            input: [],
            textarea: [],
            result: []
        }
    }

    actionNext = () => {

        const {radio, checked, numberPicker, switchVal, result, input, textarea} = this.state

        for (let index = 0; index < radio.length; index++) {
            result.push({"name": radio[index].question_name, "answer": radio[index].value})
        }
        
        for (let index = 0; index < numberPicker.length; index++) {
            result.push({"name": numberPicker[index].question_name, "answer": numberPicker[index].value})
        }
        
        for (let index = 0; index < checked.length; index++) {
            
            if(result.find((element) => {
                if (element) {
                    return element.name === checked[index].question_name;    
                }                    
            })) {
                for (let idx = 0; idx < result.length; idx++) {
                    if (result[idx].name == checked[index].question_name) {
                        let new_value = result[idx].answer + ", " + checked[index].value
                        result[idx].answer = new_value
                    }                   
                }           
            } else {
                result.push({"name": checked[index].question_name, "answer": checked[index].value})
            } 
        }

        for (let index = 0; index < switchVal.length; index++) {
            result.push({"name": switchVal[index].question_name, "answer": switchVal[index].value})
        }

        for (let index = 0; index < input.length; index++) {
            result.push({"name": input[index].question_name, "answer": input[index].value})
        }

        for (let index = 0; index < textarea.length; index++) {
            result.push({"name": textarea[index].question_name, "answer": textarea[index].value})
        }

        console.log("Questions:" + JSON.stringify(result));
        AsyncStorage.setItem('questions', JSON.stringify(result));
        
        this.props.navigation.navigate('Note')
    }

    async getQuestions() {

        var serviceId = await AsyncStorage.getItem("serviceId");

        this.refs.loading.show();  

        await fetch(`${App.api_link}questions-list`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                service_id: serviceId
            })
            }).then((response) => response.json())
            .then((responseJson) => {
                
                this.refs.loading.close();

                console.log("Questions:", responseJson);

                if (responseJson.status == "success") {
                    this.setState({
                        questions: responseJson.data
                    })
                } 
            })
            .catch((error) => {
                console.error(error);

                this.refs.loading.close();
        });
    }

    renderItem(parent_item, index) {

        const {numberPicker, switchVal} = this.state

        let listItem = parent_item.question.options.map((item, index) => {
            if (parent_item.question.option_type == "Radio") {
                return this.renderRadioItem(parent_item.question.question_name, item, index);
            } else if (parent_item.question.option_type == "Checkbox") {
                return this.renderCheckItem(parent_item.question.question_name, item, index);
            }
        });   
        
        let val = 0
        if (numberPicker.length !== 0) {

            const jsonArr = JSON.stringify(numberPicker);
            if (jsonArr ) {
                let obj = JSON.parse(jsonArr);     
                for (let index = 0; index < obj.length; index++) {
                    if (obj[index].parent_id === parent_item.question.id) {
                        val = obj[index].value        
                        break
                    }                    
                }                   
            }  
        } 

        let isSwitch = false
        if (switchVal.length !== 0) {

            const jsonArr = JSON.stringify(switchVal);
            if (jsonArr ) {
                let obj = JSON.parse(jsonArr);     
                for (let index = 0; index < obj.length; index++) {
                    if (obj[index].parent_id === parent_item.question.id && obj[index].sub_id === parent_item.question.options[0].id) {
                        isSwitch = true        
                        break
                    }                    
                }                   
            }  
        } 
        
        return (
            (parent_item.question.option_type == "Radio") ?
                <View style={[style.subView, {height: 45 * parent_item.question.options.length}]}>
                    <Text style={[{marginTop: 15, fontSize: fontSize.regular}]}>{parent_item.question.question_name}</Text>
                    {listItem}
                </View> :             
            (parent_item.question.option_type == "Number Picker") ?
                <View style={[style.subView, {flexDirection: 'row', height: 40, marginTop: 5, alignItems: 'center'}]}>
                    <Text style={{flex: 1, fontSize: fontSize.regular, marginRight: 10}}>{parent_item.question.question_name} ({parent_item.question.options[0].name})</Text>
                    <TouchableOpacity onPress={() => this.actionNumberPicker(0, parent_item.question.question_name, parent_item.question.id)}>
                        <Image source={ require('../../../resource/ic_min.png') } style={{width: 25, height: 25}}/>                    
                    </TouchableOpacity>
                    <Text style={{fontSize: fontSize.regular, marginRight: 10, marginLeft: 10}}>{val}</Text>
                    <TouchableOpacity onPress={() => this.actionNumberPicker(1, parent_item.question.question_name, parent_item.question.id)}>
                        <Image source={ require('../../../resource/ic_plus.png') } style={{width: 25, height: 25, marginRight: 3}}/>            
                    </TouchableOpacity>        
                </View> : 
            (parent_item.question.option_type == "Checkbox") ?
                <View style={[style.subView, {height: 60 * parent_item.question.options.length}]}>
                    <Text style={[{marginTop: 10, fontSize: fontSize.regular}]}>{parent_item.question.question_name}</Text>

                    {listItem}
                </View> : 
            (parent_item.question.option_type == "Boolean") ?
                <TouchableOpacity onPress={() => this.actionSwitch(parent_item.question.question_name, parent_item.question.id, parent_item.question.options[0].id)}>
                    <View style={[style.subView, {flexDirection: 'row', height: 40, alignItems: 'center'}]}>
                        <Text style={[{flex: 1, fontSize: fontSize.regular}]}>{parent_item.question.question_name}</Text>
                        <Image source={ (isSwitch) ? require('../../../resource/ic_on.png') : require('../../../resource/ic_off.png') } style={{width: 52, height: 30}}/>
                    </View></TouchableOpacity> : 
            (parent_item.question.option_type == "Single Input") ?
                <View style={[style.subView, {height: 80}]}>
                    <Text style={[{marginTop: 10, fontSize: fontSize.regular}]}>{parent_item.question.question_name}</Text>
                    <TextInput style={{flex: 1, height: 40}}
                        underlineColorAndroid = "transparent"
                        placeholder = {parent_item.question.question_name}
                        placeholderTextColor = {color.input_hold_color}
                        autoCapitalize = "none"
                        onChangeText = {(value) => this.onInputChange(parent_item.question.question_name, value)} />
                </View> : 
            (parent_item.question.option_type == "Textarea") ?
                <View style={[style.subView, {height: 140}]}>
                    <Text style={[{marginTop: 10, fontSize: fontSize.regular}]}>{parent_item.question.question_name}</Text>
                    <TextInput
                        style={[style.textArea, {textAlignVertical: 'top'}]}
                        underlineColorAndroid="transparent"
                        placeholder="Type something"
                        placeholderTextColor="grey"
                        numberOfLines={4}
                        multiline={true}
                        onChangeText = {(value) => this.onTextAreaChange(parent_item.question.question_name, value)} />
                </View> : null
        );
    }

    onInputChange(question_name, value) {

        const {input} = this.state

        if(input.find((element) => {
            if (input) {
                return (element.question_name === question_name);    
            }                    
        })) {
            for (let index = 0; index < input.length; index++) {
                if (input[index].question_name === question_name) {
                    input[index].value = value
                }                    
            }                
        } else {
            input.push({question_name: question_name, value: value})
        }    

        var val = input
            
        this.setState({
            input: val
        })

        console.log("Input:" + JSON.stringify(this.state.input));
    }

    onTextAreaChange(question_name, value) {

        const {textarea} = this.state

        if(textarea.find((element) => {
            if (textarea) {
                return (element.question_name === question_name);    
            }                    
        })) {
            for (let index = 0; index < textarea.length; index++) {
                if (textarea[index].question_name === question_name) {
                    textarea[index].value = value
                }                    
            }                
        } else {
            textarea.push({question_name: question_name, value: value})
        }    

        var val = textarea
            
        this.setState({
            textarea: val
        })

        console.log("TextArea:" + JSON.stringify(this.state.textarea));
    }

    actionRadio = (question_name, value, parent_id, sub_id) => {

        const {radio} = this.state

        if (radio.length == 0) {
            radio.push({question_name: question_name, parent_id: parent_id, sub_id: sub_id, value: value})
        } else {
            if(radio.find((element) => {
                if (radio) {
                    return (element.parent_id === parent_id);    
                }                    
            })) {
                for (let index = 0; index < radio.length; index++) {
                    if (radio[index].parent_id === parent_id) {
                        radio.splice(index, 1)               
                        radio.push({question_name: question_name, parent_id: parent_id, sub_id: sub_id, value: value})
                    }                    
                }                
            } else {
                radio.push({question_name: question_name, parent_id: parent_id, sub_id: sub_id, value: value})
            }                 
        } 

        var val = radio
            
        this.setState({
            radio: val
        })

        console.log("Radio:" + JSON.stringify(this.state.radio));
    }

    renderRadioItem(question_name, sub_item, index) {

        const {radio} = this.state

        let selected = false
        if (radio.length !== 0) {

            const jsonArr = JSON.stringify(radio);
            if (jsonArr ) {
                let obj = JSON.parse(jsonArr);     
                for (let index = 0; index < obj.length; index++) {
                    if (obj[index].parent_id === sub_item.question_id && obj[index].sub_id === sub_item.id) {
                        selected = true
                        break
                    }                    
                }                   
            }  
        }

        return (
            <TouchableOpacity onPress={() => this.actionRadio(question_name, sub_item.name, sub_item.question_id, sub_item.id)}>
                <View style={{flexDirection: 'row', height: 30, marginTop: 5}}>
                    <Text style={[styles.label, {flex: 1}]}>{sub_item.name}</Text>
                    <Image source={ (selected) ? require('../../../resource/ic_radio.png') : require('../../../resource/ic_radio1.png') } style={{width: 24, height: 24}}/>
                </View>
            </TouchableOpacity>
        )
    }

    actionNumberPicker = (index, question_name, parent_id) => {
        const {numberPicker} = this.state

        if (index == 0) {   //minus
            for (let index = 0; index < numberPicker.length; index++) {
                if (numberPicker[index].parent_id == parent_id) {

                    if (numberPicker[index].value > 0) {
                        let new_value = numberPicker[index].value - 1
                        numberPicker[index].value = new_value    
                    }                    
                }               
            } 
        } else {    //plus

            if (numberPicker.length == 0) {
                numberPicker.push({question_name: question_name, parent_id: parent_id, value: 1})
            } else {
                if(numberPicker.find((element) => {
                    if (element) {
                        return element.parent_id === parent_id;    
                    }                    
                })) {
                    for (let idx = 0; idx < numberPicker.length; idx++) {
                        if (numberPicker[idx].parent_id == parent_id) {
                            let new_value = numberPicker[idx].value + 1
                            numberPicker[idx].value = new_value
                        }                   
                    }           
                } else {
                    numberPicker.push({question_name: question_name, parent_id: parent_id, value: 1})
                }                 
            }
        }

        var val = numberPicker
            
        this.setState({
            numberPicker: val
        })

        console.log("Number Picker:" + JSON.stringify(this.state.numberPicker));
    }

    actionCheckbox = (question_name, value, parent_id, sub_id) => {

        const {checked} = this.state

        if (checked.length == 0) {
            checked.push({question_name: question_name, parent_id: parent_id, sub_id: sub_id, value: value})
        } else {
            if(checked.find((element) => {
                if (element) {
                    return (element.parent_id === parent_id && element.sub_id === sub_id);    
                }                    
            })) {
                for (let index = 0; index < checked.length; index++) {
                    if (checked[index].parent_id === parent_id && checked[index].sub_id === sub_id) {
                        checked.splice(index, 1)               
                    }                    
                }                
            } else {
                checked.push({question_name: question_name, parent_id: parent_id, sub_id: sub_id, value: value})
            }                 
        } 

        var val = checked
            
        this.setState({
            checked: val
        })

        console.log("Checked:" + JSON.stringify(this.state.checked));
    }

    renderCheckItem(question_name, sub_item, index) {
        const {checked} = this.state

        let check = false
        if (checked.length !== 0) {

            const jsonArr = JSON.stringify(checked);
            if (jsonArr ) {
                let obj = JSON.parse(jsonArr);     
                for (let index = 0; index < obj.length; index++) {
                    if (obj[index].parent_id === sub_item.question_id && obj[index].sub_id === sub_item.id) {
                        check = true
                        break
                    }                    
                }                   
            }  
        }

        return (
            <TouchableOpacity onPress={() => this.actionCheckbox(question_name, sub_item.name, sub_item.question_id, sub_item.id)}>
                <View style={{flexDirection: 'row', height: 30, marginTop: 10}}>
                    <Text style={[styles.label, {flex: 1}]}>{sub_item.name}</Text>
                    <Image source={ (check) ? require('../../../resource/ic_check.png') : require('../../../resource/ic_check1.png') } style={{width: 24, height: 24}}/>
                </View>
            </TouchableOpacity>
        )
    }

    actionSwitch = (question_name, parent_id, sub_id) => {
        const {switchVal} = this.state

        if (switchVal.length == 0) {
            switchVal.push({question_name: question_name, parent_id: parent_id, sub_id: sub_id, value: "Yes"})
        } else {
            if(switchVal.find((element) => {
                if (element) {
                    return (element.parent_id === parent_id && element.sub_id === sub_id);    
                }                    
            })) {
                for (let index = 0; index < switchVal.length; index++) {
                    if (switchVal[index].parent_id === parent_id && switchVal[index].sub_id === sub_id) {
                        switchVal.splice(index, 1)               
                    }                    
                }                
            } else {
                switchVal.push({question_name: question_name, parent_id: parent_id, sub_id: sub_id, value: "Yes"})
            }                 
        } 

        var val = switchVal
            
        this.setState({
            switchVal: val
        })

        console.log("SwitchVal:" + JSON.stringify(this.state.switchVal));
    }

    render() {

        let listPages = this.state.questions.map((item, index) => {
            return this.renderItem(item, index);
        });            

        return (
            <View style={styles.container}>

                <NavigationEvents
                     onWillFocus={payload => this.getQuestions()} />

                <NavigationBar title={"Questions"} img={require("../../../resource/ic_back.png")} width={20} height={16} index={1} navigation={this.props.navigation} />

                <ScrollView showsVerticalScrollIndicator={false} >

                    {listPages}

                    <TouchableOpacity onPress={() => this.actionNext()}>
                        <View style={{marginBottom: 25, alignSelf: 'center'}}>
                            <Button title={"Next"}/> 
                        </View>
                    </TouchableOpacity>

                </ScrollView>
                
                <Loading ref="loading"/> 
            </View>
        )
    }


}
const style = StyleSheet.create({
    subView: {
        width: windowWidth, 
        backgroundColor: color.cell_bg, 
        paddingLeft: 15, 
        paddingRight: 15, 
        marginTop: 10, 
        justifyContent: 'center'
    },
    textArea: {
        height: 100,
        justifyContent: "flex-start",
        borderColor: 'lightgrey',
        borderWidth: 1,
        padding: 5, 
        marginTop: 5
    }
});