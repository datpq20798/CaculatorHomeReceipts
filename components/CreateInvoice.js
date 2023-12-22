import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ScrollView, TextInput, FlatList, TouchableOpacity, Modal, ToastAndroid } from 'react-native';
import { firebase } from '../firebase.js';
import 'firebase/database';
import { useNavigation } from '@react-navigation/native';

// Import Firebase services that you need
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/database';

import { sendEmail } from '../components/sent-email.js';


const CreateInvoice = props => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [isChecked, setIsChecked] = useState(false); // State để lưu trạng thái của checkbox
    const [rentAmount, setRentAmount] = useState(''); // State để lưu trữ giá trị của Tiền nhà tháng
    const [dataSource, setDataSource] = useState([]);
    const [renterData, setRenterData] = useState([]);
    const dataSettings = firebase.firestore().collection('Settings')
    const renter = firebase.firestore().collection('Renter')
    const [showRoomModal, setShowRoomModal] = useState(false); // State để quản lý hiển thị modal chọn phòng
    const [showNumberOfPeopleInput, setShowNumberOfPeopleInput] = useState(false);
    const [tongSoNguoi, setTongSoNguoi] = useState(0);
    const [totalServiceFee, setTotalServiceFee] = useState(0);

    const [valueMoneyElectric, setValueMoneyElectric] = useState('');
    const [valueMoneyToiletElectric, setValueMoneyToiletElectric] = useState('');
    const [valueMoneyWater, setValueMoneyWater] = useState('');
    const [valueMoneyInternet, setValueMoneyInternet] = useState('');
    const [valueMoneyHygiene, setValueMoneyHygiene] = useState('');
    const [valueMoneyBikeElectric, setValueBikeElectric] = useState('');
    const [options, setOptions] = useState([]);
    const [optionToRenter, setOptionToRenter] = useState([]);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);

    const openConfirmModal = () => {
        setConfirmModalVisible(true);
    };

    const closeConfirmModal = () => {
        setConfirmModalVisible(false);
    };




    const navigation = useNavigation();


    const db = firebase.firestore();




  

    const getCurrentMonth = () => {
        const currentMonth = new Date().getMonth() + 1; // Lấy số tháng từ 0 -> 11, nên cần cộng 1
        return `tháng ${currentMonth}`;
    };

    const handleRoomSelection = () => {
        setShowRoomModal(true); // Hiển thị modal khi người dùng chọn phòng
    };

    const selectRoom = (room) => {
        setSelectedOption(room); // Cập nhật phòng được chọn
        setShowRoomModal(false); // Đóng modal sau khi chọn
    };

    const [showRentModal, setShowRentModal] = useState(false); // State to manage the visibility of the rent modal
    const [selectedRentAmount, setSelectedRentAmount] = useState(null); // State to store the selected rent amount

    const handleRentAmountSelection = amount => {
        setSelectedRentAmount(amount);
        setShowRentModal(false);
        setRentAmount(`Tiền nhà tháng: ${amount}`);
    };
    const [initialValues, setInitialValues] = useState({
        sodaukydien: '0',
        socuoikydien: '0',
        congsuatdien: '0',
        thanhtiendien: '0',
        congsuatdiennhatam: '0',
        sodaukydiennhatam: '0',
        socuoikydiennhatam: '0',
        thanhtiendiennhatam: '0',
        congsuatnuoc: '0',
        thanhtiennuoc: '0',
        congsuatmang: '0',
        thanhtienmang: '0',
        congsuatvesinh: '0',
        thanhtienvesinh: '0',
        congsuatxedien: '0',
        thanhtienxedien: '0',
        tongphidichvu: '0',
        tienphong: '0',
        tongtien: '0'
    });


    const handleInitialValueChange = (service, value) => {
        const newValues = { ...initialValues, [service]: value };

        // Logic tính toán cho các đọc điện
        if (service === 'socuoikydien' || service === 'sodaukydien') {
            const sodaukydien = parseFloat(newValues.sodaukydien);
            const socuoikydien = parseFloat(newValues.socuoikydien);

            if (!isNaN(sodaukydien) && !isNaN(socuoikydien)) {
                const congsuatdien = socuoikydien - sodaukydien;
                const thanhtiendien = congsuatdien * parseFloat(valueMoneyElectric);
                newValues.congsuatdien = congsuatdien.toString();
                newValues.thanhtiendien = thanhtiendien.toString();
            } else {
                newValues.congsuatdien = '0';
                newValues.thanhtiendien = '0';
            }
        }

        // Logic tính toán cho điện nhà tắm
        if (service === 'socuoikydiennhatam' || service === 'sodaukydiennhatam') {
            const sodaukydiennhatam = parseFloat(newValues.sodaukydiennhatam);
            const socuoikydiennhatam = parseFloat(newValues.socuoikydiennhatam);

            if (!isNaN(sodaukydiennhatam) && !isNaN(socuoikydiennhatam)) {
                const congsuatdiennhatam = socuoikydiennhatam - sodaukydiennhatam;
                newValues.congsuatdiennhatam = congsuatdiennhatam.toString();

                if (isChecked && tongSoNguoi > 0) {
                    const count = selectedOption ? optionToRenter.find(item => item.id === selectedOption.id)?.count : null;
                    const showNumberOfPeople = count !== null ? parseFloat(count) : 0;

                    const thanhtiendiennhatam = (congsuatdiennhatam * parseFloat(valueMoneyToiletElectric) * showNumberOfPeople) / tongSoNguoi;
                    newValues.thanhtiendiennhatam = thanhtiendiennhatam.toString();
                } else {
                    const thanhtiendiennhatam = congsuatdiennhatam * parseFloat(valueMoneyToiletElectric);
                    newValues.thanhtiendiennhatam = thanhtiendiennhatam.toString();
                }
            } else {
                newValues.congsuatdiennhatam = '0';
                newValues.thanhtiendiennhatam = '0';
            }
        }

        //Logic tính toán cho tiền nước
        if (service === 'congsuatnuoc') {
            const congsuatnuoc = parseFloat(value);

            if (!isNaN(congsuatnuoc)) {
                const thanhtiennuoc = congsuatnuoc * parseFloat(valueMoneyWater);
                newValues.thanhtiennuoc = thanhtiennuoc.toString();
            } else {
                newValues.thanhtiennuoc = '0';
            }
        }

        //Logic tính toán cho tiền mạng
        if (service === 'congsuatmang') {
            const congsuatmang = parseFloat(value);

            if (!isNaN(congsuatmang)) {
                const thanhtienmang = congsuatmang * parseFloat(valueMoneyInternet);
                newValues.thanhtienmang = thanhtienmang.toString();
            } else {
                newValues.thanhtienmang = '0';
            }
        }

        //Logic tính toán cho tiền vệ sinh
        if (service === 'congsuatvesinh') {
            const congsuatvesinh = parseFloat(value);

            if (!isNaN(congsuatvesinh)) {
                const thanhtienvesinh = congsuatvesinh * parseFloat(valueMoneyHygiene);
                newValues.thanhtienvesinh = thanhtienvesinh.toString();
            } else {
                newValues.thanhtienvesinh = '0';
            }
        }

        //Logic tính toán cho tiền xe điện
        if (service === 'congsuatxedien') {
            const congsuatxedien = parseFloat(value);

            if (!isNaN(congsuatxedien)) {
                const thanhtienxedien = congsuatxedien * parseFloat(valueMoneyBikeElectric);
                newValues.thanhtienxedien = thanhtienxedien.toString();
            } else {
                newValues.thanhtienxedien = '0';
            }
        }


        setInitialValues(newValues);
    };

    const calculateTotalAmount = () => {
        // Get the selected room rent price
        const selectedRoomPrice = selectedOption ? optionToRenter.find(item => item.id === selectedOption.id)?.price || 0 : 0;

        // Calculate total amount by adding room price and total service fees
        const totalAmount = parseFloat(selectedRoomPrice) + parseFloat(totalServiceFee);
        return totalAmount;
    };

    //useEffect tính tổng phí dịch vụ
    useEffect(() => {
        // Tính toán tổng thành tiền của các dịch vụ
        const electricFee = parseFloat(initialValues.thanhtiendien) || 0;
        const toiletElectricFee = parseFloat(initialValues.thanhtiendiennhatam) || 0;
        const waterFee = parseFloat(initialValues.thanhtiennuoc) || 0;
        const internetFee = parseFloat(initialValues.thanhtienmang) || 0;
        const hygieneFee = parseFloat(initialValues.thanhtienvesinh) || 0;
        const bikeElectricFee = parseFloat(initialValues.thanhtienxedien) || 0;

        // Tính tổng thành tiền của các dịch vụ
        const totalFee =
            electricFee +
            toiletElectricFee +
            waterFee +
            internetFee +
            hygieneFee +
            bikeElectricFee;

        // Cập nhật state totalServiceFee với giá trị tổng thành tiền
        setTotalServiceFee(totalFee);
    }, [initialValues]);


    useEffect(() => {
        handleInitialValueChange('socuoikydiennhatam', initialValues.socuoikydiennhatam, 'congsuatnuoc', initialValues.congsuatnuoc, 'congsuatmang', initialValues.congsuatmang, 'congsuatvesinh', initialValues.congsuatvesinh, 'congxuatxedien', initialValues.congsuatxedien);
    }, [isChecked, tongSoNguoi, showNumberOfPeopleInput, initialValues.sodaukydiennhatam, initialValues.socuoikydiennhatam, initialValues.congsuatnuoc, initialValues.congsuatmang, initialValues.congsuatvesinh, initialValues.congsuatxedien]);


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

    useEffect(() => {
        const fetchData = async () => {
            try {
                renter.onSnapshot(querySnapshot => {
                    const data = [];
                    const optionsFromFirebase = [];
                    const optionToRenterFromFirebase = [];

                    querySnapshot.forEach((doc) => {
                        const { room, name, price, id, count, email } = doc.data();

                        data.push({
                            id: doc.id,
                            id,
                            room,
                            name,
                            price,
                            count,
                            email
                        });

                        optionsFromFirebase.push({
                            id,
                            room,
                            label: ` ${room}`, // Định dạng label tùy thuộc vào dữ liệu
                        });
                        optionToRenterFromFirebase.push({
                            id,
                            name,
                            price,
                            count, email

                        });
                    });

                    setRenterData(data);
                    setOptions(optionsFromFirebase); // Cập nhật options từ Firebase renterData
                    setOptionToRenter(optionToRenterFromFirebase);

                });
            } catch (error) {
                console.error('Error fetching renter: ', error);
            }
        };

        fetchData();
    }, []);





    const handleTotalNumberOfPeopleChange = (text) => {
        // Xử lý và cập nhật giá trị cho tongSoNguoi
        setTongSoNguoi(parseFloat(text));
    };



    const handelSaveDataReceipts = async () => {

         const userEmail = selectedOption ? optionToRenter.find(item => item.id === selectedOption.id)?.email : '';
        const user = selectedOption ? optionToRenter.find(item => item.id === selectedOption.id)?.name : ''
        console.log('user:', user);
        try {
            await sendEmail(
                `${userEmail}`,

                `Phòng ${selectedOption ? selectedOption.label : ''} - Phiếu thu tiền nhà ${getCurrentMonth()}`,

                `Gửi Anh/Chị ${user},
                
        Dưới đây là thông tin tiền nhà ${getCurrentMonth()} của Anh/Chị
                 
                1. Điện:

                    - Số kỳ trước: ${initialValues.sodaukydien} số

                    - Số kỳ này: ${initialValues.socuoikydien} số

                    - Công xuất xử dụng: ${initialValues.congsuatdien} số

                    - Thành tiền: ${parseFloat(initialValues.thanhtiendien).toLocaleString('vi-VN')} vnđ

                2. Điện nhà tắm (Bình nóng lạnh):

                    - Số kỳ trước: ${initialValues.sodaukydiennhatam} số

                    - Số kỳ này: ${initialValues.socuoikydiennhatam} số

                    - Công xuất xử dụng: ${initialValues.congsuatdiennhatam} số

                    - Thành tiền: ${parseFloat(initialValues.thanhtiendiennhatam).toLocaleString('vi-VN')} vnđ

                3. Nước:

                    - Số người: ${initialValues.congsuatnuoc} người

                    - Thành tiền: ${parseFloat(initialValues.thanhtiennuoc).toLocaleString('vi-VN')} vnđ

                4. Mạng:

                    - Số người: ${initialValues.congsuatmang} người

                    - Thành tiền: ${parseFloat(initialValues.thanhtienmang).toLocaleString('vi-VN')} vnđ

                5. Vệ sinh:

                    - Số người: ${initialValues.congsuatvesinh} người

                    - Thành tiền: ${parseFloat(initialValues.thanhtienvesinh).toLocaleString('vi-VN')} vnđ

                6. Xe điện

                    - Số lượng xe: ${initialValues.congsuatxedien} xe

                    - Thành tiền: ${parseFloat(initialValues.thanhtienxedien).toLocaleString('vi-VN')} vnđ

            
        TỔNG PHÍ DỊCH VỤ: ${parseFloat(totalServiceFee).toLocaleString('vi-VN')} vnđ

        TIỀN PHÒNG: ${selectedOption ? (optionToRenter.find(item => item.id === selectedOption.id)?.price || 0).toLocaleString('vi-VN') + ' vnđ' : ''}

        TỔNG TIỀN: ${calculateTotalAmount().toLocaleString('vi-VN')} vnđ

        
        Chuyển khoản tới:

                Số tài khoản: 2007199869999

                Chủ tài khoản: Phạm Quốc Đạt

                Ngân hàng: MB Bank



        Xin cảm ơn!!
 
                 `,
                { cc: 'datpq20798@gmail.com' }

            );
            
            console.log('Your message was successfully sent!');

        } catch (error) {
            console.error('Error sending email:', error);
        }


        const receiptsRef = db.collection('Receipts');

        try {
            // Lưu dữ liệu lên Firebase
            const snapshot = await receiptsRef.get();
            const currentCount = snapshot.size;
            await receiptsRef.doc(`Phòng ${selectedOption ? selectedOption.label : ''} - ${getCurrentMonth()}`).set({
                key: currentCount + 1,
                month: getCurrentMonth(),
                room: selectedOption ? selectedOption.label : '',
                renter: selectedOption ? optionToRenter.find(item => item.id === selectedOption.id)?.name : '',
                count: selectedOption ? optionToRenter.find(item => item.id === selectedOption.id)?.count : '',
                isChecked: isChecked,
                countPeople: initialValues.socuoikydiennhatam,
                sodaukydien: initialValues.sodaukydien,
                socuoikydien: initialValues.socuoikydien,
                congxuatdien: initialValues.congsuatdien,
                thanhtiendien: initialValues.thanhtiendien,
                sodaukydiennhatam: initialValues.sodaukydiennhatam,
                socuoikydiennhatam: initialValues.socuoikydiennhatam,
                congsuatdiennhatam: initialValues.congsuatdiennhatam,
                thanhtiendiennhatam: initialValues.thanhtiendiennhatam,
                congsuatnuoc: initialValues.congsuatnuoc,
                thanhtiennuoc: initialValues.thanhtiennuoc,
                congsuatmang: initialValues.congsuatmang,
                thanhtienmang: initialValues.thanhtienmang,
                congsuatvesinh: initialValues.congsuatvesinh,
                thanhtienvesinh: initialValues.thanhtienvesinh,
                congsuatxedien: initialValues.congsuatxedien,
                thanhtienxedien: initialValues.thanhtienxedien,
                tongphidichvu: totalServiceFee,
                tienphong: selectedOption ? optionToRenter.find(item => item.id === selectedOption.id)?.price : '',
                tongtien: calculateTotalAmount()
                // Thêm các trường cần thiết khác vào đây theo yêu cầu của bạn
            });

            console.log('Dữ liệu được lưu trữ thành công trên Firebase!');
            console.log('Thông điệp của bạn đã được gửi thành công!');
          
            navigation.replace('Tạo Phiếu thu');
        } catch (error) {
            console.error('Lỗi khi gửi email hoặc lưu dữ liệu trên Firebase:', error);
        }
    }


   



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
                                {`Tiền nhà ${getCurrentMonth()}`}
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        {/* Phòng và Người thuê */}
                        <View style={[styles.optionContainer, { flex: 1 }]}>
                            <TouchableOpacity onPress={handleRoomSelection}>
                                <Text style={styles.optionText}>
                                    Phòng: {selectedOption ? selectedOption.label : <Text style={styles.defaultOption}>Chưa chọn</Text>}
                                </Text>
                            </TouchableOpacity>
                            <Modal
                                visible={showRoomModal}
                                animationType="slide"
                                transparent={true}
                                onRequestClose={() => setShowRoomModal(false)}
                            >
                                <View style={styles.modalContainer2}>
                                    <View style={styles.modalContent2}>
                                        <FlatList
                                            data={options}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity onPress={() => selectRoom(item)} style={{ padding: 10 }}>
                                                    <Text style={{ fontSize: 20 }}>{item.label}</Text>
                                                </TouchableOpacity>
                                            )}
                                            keyExtractor={item => item.id.toString()}
                                        />
                                    </View>
                                </View>
                            </Modal>
                            {/* Display selected option information */}
                            <View>
                                <Text style={styles.optionText}>
                                    Người thuê: {selectedOption ? optionToRenter.find(item => item.id === selectedOption.id)?.name : 'Chưa chọn'}
                                </Text>
                                {/* Other content related to Người thuê */}
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                <Text style={styles.optionText}>
                                    Số người:  {selectedOption ? optionToRenter.find(item => item.id === selectedOption.id)?.count : 'Chưa chọn'}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity
                                    onPress={() => setIsChecked(!isChecked)}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginBottom: 10,
                                    }}
                                >
                                    <Text style={{ fontSize: 18, marginLeft: 10, marginTop: 10, fontWeight: '800' }}>Chia tiền điện nhà tắm:</Text>
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
                                        {isChecked ? <Text>Có</Text> : <Text>X</Text>}
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {isChecked && (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.optionText}>Tổng số người dùng:</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(text) => {
                                            setTongSoNguoi(parseFloat(text));
                                            handleInitialValueChange('socuoikydiennhatam', initialValues.socuoikydiennhatam);
                                        }}
                                        keyboardType="numeric"
                                    />
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
                                <TextInput
                                    style={[styles.table_data, { fontWeight: '800', color: 'red' }]}
                                    value={initialValues.sodaukydien}
                                    onChangeText={(text) => handleInitialValueChange('sodaukydien', text)}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={{ width: 100, marginLeft: 25 }}>
                                <TextInput
                                    style={[styles.table_data, { fontWeight: '800', color: 'red' }]}
                                    value={initialValues.socuoikydien}
                                    onChangeText={(text) => handleInitialValueChange('socuoikydien', text)}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={{ width: 100, marginLeft: 23 }}>
                                <Text style={styles.table_data}>{initialValues.congsuatdien}</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 20 }}>
                                <Text style={styles.table_data}>{Number(valueMoneyElectric).toLocaleString('vi-VN')} đ</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 15 }}>
                                <Text style={styles.table_data}>{parseFloat(initialValues.thanhtiendien).toLocaleString('vi-VN')} đ</Text>
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
                                <TextInput
                                    style={[styles.table_data, { fontWeight: '800', color: 'red' }]}
                                    value={initialValues.sodaukydiennhatam}
                                    onChangeText={(text) => {
                                        handleInitialValueChange('sodaukydiennhatam', text);
                                    }}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={{ width: 100, marginLeft: 25 }}>
                                <TextInput
                                    style={[styles.table_data, { fontWeight: '800', color: 'red' }]}
                                    value={initialValues.socuoikydiennhatam}
                                    onChangeText={(text) => handleInitialValueChange('socuoikydiennhatam', text)}
                                    keyboardType="numeric"

                                />
                            </View>
                            <View style={{ width: 100, marginLeft: 23 }}>
                                <Text style={styles.table_data}>{initialValues.congsuatdiennhatam}</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 20 }}>
                                <Text style={styles.table_data}>{Number(valueMoneyToiletElectric).toLocaleString('vi-VN')} đ</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 15 }}>
                                <Text style={styles.table_data}>{parseFloat(initialValues.thanhtiendiennhatam).toLocaleString('vi-VN')} đ</Text>
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
                                <TextInput
                                    style={[styles.table_data, { fontWeight: '800', color: 'red' }]}
                                    value={initialValues.congsuatnuoc}
                                    onChangeText={(text) => handleInitialValueChange('congsuatnuoc', text)}
                                    keyboardType="numeric"

                                />
                            </View>
                            <View style={{ width: 100, marginLeft: 20 }}>
                                <Text style={styles.table_data}>{Number(valueMoneyWater).toLocaleString('vi-VN')} đ</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 15 }}>
                                <Text style={styles.table_data}>{parseFloat(initialValues.thanhtiennuoc).toLocaleString('vi-VN')} đ</Text>
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
                                <TextInput
                                    style={[styles.table_data, { fontWeight: '800', color: 'red' }]}
                                    value={initialValues.congsuatmang}
                                    onChangeText={(text) => handleInitialValueChange('congsuatmang', text)}
                                    keyboardType="numeric"

                                />
                            </View>
                            <View style={{ width: 100, marginLeft: 20 }}>
                                <Text style={styles.table_data}>{Number(valueMoneyInternet).toLocaleString('vi-VN')} đ</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 15 }}>
                                <Text style={styles.table_data}>{parseFloat(initialValues.thanhtienmang).toLocaleString('vi-VN')} đ</Text>
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
                                <TextInput
                                    style={[styles.table_data, { fontWeight: '800', color: 'red' }]}
                                    value={initialValues.congsuatvesinh}
                                    onChangeText={(text) => handleInitialValueChange('congsuatvesinh', text)}
                                    keyboardType="numeric"

                                />
                            </View>
                            <View style={{ width: 100, marginLeft: 20 }}>
                                <Text style={styles.table_data}>{Number(valueMoneyHygiene).toLocaleString('vi-VN')} đ</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 15 }}>
                                <Text style={styles.table_data}>{parseFloat(initialValues.thanhtienvesinh).toLocaleString('vi-VN')} đ</Text>
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
                                <TextInput
                                    style={[styles.table_data, { fontWeight: '800', color: 'red' }]}
                                    value={initialValues.congsuatxedien}
                                    onChangeText={(text) => handleInitialValueChange('congsuatxedien', text)}
                                    keyboardType="numeric"

                                />
                            </View>
                            <View style={{ width: 100, marginLeft: 20 }}>
                                <Text style={styles.table_data}>{Number(valueMoneyBikeElectric).toLocaleString('vi-VN')} đ</Text>
                            </View>
                            <View style={{ width: 100, marginLeft: 15 }}>
                                <Text style={styles.table_data}>{parseFloat(initialValues.thanhtienxedien).toLocaleString('vi-VN')} đ</Text>
                            </View>
                        </View>
                        <View style={styles.table_body_single_row}>
                            <View style={{ width: '90%' }}>
                                <Text style={[styles.table_data, { fontSize: 22, fontWeight: 'bold' }]}>Phí dịch vụ</Text>
                            </View>
                            <View style={{ width: 140 }}>
                                <Text style={[styles.table_data, { fontSize: 18, }]}>{parseFloat(totalServiceFee).toLocaleString('vi-VN')} đ</Text>
                            </View>

                        </View>
                        <View style={styles.table_body_single_row}>
                            <View style={{ width: '90%' }}>
                                <Text style={[styles.table_data, { fontSize: 22, fontWeight: 'bold' }]}>Tiền phòng</Text>
                            </View>
                            <View style={{ width: 140 }}>
                                <Text style={[styles.table_data, { fontSize: 18 }]}>
                                    {selectedOption ? (optionToRenter.find(item => item.id === selectedOption.id)?.price || 0).toLocaleString('vi-VN') + ' đ' : '0 đ'}
                                </Text>
                            </View>

                        </View>
                        <View style={styles.table_body_single_row}>
                            <View style={{ width: '90%' }}>
                                <Text style={[styles.table_data, { fontSize: 25, fontWeight: 'bold' }]}>Tổng Tiền</Text>
                            </View>
                            <View style={{ width: 140 }}>
                                <Text style={[styles.table_data, { fontSize: 20, fontWeight: 'bold' }]}>{calculateTotalAmount().toLocaleString('vi-VN')} đ</Text>
                            </View>

                        </View>


                    </View>
                    <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={openConfirmModal} style={[styles.createReceiptButton, styles.firstButton]}>
                <Text style={styles.createReceiptText}>Tạo Phiếu và Gửi Email</Text>
            </TouchableOpacity>
           
        </View>
                    <Modal
                        visible={confirmModalVisible}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={closeConfirmModal}
                        
                    >
                        <View style={styles.modalContainer3}>
                            <View style={styles.modalContent3}>
                                <Text style={styles.confirm3}>Bạn có muốn tạo Phiếu và gửi Email không?</Text>
                                <View style={styles.buttonContainer3}>
                                    <TouchableOpacity onPress={handelSaveDataReceipts} style={styles.confirmButton3}>
                                        <Text style={styles.confirmButtonText3}>Xác nhận</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={closeConfirmModal} style={styles.cancelButton3}>
                                        <Text style={styles.cancelButtonText3}>Hủy</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>

                

                </View>

            </ScrollView>
        </ScrollView>
    );
};

export default CreateInvoice;

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    createReceiptButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    firstButton: {
        backgroundColor: '#CC66FF', // Màu sắc cho nút 1
        marginRight: 10, // Khoảng cách giữa các nút
    },
    secondButton: {
        backgroundColor: '#CC9933', // Màu sắc cho nút 2
        marginLeft: 10, // Khoảng cách giữa các nút
    },
    sendEmail:{
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalContainer3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
         // Màu nền có độ trong suốt
    },
    modalContent3: {
        backgroundColor: 'white',
        padding: 40,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 5, // Độ nổi của modal
        maxWidth: 350, // Giới hạn chiều rộng của modalContent
        maxHeight: 300, // Giới hạn chiều cao của modalContent
        
        

    },
    confirm3:{
        marginBottom: 20,
        fontSize: 20,
        textAlign: 'center',
    },
    buttonContainer3: {
        flexDirection: 'row', // Hiển thị các nút theo hàng ngang
        justifyContent: 'space-between', // Các nút ngang nhau và căn ra hai bên
        width: '100%', // Đảm bảo rằng nút nằm ngang toàn bộ modal
    },
    confirmButton3: {
        flex: 1, // Cân chỉnh nút để chiếm 50% chiều rộng
        margin: 5, // Khoảng cách giữa các nút
        padding: 10,
        backgroundColor: 'blue',
        borderRadius: 5,
    },
    confirmButtonText3: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center', // Canh chỉnh chữ giữa nút
    },
    cancelButton3: {
        flex: 1, // Cân chỉnh nút để chiếm 50% chiều rộng
        margin: 5, // Khoảng cách giữa các nút
        padding: 10,
        backgroundColor: 'red',
        borderRadius: 5,
        
    },
    cancelButtonText3: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20, // Canh chỉnh chữ giữa nút
    },
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

});