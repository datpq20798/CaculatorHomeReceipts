
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ToastAndroid } from 'react-native';
import { firebase } from "../firebase.js";



const Setting = () => {
    const [valueMoneyElectric, setValueMoneyElectric] = useState('');
    const [valueMoneyWater, setValueMoneyWater] = useState('');
    const [valueMoneyInternet, setValueMoneyInternet] = useState('');
    const [valueMoneyHygiene, setValueMoneyHygiene] = useState('');
    const [valueMoneyOther, setValueMoneyOther] = useState('');
    const [valueMoneyBikeElectric, setValueBikeElectric] = useState('');
    const [button1Clicked, setButton1Clicked] = useState(false);
    const [dataSource, setDataSource] = useState([]);

    const [showOtherInput, setShowOtherInput] = useState(false);


   
    const dataSettings = firebase.firestore().collection('Settings')


    
      const NotifyUpdateSettings = () => {
        ToastAndroid.showWithGravity(
          'Bạn đã cập nhật thành công',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
      };





    useEffect(() => {
        const fetchData = async () => {
            try {
                dataSettings.onSnapshot(querySnapshot => {
                    const data = []
                    querySnapshot.forEach((doc) => {
                        const { electric, water, bikeelectric, hygiene, internet, other } = doc.data()
                        data.push({
                            id: doc.id,
                            electric,
                            water,
                            hygiene,
                            internet,
                            bikeelectric,
                            other
                        })
                    })
                    setDataSource(data)
                    if (data.length > 0) {
                        const settings = data[0];
                        setValueMoneyElectric(settings.electric.toString());
                        setValueMoneyWater(settings.water.toString());
                        setValueMoneyInternet(settings.internet.toString());
                        setValueMoneyHygiene(settings.hygiene.toString());
                        setValueBikeElectric(settings.bikeelectric.toString());
                        // Set other values accordingly
                    }
                })


            } catch (error) {
                console.error('Error fetching users: ', error);
            }
        };


        fetchData();
    }, []);

    const formatNumber = (value) => {
        // Convert value to number
        const numericValue = Number(value.replace(/\D/g, ''));

        // Format the number to have thousand separators and append ' đ'
        return numericValue.toLocaleString('vi-VN') + ' đ';
    };






    const saveConfiguration = async () => {
        try {
            const settingsRef = firebase.firestore().collection('Settings').doc('8ss2mE6wmH01erQwjT52');

            // Tạo object mới để cập nhật dữ liệu
            const updatedSettings = {
                electric: parseFloat(valueMoneyElectric), // Chuyển đổi sang số nếu cần
                water: parseFloat(valueMoneyWater),
                internet: parseFloat(valueMoneyInternet),
                hygiene: parseFloat(valueMoneyHygiene),
                bikeelectric: parseFloat(valueMoneyBikeElectric),
                other: parseFloat(valueMoneyOther),
            };

            // Thực hiện cập nhật lên Firestore
            await settingsRef.update(updatedSettings);
            NotifyUpdateSettings();
        } catch (error) {
            console.error('Lỗi khi cập nhật cấu hình:', error);
        }
    };




    return (
        <>

            <ScrollView style={styles.scrollView}>
                <View style={styles.body}>
                    <View style={styles.form}>
                        {/* Tiền điện */}
                        <View style={styles.service}>
                            <Text style={styles.lableService}>Tiền điện1:</Text>
                            <View style={styles.inputValue}>
                                <TextInput
                                    style={styles.inputMoney}
                                    value={formatNumber(valueMoneyElectric)}
                                    keyboardType="numeric"
                                    onChangeText={(text) => {
                                        const numericValue = text.replace(/\D/g, ''); // Lấy giá trị số từ text nhập vào
                                        setValueMoneyElectric(numericValue); // Cập nhật giá trị vào state
                                    }}

                                />
                            </View>
                        </View>

                        {/* Tiền nước */}
                        <View style={styles.service}>
                            <Text style={styles.lableService}>Tiền nước:</Text>
                            <View style={styles.inputValue}>
                                <TextInput
                                    style={styles.inputMoney}
                                    value={formatNumber(valueMoneyWater)}
                                    onChangeText={(text) => {
                                        const numericValue = text.replace(/\D/g, ''); // Lấy giá trị số từ text nhập vào
                                        setValueMoneyWater(numericValue); // Cập nhật giá trị vào state
                                    }}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        {/* Tiền mạng */}
                        <View style={styles.service}>
                            <Text style={styles.lableService}>Tiền mạng:</Text>
                            <View style={styles.inputValue}>
                                <TextInput
                                    style={styles.inputMoney}
                                    value={formatNumber(valueMoneyInternet)}
                                    onChangeText={(text) => {
                                        const numericValue = text.replace(/\D/g, ''); // Lấy giá trị số từ text nhập vào
                                        setValueMoneyInternet(numericValue); // Cập nhật giá trị vào state
                                    }}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>


                        {/* Tiền vệ sinh */}
                        <View style={styles.service}>
                            <Text style={styles.lableService}>Tiền vệ sinh:</Text>
                            <View style={styles.inputValue}>
                                <TextInput
                                    style={styles.inputMoney}
                                    value={formatNumber(valueMoneyHygiene)}
                                    onChangeText={(text) => {
                                        const numericValue = text.replace(/\D/g, ''); // Lấy giá trị số từ text nhập vào
                                        setValueMoneyHygiene(numericValue); // Cập nhật giá trị vào state
                                    }}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>


                        {/* Tiền xe đạp/máy điện */}
                        <View style={styles.service}>
                            <Text style={styles.lableService}>Tiền xe điện:</Text>
                            <View style={styles.inputValue}>
                                <TextInput
                                    style={styles.inputMoney}
                                    value={formatNumber(valueMoneyBikeElectric)}
                                    onChangeText={(text) => {
                                        const numericValue = text.replace(/\D/g, ''); // Lấy giá trị số từ text nhập vào
                                        setValueBikeElectric(numericValue); // Cập nhật giá trị vào state
                                    }}
                                    keyboardType="numeric"

                                />
                            </View>
                        </View>


                        {/* Tiền chi phí khác */}
                        <View style={styles.service}>
                            <Text style={styles.lableService}>Khoản khác:</Text>
                            <View style={styles.inputValue}>
                                <TextInput
                                    style={styles.inputMoney}
                                    value={formatNumber(valueMoneyOther)}
                                    onChangeText={(text) => {
                                        const numericValue = text.replace(/\D/g, ''); // Lấy giá trị số từ text nhập vào
                                        setValueMoneyOther(numericValue); // Cập nhật giá trị vào state
                                    }}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.buttonSaveSetting, button1Clicked && styles.clicked]} onPress={saveConfiguration}>
                            <Text style={styles.textTitle}>Lưu cấu hình</Text>
                        </TouchableOpacity>
                    </View>
                    


                </View>
                
            </ScrollView>
        </>

    )
}
const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#F0FFFF',
    },
    body: {
        flex: 1,

        // flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: 'center',


        backgroundColor: '#F0FFFF',
    },

    form: {
        marginTop: 50
    },

    buttonSaveSetting: {
        width: 200,
        height: 65,
        backgroundColor: '#03A9F4',
        marginBottom: 50,
        marginLeft: 110,
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.51,
        shadowRadius: 13.16,
        elevation: 15,
    },
    textTitle: {
        fontSize: 25,
    },


    //Xử lý CSS từng input
    service: {
        marginTop: 10,
        marginLeft: 30,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    lableService: {
        width: 150,
        marginRight: 10,
        fontSize: 23,
        fontWeight: 'bold',
    },
    inputValue: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'gray',
        borderRadius: 5,
        width: 200,
        height: 50,
        paddingHorizontal: 10,
        marginLeft: 10,
        zIndex: 1,
    },
    inputMoney: {
        flex: 1,
        height: 40,
        fontSize: 23,
    },

})
export default Setting