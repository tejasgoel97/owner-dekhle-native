import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  TextInput,
} from 'react-native';
import {ListItem, Avatar} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import api from '../services/api';
import LoadingIndicator from '../components/LoadingIndicator';
import {THEME_COLOR} from '../assets/colors/colors';
import Icon from 'react-native-vector-icons/FontAwesome';

const MyAgentsScreen = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation();
  const token = useSelector(state => state.userInfo.token);

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      try {
        const response = await api.get('/agent/myAgents', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          setAgents(response.data.agents);
        } else {
          setError('Failed to fetch data');
        }
      } catch (err) {
        setError('An error occurred while fetching data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [token]);

  const formatDate = dateString => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const filteredAgents = agents.filter(agent =>
    agent.phoneNumber.includes(searchTerm),
  );

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const renderItem = ({item}) => (
    <ListItem
      onPress={() =>
        navigation.navigate('AgentDetailsScreen', {agentId: item._id})
      }
      containerStyle={{
        // backgroundColor: item.registrationPaid ? '#d4edda' : '#f8d7da',
        borderRadius: 10,
      }}
      bottomDivider>
      {item.registrationPaid ? (
        <Icon
          name="check-circle"
          size={30}
          color="green"
          style={{marginRight: 10}}
        />
      ) : (
        <Icon
          name="times-circle"
          size={30}
          color="red"
          style={{marginRight: 10}}
        />
      )}
      <ListItem.Content>
        <ListItem.Title>{item.name}</ListItem.Title>
        <ListItem.Subtitle>{item.phoneNumber}</ListItem.Subtitle>
        <Text>Date Joined: {formatDate(item.createdAt)}</Text>
      </ListItem.Content>
    </ListItem>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by phone number"
        value={searchTerm}
        onChangeText={setSearchTerm}
        keyboardType="phone-pad"
      />
      {filteredAgents.length === 0 ? (
        <View style={styles.centeredContainer}>
          <Text style={styles.noDataText}>No agents found.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredAgents}
          renderItem={renderItem}
          keyExtractor={item => item._id.toString()}
        />
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
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME_COLOR,
  },
  errorText: {
    color: 'white',
    fontSize: 16,
  },
  noDataText: {
    fontSize: 16,
  },
  searchBar: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});

export default MyAgentsScreen;
