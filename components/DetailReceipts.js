import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ScrollView, TextInput, FlatList, TouchableOpacity, Modal, ToastAndroid } from 'react-native';
import { firebase } from '../firebase.js';
import 'firebase/database';


const DetailReceipts = ({ route }) => {
    const { receiptInfo } = route.params;
    const isChecked = receiptInfo?.isChecked ?? false;
    const dataSettings = firebase.firestore().collection('Settings')
    const [valueMoneyElectric, setValueMoneyElectric] = useState('');
    const [valueMoneyToiletElectric, setValueMoneyToiletElectric] = useState('');
    const [valueMoneyWater, setValueMoneyWater] = useState('');
    const [valueMoneyInternet, setValueMoneyInternet] = useState('');
    const [valueMoneyHygiene, setValueMoneyHygiene] = useState('');
    const [valueMoneyBikeElectric, setValueBikeElectric] = useState('');
    const [dataSource, setDataSource] = useState([]);

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
                        setValueMoneyToiletElectric(settings.electric.toString());
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
    // Sử dụng thông tin của phiếu thu ở đây để hiển thị chi tiết

    return (

        <ScrollView vertical={true} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
            <ScrollView horizontal={true} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.wrapper}>

                    <View style={{ flex: 1 }}>
                        <Text style={{ ...styles.textTitle1, fontSize: 30, textAlign: 'center', fontWeight: '800' }}>
                            {'PHIẾU THU'}
                        </Text>
                        <View style={{ alignItems: 'center', marginTop: 10, }}>
                            <Text style={{ fontSize: 25, fontWeight: '800' }}>
                                {`Tiền nhà ${receiptInfo.month} `}
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {/* Phòng và Người thuê */}
                        <View style={[styles.optionContainer, { flex: 1 }]}>
                            <TouchableOpacity>
                                <Text style={styles.optionText}>
                                    Phòng: <Text style={receiptInfo.room === receiptInfo.room ? styles.redText : null}>
                                        {receiptInfo.room}
                                    </Text>
                                </Text>
                            </TouchableOpacity>

                            {/* Display selected option information */}
                            <View>
                                <Text style={styles.optionText}>
                                    Người thuê: <Text style={receiptInfo.renter === receiptInfo.renter ? styles.redText : null}> {receiptInfo.renter}</Text>
                                </Text>
                                {/* Other content related to Người thuê */}
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                <Text style={styles.optionText}>
                                    Số người: <Text style={receiptInfo.count === receiptInfo.count ? styles.redText : null}> {receiptInfo.count}</Text>
                                    
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity

                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginBottom: 10,
                                    }}
                                >
                                    <Text style={{ fontSize: 18, marginLeft: 10, marginTop: 10, fontWeight: '800', }}>Chia tiền điện nhà tắm:</Text>
                                    <View
                                        style={{
                                            width: 24,
                                            height: 24,
                                            borderRadius: 5,
                                            borderWidth: 1,
                                            borderColor: 'black',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: 10,
                                            marginLeft: 10,
                                            marginTop: 10
                                        }}
                                    >
                                        {isChecked ? <Text style={{color:'red' , fontWeight: '800',}}>Có</Text> : <Text>X</Text>}
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {isChecked && (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.optionText}>Tổng số người dùng: <Text style={receiptInfo.countPeople === receiptInfo.countPeople ? styles.redText : null}> {receiptInfo.countPeople}</Text>
                                   </Text>

                                </View>
                            )}
                        </View>


                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Text style={styles.optionText}>Số tài khoản: 2007199869999</Text>
                            <Text style={styles.optionText}>Chủ tài khoản: Phạm Quốc Đạt</Text>
                            <Text style={styles.optionText}>Ngân hàng: MB Bank</Text>
                            {/* Thay đổi số tài khoản theo dữ liệu cần hiển thị */}
                        </View>
                    </View>
                    {/* Table Container */}
                    <View style={styles.table}>
                        {/* Table Head */}
                        <View style={styles.table_head}>
                            <View>
                                <Text style={styles.table_head_captions}>STT</Text>
                            </View>
                            <View style={{ marginLeft: 40 }}>
                                <Text style={styles.table_head_captions}>Dịch vụ</Text>
                            </View>
                            <View style={{ marginLeft: 45 }}>
                                <Text style={styles.table_head_captions}>Số đầu kỳ</Text>
                            </View>
                            <View style={{ marginLeft: 45 }}>
                                <Text style={styles.table_head_captions}>Số cuối kỳ</Text>
                            </View>
                            <View style={{ marginLeft: 40 }}>
                                <Text style={styles.table_head_captions}>Công xuất</Text>
                            </View>
                            <View style={{ marginLeft: 40 }}>
                                <Text style={styles.table_head_captions}>Đơn giá</Text>
                            </View>
                            <View style={{ marginLeft: 40 }}>
                                <Text style={styles.table_head_captions}>Thành tiền</Text>
                            </View>
                        </View>

                        {/* Điện */}
                        <View style={styles.table_body_single_row}>
                            <View style={{ width: 20, marginLeft: 20 }}>
                                <Text style={styles.table_data}>1</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 30 }}>
                                <Text style={styles.table_data}>Điện</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 20 }}>
                                <Text
                                    style={[styles.table_data, { fontWeight: '800', color: 'red' }]}

                                > {receiptInfo.sodaukydien}</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 25 }}>
                                <Text
                                    style={[styles.table_data, { fontWeight: '800', color: 'red' }]}

                                >{receiptInfo.socuoikydien}</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 23 }}>
                                <Text style={[styles.table_data, { fontWeight: '800', color: 'red' }]}>{receiptInfo.congxuatdien}</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 20 }}>
                                <Text style={[styles.table_data, { fontWeight: '800', color: 'red' }]}>{Number(valueMoneyElectric).toLocaleString('vi-VN')} đ</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 15 }}>
                                <Text style={[styles.table_data, { fontWeight: '800', color: 'red' }]}>{parseFloat(receiptInfo.thanhtiendien).toLocaleString('vi-VN')} đ</Text>
                            </View>
                        </View>

                        {/* Điện nhà tắm */}
                        <View style={styles.table_body_single_row}>
                            <View style={{ width: 20, marginLeft: 20 }}>
                                <Text style={styles.table_data}>2</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 30 }}>
                                <Text style={styles.table_data}>Điện nhà tắm</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 20 }}>
                                <Text
                                    style={[styles.table_data, { fontWeight: '800', color: 'red' }]}

                                >{receiptInfo.sodaukydiennhatam}</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 25 }}>
                                <Text
                                    style={[styles.table_data, { fontWeight: '800', color: 'red' }]}

                                >{receiptInfo.socuoikydiennhatam}</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 23 }}>
                                <Text style={[styles.table_data, { fontWeight: '800', color: 'red' }]}>{receiptInfo.congsuatdiennhatam}</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 20 }}>
                                <Text style={[styles.table_data, { fontWeight: '800', color: 'red' }]}>{Number(valueMoneyToiletElectric).toLocaleString('vi-VN')} đ</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 15 }}>
                                <Text style={[styles.table_data, { fontWeight: '800', color: 'red' }]}>{parseFloat(receiptInfo.thanhtiendiennhatam).toLocaleString('vi-VN')} đ</Text>
                            </View>
                        </View>

                        {/* Nước */}
                        <View style={styles.table_body_single_row}>
                            <View style={{ width: 20, marginLeft: 20 }}>
                                <Text style={styles.table_data}>3</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 30 }}>
                                <Text style={styles.table_data}>Nước</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 20 }}>
                                <Text style={styles.table_data}>Ø</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 25 }}>
                                <Text style={styles.table_data}>Ø</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 23, fontWeight: 200 }}>
                                <Text
                                    style={[styles.table_data, { fontWeight: '800', color: 'red' }]}

                                >{receiptInfo.congsuatnuoc}</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 20 }}>
                                <Text style={[styles.table_data, { fontWeight: '800', color: 'red' }]}>{Number(valueMoneyWater).toLocaleString('vi-VN')} đ</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 15 }}>
                                <Text style={[styles.table_data, { fontWeight: '800', color: 'red' }]}>{parseFloat(receiptInfo.thanhtiennuoc).toLocaleString('vi-VN')} đ</Text>
                            </View>
                        </View>

                        {/* Mạng */}
                        <View style={styles.table_body_single_row}>
                            <View style={{ width: 20, marginLeft: 20 }}>
                                <Text style={styles.table_data}>4</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 30 }}>
                                <Text style={styles.table_data}>Mạng</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 20 }}>
                                <Text style={styles.table_data}>Ø</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 25 }}>
                                <Text style={styles.table_data}>Ø</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 23 }}>
                                <Text
                                    style={[styles.table_data, { fontWeight: '800', color: 'red' }]}

                                >{receiptInfo.congsuatmang}</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 20 }}>
                                <Text style={[styles.table_data, { fontWeight: '800', color: 'red' }]}>{Number(valueMoneyInternet).toLocaleString('vi-VN')} đ</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 15 }}>
                                <Text style={[styles.table_data, { fontWeight: '800', color: 'red' }]}>{parseFloat(receiptInfo.thanhtienmang).toLocaleString('vi-VN')} đ</Text>
                            </View>
                        </View>

                        {/* Vệ sinh */}
                        <View style={styles.table_body_single_row}>
                            <View style={{ width: 20, marginLeft: 20 }}>
                                <Text style={styles.table_data}>5</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 30 }}>
                                <Text style={styles.table_data}>Vệ sinh</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 20 }}>
                                <Text style={styles.table_data}>Ø</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 25 }}>
                                <Text style={styles.table_data}>Ø</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 23 }}>
                                <Text
                                    style={[styles.table_data, { fontWeight: '800', color: 'red' }]}

                                >{receiptInfo.congsuatvesinh}</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 20 }}>
                                <Text style={[styles.table_data, { fontWeight: '800', color: 'red' }]}>{Number(valueMoneyHygiene).toLocaleString('vi-VN')} đ</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 15 }}>
                                <Text style={[styles.table_data, { fontWeight: '800', color: 'red' }]}>{parseFloat(receiptInfo.thanhtienvesinh).toLocaleString('vi-VN')} đ</Text>
                            </View>
                        </View>

                        {/* Xe điện */}
                        <View style={styles.table_body_single_row}>
                            <View style={{ width: 20, marginLeft: 20 }}>
                                <Text style={styles.table_data}>6</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 30 }}>
                                <Text style={styles.table_data}>Xe điện</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 20 }}>
                                <Text style={styles.table_data}>Ø</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 25 }}>
                                <Text style={styles.table_data}>Ø</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 23 }}>
                                <Text
                                    style={[styles.table_data, { fontWeight: '800', color: 'red' }]}

                                >{receiptInfo.congsuatxedien}</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 20 }}>
                                <Text style={[styles.table_data, { fontWeight: '800', color: 'red' }]}>{Number(valueMoneyBikeElectric).toLocaleString('vi-VN')} đ</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 15 }}>
                                <Text style={[styles.table_data, { fontWeight: '800', color: 'red' }]}>{parseFloat(receiptInfo.thanhtienxedien).toLocaleString('vi-VN')} đ</Text>
                            </View>
                        </View>
                        <View style={styles.table_body_single_row}>
                            <View style={{ width: '90%' }}>
                                <Text style={[styles.table_data, { fontSize: 22, fontWeight: 'bold'  }]}>Phí dịch vụ</Text>
                            </View>
                            <View style={{ width: 140 }}>
                                <Text style={[styles.table_data, { fontSize: 18, fontWeight: '800', color: 'red'}]}>{parseFloat(receiptInfo.tongphidichvu).toLocaleString('vi-VN')} đ</Text>
                            </View>

                        </View>
                        <View style={styles.table_body_single_row}>
                            <View style={{ width: '90%' }}>
                                <Text style={[styles.table_data, { fontSize: 22, fontWeight: 'bold' }]}>Tiền phòng</Text>
                            </View>
                            <View style={{ width: 140 }}>
                                <Text style={[styles.table_data, { fontSize: 18, fontWeight: '800', color: 'red' }]}>
                                    {parseFloat(receiptInfo.tienphong).toLocaleString('vi-VN')} đ
                                </Text>
                            </View>

                        </View>
                        <View style={styles.table_body_single_row}>
                            <View style={{ width: '90%' }}>
                                <Text style={[styles.table_data, { fontSize: 25, fontWeight: 'bold' }]}>Tổng Tiền</Text>
                            </View>
                            <View style={{ width: 140 }}>
                                <Text style={[styles.table_data, { fontSize: 20, fontWeight: 'bold',  color: 'red' }]}>{parseFloat(receiptInfo.tongtien).toLocaleString('vi-VN')} đ</Text>
                            </View>

                        </View>


                    </View>

                </View>

            </ScrollView>
        </ScrollView>
    );
};

export default DetailReceipts

const styles = StyleSheet.create({


    createReceiptButton: {
        backgroundColor: '#4CAF50', // Thay đổi màu sắc tại đây
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginVertical: 20,
        alignSelf: 'center',
        elevation: 3, // Hiệu ứng nổi bật khi nhấn
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    createReceiptText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    defaultOption: {
        color: 'red', // Đặt màu đỏ cho văn bản khi không có lựa chọn được chọn
        // Các thuộc tính khác của văn bản khi không có lựa chọn được chọn ở đây
    },

    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 1,
        marginLeft: 0, // Khoảng cách giữa text và input
        width: 50,
        height: 30, // Điều chỉnh chiều rộng cho phù hợp
        fontSize: 18,
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        maxWidth: 200, // Giới hạn chiều rộng của modalContent
        maxHeight: 1000, // Giới hạn chiều cao của modalContent
        justifyContent: 'center',
        elevation: 5, // Hiệu ứng nổi bật modal trên màn hình
    },
    modalContainer2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent2: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        maxWidth: 200, // Giới hạn chiều rộng của modalContent
        maxHeight: 200, // Giới hạn chiều cao của modalContent
        justifyContent: 'center',
        elevation: 5, // Hiệu ứng nổi bật modal trên màn hình
    },
    optionText: {
        fontSize: 18,
        padding: 10,
        fontWeight: '800'
    },

    wrapper: {
        justifyContent: 'center',
        alignItems: 'center',

        flex: 1,


    },
    table_head: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#ddd',
        paddingVertical: 20,
        paddingHorizontal: 10,
        backgroundColor: '#3bcd6b',
        width: 710,
        justifyContent: 'space-around', // Để căn giữa các tiêu đề
        alignItems: 'center', // Căn dữ liệu trong từng hàng ra giữa theo chiều dọc


    },
    table_head_captions: {
        fontSize: 17,
        color: 'white',
        fontWeight: '800'



    },
    table_body_single_row: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#ddd',
        paddingVertical: 10,
        paddingHorizontal: 0,
        justifyContent: 'space-around', // Để căn giữa dữ liệu trong từng hàng
        alignItems: 'center', // Căn dữ liệu trong từng hàng ra giữa theo chiều dọc
        width: 700,

    },


    table_data: {
        fontSize: 18,
        textAlign: 'center', // Center the text horizontally
        textAlignVertical: 'center',




    },
    table: {
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 1,
        backgroundColor: '#fff',
    },
    redText: {
        color: 'red',
    },

});

