import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Keyboard,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@todo_app';

export default function App() {
  const [tarefas, setTarefas] = useState([]);
  const [texto, setTexto] = useState('');

  useEffect(() => {
    carregarTarefas();
  }, []);

  const carregarTarefas = async () => {
    try {
      const dados = await AsyncStorage.getItem(STORAGE_KEY);
      if (dados) {
        setTarefas(JSON.parse(dados));
      }
    } catch (error) {
      console.log('Erro ao carregar tarefas:', error);
    }
  };

  const salvarTarefas = async (lista) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    } catch (error) {
      console.log('Erro ao salvar tarefas:', error);
    }
  };

  const adicionarTarefa = () => {
    if (!texto.trim()) return;

    const novaTarefa = {
      id: Date.now().toString(),
      nome: texto.trim(),
      concluida: false,
    };

    const listaAtualizada = [novaTarefa, ...tarefas];
    setTarefas(listaAtualizada);
    salvarTarefas(listaAtualizada);
    setTexto('');
    Keyboard.dismiss();
  };

  const alternarTarefa = (id) => {
    const listaAtualizada = tarefas.map((item) =>
      item.id === id ? { ...item, concluida: !item.concluida } : item
    );

    setTarefas(listaAtualizada);
    salvarTarefas(listaAtualizada);
  };

  const removerTarefa = (id) => {
    const listaAtualizada = tarefas.filter((item) => item.id !== id);
    setTarefas(listaAtualizada);
    salvarTarefas(listaAtualizada);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Text style={styles.title}>Lista de Tarefas</Text>

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Digite uma tarefa"
          placeholderTextColor="#999"
          value={texto}
          onChangeText={setTexto}
        />

        <TouchableOpacity style={styles.button} onPress={adicionarTarefa}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      {tarefas.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Nenhuma tarefa</Text>
        </View>
      ) : (
        <FlatList
          data={tarefas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <TouchableOpacity onPress={() => alternarTarefa(item.id)}>
                <View
                  style={[
                    styles.checkbox,
                    item.concluida && styles.checkboxChecked,
                  ]}
                >
                  {item.concluida && <Text style={styles.checkText}>✓</Text>}
                </View>
              </TouchableOpacity>

              <Text
                style={[
                  styles.taskText,
                  item.concluida && styles.taskTextDone,
                ]}
              >
                {item.nome}
              </Text>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removerTarefa(item.id)}
              >
                <Text style={styles.deleteText}>X</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fb',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#222',
    marginBottom: 20,
  },
  inputArea: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d9dfe8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#222',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#3b82f6',
  },
  checkText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: '#222',
  },
  taskTextDone: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
  },
  deleteText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
});