import { StyleSheet, Text, View, Image, Pressable, TextInput, Button, FlatList } from 'react-native';



export default function MainUser({navigation}: any ){
    return(
        <View style={styles.main}>
            <Text style={{textAlign: "center"}}>Interfaz de user</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        display: "flex",
        flex: 1,
        justifyContent: "center"
    }
})