import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Estilos, { Cores } from "../styles/Estilos";

export default function Inicio({ irPara }) {
  return (
    <View style={Estilos.container}>
      <Ionicons name="move" size={64} color={Cores.primaria} />

      <Text style={Estilos.tituloTela}>Sensores de Movimento</Text>
      <Text style={Estilos.subtitulo}>
        Meça a intensidade do movimento pelo acelerômetro e veja o campo
        magnético ao redor com o magnetômetro.
      </Text>

      <TouchableOpacity
        style={[Estilos.botao, Estilos.botaoPrimario]}
        onPress={() => irPara("Som")}
      >
        <Ionicons name="move" size={22} color={Cores.fundo} />
        <Text style={[Estilos.textoBotao, Estilos.textoBotaoPrimario]}>Movimento</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[Estilos.botao, Estilos.botaoSecundario]}
        onPress={() => irPara("Localizacao")}
      >
        <Ionicons name="compass" size={22} color={Cores.texto} />
        <Text style={Estilos.textoBotao}>Magnetômetro</Text>
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
