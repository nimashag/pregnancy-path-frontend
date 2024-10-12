import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

const BackButton = () => {
  const navigation = useNavigation();
  const router = useRouter()

  return (
    <TouchableOpacity
      onPress={() => router.push('/main/samplehome')}
      style={{ padding: 10, backgroundColor: 'transparent', borderRadius: 5 }}
    >
      <Icon name="arrow-left" size={20} color="#000" />
    </TouchableOpacity>
  );
};

export default BackButton;
