import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Estilos, { Cores } from "../styles/Estilos";

export default function Inicio({ irPara }) {
  return (
    <View style={Estilos.container}>
      <Ionicons name="volume-high" size={64} color={Cores.primaria} />

      <Text style={Estilos.tituloTela}>Medição de Som</Text>
      <Text style={Estilos.subtitulo}>
        Meça a intensidade do som pelo microfone do celular e veja onde a
        medição foi realizada.
      </Text>

      <TouchableOpacity
        style={[Estilos.botao, Estilos.botaoPrimario]}
        onPress={() => irPara("Som")}
      >
        <Ionicons name="volume-high" size={22} color={Cores.fundo} />
        <Text style={[Estilos.textoBotao, Estilos.textoBotaoPrimario]}>Som</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[Estilos.botao, Estilos.botaoSecundario]}
        onPress={() => irPara("Localizacao")}
      >
        <Ionicons name="location" size={22} color={Cores.texto} />
        <Text style={Estilos.textoBotao}>Localização</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[Estilos.botao, Estilos.botaoSecundario]}
        onPress={() => irPara("Historico")}
      >
        <Ionicons name="time" size={22} color={Cores.texto} />
        <Text style={Estilos.textoBotao}>Histórico</Text>
      </TouchableOpacity>
    </View>
  );
}