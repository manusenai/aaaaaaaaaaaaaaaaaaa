import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router'; 

const TelaLogin = () => {
  const [email, setEmail] = useState('professorSesiCe110');
  const [senha, setSenha] = useState('TurminhaDoSenai110');
  const [loading, setLoading] = useState(false); 
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://192.168.1.56:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();
      setLoading(false); 

      if (response.status === 200) {
        Alert.alert('Sucesso', data.message);
        router.push('/professorweb');
      } else {
        Alert.alert('Erro', data.message);
      }
    } catch (error) {
      setLoading(false); 
      Alert.alert('Erro', 'Ocorreu um erro ao fazer login');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.leftSide}>
          <View style={styles.innerCard}>
            <Image 
              source={{ uri: '../assets/logoslaoq.png' }} 
              style={styles.image}
            />
          </View>
        </View>
        <View style={styles.rightSide}>
          <Text style={styles.title}>A Redação</Text>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            placeholder="Inserir email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email} 
            onChangeText={setEmail} 
          />
          <Text style={styles.label}>Senha:</Text>
          <TextInput
            style={styles.input}
            placeholder="Inserir senha"
            secureTextEntry
            value={senha} 
            onChangeText={setSenha} 
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Fazer Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    width: '60%',
    height: 500,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
  },
  leftSide: {
    flex: 1,
    backgroundColor: '#ffa500',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightSide: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40, 
  },
  innerCard: {
    width: 150,
    height: 150,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  image: {
    width: 160, 
    height: 160,
    marginLeft:6,
    marginTop:10,
  },
  title: {
    fontSize: 35,
    color: '#ffa500',
    marginBottom: 40,
    marginTop:10,
    fontWeight: 'bold',

  },
  label: {
    fontSize: 19,
    marginBottom: 5,
    marginTop: 5,
    alignSelf: 'flex-start', 
    paddingLeft: '5%', 
    color: '#ffa500',
    
  },
  input: {
    width: '90%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20, 
  },
  button: {
    backgroundColor: '#ffa500',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 40, 
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default TelaLogin;
