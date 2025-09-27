import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import Register from './layouts/Register';
import Login from './layouts/Login';
import MainAdmin from './adminViews/mainAdmin';
import AddProduct from './adminViews/AddProduct';
import MainUser from './userView/mainUser';

const Stack = createNativeStackNavigator();

// Tipado de rutas
export type RootStackParamList = {
  Home: undefined;
  Register: undefined;
};

// Componente Home
function HomeScreen({ navigation }: any) {

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Image source={require("./assets/images (3).png")} />

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed
          ]}

          onPress={() => {navigation.navigate("login", {data: false})}}
        >
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("register")}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed
          ]}
        >
          <Text style={styles.buttonText}>Registrate</Text>
        </Pressable>

        <View style={styles.info_container}>
          <Text style={styles.infoText}>
            Aproximadamente el 31.5% de la población en Jalisco sufre Inseguridad Alimentaria, ayudanos a reducir este número donando.
          </Text>
        </View>
      </View>

      <Image
        source={require("./assets/Diseño sin título (72).png")}
        style={{ position: 'absolute', top: 40, right: 0, zIndex: 0 }}
      />
    </View>
  );
}


// App con Stack Navigator
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="register" component={Register} />
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="mainAdmin" component={MainAdmin} />
        <Stack.Screen name="addProduct" component={AddProduct} />
        <Stack.Screen name="mainUser" component={MainUser} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    gap: 20,
    zIndex: 1,
  },
  button: {
    textAlign: 'center',
    padding: 10,
    backgroundColor: "#FD8721",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  buttonPressed: {
    backgroundColor: "#E06B00",
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  info_container: {
    borderWidth: 1,
    borderColor: "#444",
    zIndex: 1,
    padding: 20,
    width: 150,
    height: 150,
    backgroundColor: "#FCBC15",
    borderRadius: 55,
    transform: [{ rotate: "45deg" }],
    alignSelf: 'center',
    justifyContent: 'center',
  },
  infoText: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
    transform: [{ rotate: '-45deg' }],
  }
});
