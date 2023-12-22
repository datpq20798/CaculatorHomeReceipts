import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Modal, ToastAndroid } from 'react-native';
import { Table, Row } from "react-native-table-component";
import { firebase } from "../firebase.js";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';


export const MngInvoice = () => {
  const [dataSource, setDataSource] = useState([]);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [originalData, setOriginalData] = useState([]);
  const navigation = useNavigation();
  const [selectedReceiptId, setSelectedReceiptId] = useState(null);

  const openConfirmModal = (id) => {
    setConfirmModalVisible(true);
    setSelectedReceiptId(id); // Lưu ID của phiếu thu cần xóa vào state
  };

  const closeConfirmModal = () => {
    setConfirmModalVisible(false);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text === '') {
      // Reset to original data when the search query is empty
      setDataSource(originalData);
    } else {
      const filteredData = originalData.filter((item) =>
        item.id.toLowerCase().includes(text.toLowerCase())
      );
      setDataSource(filteredData);
    }
  };
  



  const renderDeleteIcon = (id) => (
    <TouchableOpacity onPress={() => openConfirmModal(id)} style={styles.deleteIconContainer}>
      <View style={styles.deleteIcon}>
        <Icon name="trash-o" size={25} color="red" />
      </View>
      {/* Added an empty Text element for maintaining the position */}
      <Text style={{}}></Text>
    </TouchableOpacity>
  );

  const handleDelete = () => {
    const idToDelete = selectedReceiptId; // Lấy ID của phiếu thu cần xóa từ state
    if (idToDelete) {
      firebase
        .firestore()
        .collection('Receipts')
        .doc(idToDelete)
        .delete()
        .then(() => {
          console.log('Document successfully deleted!');
        
          closeConfirmModal();
        })
        .catch((error) => {
          console.error('Error removing document: ', error);
        });
    }
  };


  const state = {
    tableHead: ["STT", "Phiếu thu", "Tác vụ"],
    widthArr: [40, 285, 50],
  };

  const dataReceipts = firebase.firestore().collection('Receipts');

  const rowStyle = (index) => {
    return index % 2 === 0
      ? { ...styles.row, backgroundColor: "#ffffff" }
      : styles.row;
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        dataReceipts.onSnapshot(querySnapshot => {
          const data = [];
          querySnapshot.forEach((doc) => {
            const { congsuatdiennhatam, congsuatmang, congsuatnuoc, congsuatvesinh, congsuatxedien, congxuatdien, count, countPeople, isChecked, key, month, renter, room, socuoikydien, socuoikydiennhatam, sodaukydien, sodaukydiennhatam, thanhtiendien, thanhtiendiennhatam, thanhtienmang, thanhtiennuoc, thanhtienvesinh, thanhtienxedien, tienphong, tongphidichvu, tongtien } = doc.data()
            data.push({
              id: doc.id,
              congsuatdiennhatam, congsuatmang, congsuatnuoc, congsuatvesinh, congsuatxedien, congxuatdien, count, countPeople, isChecked, key, month, renter, room, socuoikydien, socuoikydiennhatam, sodaukydien, sodaukydiennhatam, thanhtiendien, thanhtiendiennhatam, thanhtienmang, thanhtiennuoc, thanhtienvesinh, thanhtienxedien, tienphong, tongphidichvu, tongtien
            })
          });
          setDataSource(data);
          setOriginalData(data)
        });
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tìm kiếm..."
          onChangeText={(text) => handleSearch(text)}
          value={searchQuery}
        />
      </View>
      <View style={styles.body}>
        <View style={styles.containerTable}>
          <ScrollView horizontal={true}>
            <View>
              <Table borderStyle={{ borderColor: "#C1C0B9" }}>
                <Row
                  data={state.tableHead}
                  widthArr={state.widthArr}
                  style={styles.tableHead}
                  textStyle={styles.tableText}
                />
              </Table>
              <ScrollView style={styles.dataWrapper}>
                <Table borderStyle={{ borderColor: "#C1C0B9" }}>
                  {dataSource.map((dataRow, index) => (
                    <Row
                      key={index}
                      data={[
                        index + 1, // STT
                        (
                          <TouchableOpacity onPress={() => navigation.navigate('Chi tiết Phiếu thu', { receiptId: dataRow.id, receiptInfo: dataRow })}>
                            <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 17, color: '#4EB09B' }}>{dataRow.id}</Text>
                          </TouchableOpacity>
                        ), ,
                        // Hiển thị ID trong cột Phiếu thu
                        renderDeleteIcon(dataRow.id), // Dành cho cột Tác vụ (icon xóa sẽ hiển thị ở đây)
                      ]}
                      widthArr={[40, 285, 50]} // Cập nhật chiều rộng cột
                      style={rowStyle(index)}
                      textStyle={styles.tableText}
                    />
                  ))}
                </Table>
              </ScrollView>
            </View>
            <Modal
              visible={confirmModalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={closeConfirmModal}

            >
              <View style={styles.modalContainer3}>
                <View style={styles.modalContent3}>
                  <Text style={styles.confirm3}>Bạn có muốn xóa Phiếu thu này không?</Text>
                  <View style={styles.buttonContainer3}>
                    <TouchableOpacity onPress={handleDelete} style={styles.confirmButton3}>
                      <Text style={styles.confirmButtonText3}>Xác nhận</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={closeConfirmModal} style={styles.cancelButton3}>
                      <Text style={styles.cancelButtonText3}>Hủy</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  deleteIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteIcon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  containerTable: { flex: 1, padding: 15, paddingTop: 10, backgroundColor: "#F0FFFF" },
  tableHead: { height: 50, backgroundColor: "#f1f8ff", },
  tableText: { textAlign: "center", fontWeight: "bold", fontSize: 17 },
  dataWrapper: { marginTop: -1 },
  row: { height: 50 },
  container: {
    flex: 1,
    backgroundColor: '#F0FFFF',
  },
  searchContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  confirm3: {
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
});

export default MngInvoice;
