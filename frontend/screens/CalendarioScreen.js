import React, { useState, useCallback } from "react";
import {
  View,
  Modal,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ActivityIndicator
} from "react-native";

import { Calendar } from "react-native-calendars";
import { useFocusEffect } from "@react-navigation/native";

export default function CalendarioScreen({ navigation }) {
  const [reservas, setReservas] = useState([]);
  const [marked, setMarked] = useState({});
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const normalizarData = (data) => {
    if (!data) return null;
    return data.split("T")[0]; // garante compatibilidade MySQL
  };

  const carregarReservas = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:3000/reservas/all");

      // 🔥 evita erro HTML virar crash
      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.log("RESPOSTA NÃO É JSON:", text);
        return;
      }

      setReservas(data);

      const mark = {};

      data.forEach((r) => {
        const dia = normalizarData(r.reservaData);

        if (!dia) return;

        mark[dia] = {
          marked: true,
          dotColor: "#00A884"
        };
      });

      setMarked(mark);
    } catch (err) {
      console.log("ERRO CALENDÁRIO:", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarReservas();
    }, [])
  );

  const abrirDia = (day) => {
    const eventos = reservas.filter((r) => {
      const dia = normalizarData(r.reservaData);
      return dia === day.dateString;
    });

    setSelected(eventos.length ? eventos : []);
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Image
            source={require("../assets/seta.png")}
            style={styles.backIcon}
          />
        </Pressable>

        <Text style={styles.logo}>SISLAB</Text>

        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>

        <Text style={styles.title}>
          Calendário de Reservas
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#007A33" />
        ) : (
          <Calendar
            markedDates={marked}
            onDayPress={abrirDia}
            theme={{
              selectedDayBackgroundColor: "#007A33",
              todayTextColor: "#00A884",
              arrowColor: "#007A33"
            }}
          />
        )}

      </View>

      <Modal visible={selected !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>

          <View style={styles.modalBox}>

            <Text style={styles.modalTitle}>
              Reservas do dia
            </Text>

            {selected?.length > 0 ? (
              selected.map((r) => (
                <View key={r.idReserva} style={styles.item}>

                  <Text style={styles.nome}>
                    {r.responsavelNome}
                  </Text>

                  <Text>
                    {r.horaRetirada} - {r.horaDevolucao}
                  </Text>

                  <Text>
                    {r.statusReserva}
                  </Text>

                </View>
              ))
            ) : (
              <Text style={{ marginTop: 10 }}>
                Nenhuma reserva nesse dia
              </Text>
            )}

            <Pressable onPress={() => setSelected(null)}>
              <Text style={styles.close}>
                Fechar
              </Text>
            </Pressable>

          </View>

        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#ccfce4"
  },

  header: {
    height: 75,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30
  },

  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007A33"
  },

  backIcon: {
    width: 28,
    height: 28,
    resizeMode: "contain"
  },

  content: {
    flex: 1,
    padding: 20
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007A33",
    marginBottom: 15
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    padding: 20
  },

  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold"
  },

  item: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f4f4f4",
    borderRadius: 8
  },

  nome: {
    fontWeight: "bold"
  },

  close: {
    marginTop: 20,
    color: "#007A33",
    fontWeight: "bold"
  }
});