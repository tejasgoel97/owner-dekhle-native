import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ActivityIndicator, TextInput} from 'react-native';
import TempIdList from '../container/CreateQR/TempIdList';
import {useSelector} from 'react-redux';
import api from '../services/api';
import {THEME_COLOR} from '../assets/colors/colors';

const TempIDListScreen = () => {
  const [tempIds, setTempIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const token = useSelector(state => state.userInfo.token);

  useEffect(() => {
    const fetchTempIds = async () => {
      setLoading(true);
      try {
        const response = await api.get('/QR/get-my-temp-ids', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setTempIds(
            response.data.tempIDs.map(id => ({
              tempId: id.id,
              phoneNumber: id.phoneNumber,
              date: new Date(id.createdAt).toLocaleString(),
              status: id.status.toUpperCase(),
            })),
          );
        } else {
          console.log('Failed to fetch temp IDs');
        }
      } catch (error) {
        console.log('Error fetching temp IDs:', error);
      }
      setLoading(false);
    };

    fetchTempIds();
  }, [token]);

  const filteredTempIds = tempIds.filter(id =>
    id.phoneNumber.includes(searchQuery),
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by phone number..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          keyboardType="numeric"
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TempIdList data={filteredTempIds} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: THEME_COLOR,
  },
  searchContainer: {
    margin: 10,
    backgroundColor: 'white',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
  },
});

export default TempIDListScreen;
