import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Estilos, { Cores } from "../styles/Estilos";

const detalhesNivel = {
  Baixo: { cor: Cores.verde, icone: "pause-circle" },
  Médio: { cor: Cores.primaria, icone: "walk" },
  Alto: { cor: Cores.vermelho, icone: "flash" },
};

function formatarValor(valor, casas = 3) {
  return valor != null ? valor.toFixed(casas) : "—";
}

export default function Historico({ voltar, medicoes }) {
  return (
    <View style={Estilos.pagina}>
      <Text style={Estilos.tituloTela}>Histórico</Text>
      <Text style={Estilos.subtitulo}>Medições salvas</Text>

      {medicoes.length === 0 ? (
        <Text style={Estilos.textoVazio}>Nenhuma medição salva</Text>
      ) : (
        <ScrollView style={local.lista}>
          {medicoes.map((medicao, indice) => {
            const detalhe = detalhesNivel[medicao.nivel] || {
              cor: Cores.textoSuave,
              icone: "pause-circle",
            };

            return (
              <View key={indice} style={local.item}>
                <View style={local.itemLinha}>
                  <Ionicons name={detalhe.icone} size={24} color={detalhe.cor} />
                  <Text style={[local.itemNivel, { color: detalhe.cor }]}>
                    {medicao.nivel}
                  </Text>
                </View>

                <Text style={local.itemTexto}>
                  Intensidade:{" "}
                  {medicao.magnitude != null
                    ? `${formatarValor(medicao.magnitude)} g`
                    : "Não disponível"}
                </Text>

                <Text style={local.itemTexto}>
                  Eixos:{" "}
                  {medicao.x != null
                    ? `x ${formatarValor(medicao.x, 2)}, y ${formatarValor(
                        medicao.y,
                        2
                      )}, z ${formatarValor(medicao.z, 2)}`
                    : "Não disponível"}
                </Text>

                <Text style={local.itemData}>
                  {new Date(medicao.data).toLocaleString("pt-BR")}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      )}

      <TouchableOpacity style={Estilos.botaoVoltar} onPress={voltar}>
        <Text style={Estilos.textoVoltar}>← Voltar ao início</Text>
      </TouchableOpacity>
    </View>
  );
}

const local = StyleSheet.create({
  lista: {
    flex: 1,
    width: "100%",
  },
  item: {
    backgroundColor: Cores.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Cores.borda,
  },
  itemLinha: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  itemNivel: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 10,
  },
  itemTexto: {
    fontSize: 14,
    color: Cores.textoSuave,
    marginBottom: 6,
  },
  itemData: {
    fontSize: 13,
    color: Cores.textoSuave,
  },
});
