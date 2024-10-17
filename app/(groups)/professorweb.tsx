import React, { useState, useEffect } from 'react';
import { Alert, KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity, Text, StyleSheet, View, Image, Modal, Pressable } from 'react-native';
import axios from 'axios';
import styled from 'styled-components/native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 


const API_URL = 'http://192.168.1.56:3000';

interface Redacao {
    id: string;
    titulo: string;
    corpo_redacao: string;
    imagem: string;
}

export default function ModelosRedacao() {
    const [modelos, setModelos] = useState<Redacao[]>([]);
    const [titulo, setTitulo] = useState('');
    const [corpoRedacao, setCorpoRedacao] = useState('');
    const [imagem, setImagem] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchModelos();
    }, []);

    const fetchModelos = async () => {
        try {
            const response = await axios.get(`${API_URL}/modelos`);
            setModelos(response.data.reverse());
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar os modelos.');
            console.error('Erro ao carregar modelos:', error);
        }
    };

    const criarModelo = async () => {
        if (!titulo || !corpoRedacao || !imagem) {
            Alert.alert('Erro', 'Preencha todos os campos.');
            return;
        }

        try {
            await axios.post(`${API_URL}/novomodelo`, { titulo, corpo_redacao: corpoRedacao, imagem });
            resetForm();
            fetchModelos();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível criar o modelo.');
            console.error('Erro ao criar modelo:', error);
        }
    };

    const editarModelo = async () => {
        if (!editingId) return;

        try {
            await axios.put(`${API_URL}/editar/${editingId}`, { titulo, corpo_redacao: corpoRedacao, imagem });
            resetForm();
            fetchModelos();
            setModalVisible(false);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível atualizar o modelo.');
            console.error('Erro ao editar modelo:', error);
        }
    };

    const deletarModelo = async (id: string) => {
        try {
            await axios.delete(`${API_URL}/deletar/${id}`);
            fetchModelos();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível deletar o modelo.');
            console.error('Erro ao deletar modelo:', error);
        }
    };

    const resetForm = () => {
        setTitulo('');
        setCorpoRedacao('');
        setImagem('');
        setIsEditing(false);
        setEditingId(null);
    };

    const openEditModal = (modelo: Redacao) => {
        setTitulo(modelo.titulo);
        setCorpoRedacao(modelo.corpo_redacao);
        setImagem(modelo.imagem);
        setEditingId(modelo.id);
        setIsEditing(true);
        setModalVisible(true);
    };


    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <ContainerBody>
            <LeftContainer>
                <HeaderContainer>

                <View style={{ 
                  height: 250, 
                  marginBottom: 10, 
                  justifyContent: 'center', 
                  alignItems: 'center' }}>

                  {imagem ? (
                  <Imagem source={{ uri: imagem }} style={{ width: '100%', height: '100%', borderRadius: 8 }} />) : (
                  <Text style={{ color: '#ccc', textAlign: 'center' }}>Nenhuma imagem foi adicionada</Text>)}
                </View>

                      <TextInput
                        placeholder="URL da Imagem"
                        value={imagem}
                        onChangeText={setImagem}
                        style={styles.input}
                      />
                    <TextInput
                        placeholder="Título"
                        value={titulo}
                        onChangeText={setTitulo}
                        style={styles.input}
                    />
                    
                    
                    <TextInput
                        placeholder="Texto"
                        value={corpoRedacao}
                        onChangeText={setCorpoRedacao}
                        style={[styles.input, { height: 300 }]}
                        multiline
                    />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={criarModelo}
                    >
                        <Text style={{ color: '#fff' }}>ADICIONAR MODELO</Text>
                    </TouchableOpacity>
                </HeaderContainer>
            </LeftContainer>



                <RightContainer>
                    <Title>REDAÇÕES SALVAS</Title>
                    <ScrollView>
                        {modelos.map(modelo => (
                            <Card key={modelo.id}>
                                <ContentContainer>
                                    <Imagem source={{ uri: modelo.imagem }} />
                                    <TextContainer>
                                        <CardTitle>{modelo.titulo}</CardTitle>
                                        <ModeloTexto numberOfLines={2}>{modelo.corpo_redacao}</ModeloTexto>
                                    </TextContainer>
                                </ContentContainer>
                                <ButtonContainer>
                                    <RemoveButton onPress={() => deletarModelo(modelo.id)}>
                                        <MaterialIcons name="delete" size={24} color="#ffa500" />
                                    </RemoveButton>
                                    <EditButton onPress={() => openEditModal(modelo)}>
                                      <FontAwesome name="pencil" size={24} color="#ffa500" />
                                    </EditButton>
                                </ButtonContainer>
                            </Card>
                        ))}
                    </ScrollView>
                </RightContainer>
            </ContainerBody>

           
            <Modal
    animationType="fade" 
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => setModalVisible(false)}
>
    <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>EDITAR REDAÇÃO</Text>
            <TextInput
                placeholder="Título"
                value={titulo}
                onChangeText={setTitulo}
                style={styles.input}
            />
            <TextInput
                placeholder="URL da Imagem"
                value={imagem}
                onChangeText={setImagem}
                style={styles.input}
            />
            
                <TextInput
                    placeholder="Texto"
                    value={corpoRedacao}
                    onChangeText={setCorpoRedacao}
                    style={[styles.input, { height: 310 }]} 
                    multiline
                />
            
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={editarModelo}
                >
                    <Text style={{ color: '#fff' }}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={[styles.button, { backgroundColor: 'white', marginTop: 8 }]}
                >
                    <Text style={{ color: '#ffa500' }}>Cancelar</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
</Modal>
        </KeyboardAvoidingView>
    );
}

const ContainerBody = styled.View`
    flex: 1;
    flex-direction: row;
    background-color: #F5F5F5;
    padding: 20px;
`;

const LeftContainer = styled.View`
    flex: 1;
    margin-right: 80px;
    
`;

const RightContainer = styled.View`
    flex: 1;
    padding-left: 10px;
`;

const Title = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: #ffa500;
    text-align: center;
    margin-bottom: 20px;
`;

const HeaderContainer = styled.View`
    margin-bottom: 20px;
`;

const Card = styled.View`
    background-color: #fff;
    border-radius: 10px;
    padding: 16px;
    margin-top: 20px;
    margin-bottom: 10px;
    width: 95%;
    shadow-color: #000;
    shadow-opacity: 0.2;
    shadow-radius: 3px;
    shadow-offset: 0px 2px;
    elevation: 5;
    min-height: 150px;  
    margin-left: 9.5px;
    flex-direction: row; 
    justify-content: space-between; 
    align-items: center; 
`;

const ContentContainer = styled.View`
    flex: 1; 
    flex-direction: column; 
`;

const Imagem = styled.Image`
    width: 100%; 
    height: 150px;
    border-radius: 8px;
`;

const TextContainer = styled.View`
    margin-top: 10px; 
`;

const CardTitle = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: #ffa500;
    margin-bottom: 10px;
`;

const ModeloTexto = styled.Text`
    font-size: 16px;
    color: #333;
    min-height: 48px;
`;

const ButtonContainer = styled.View`
    flex-direction: column; 
    align-items: flex-end; 
`;

const RemoveButton = styled(Pressable)`
    margin-bottom: 10px;
    margin-left:10px;
`;

const EditButton = styled(Pressable)`
  margin-top:55px;
`;


const styles = StyleSheet.create({
  input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
  },
  button: {
      backgroundColor: '#ffa500',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
  },
  modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
      width: '70%',
      height: '80%',
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
  },
  modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#ffa500',
      textAlign: 'center',
      marginBottom: 20,
  },
  scrollViewContent: {
      flexGrow: 1,
      justifyContent: 'space-between',
  },
  buttonContainer: {
      marginTop: 10,
  },
});

export const VisualizacaoWeb = () => {};

