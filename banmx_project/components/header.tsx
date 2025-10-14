// Header.tsx
import { StyleSheet, Text, View, Pressable } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function Header({ onMenuPress }: { onMenuPress: () => void }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>Banco de alimentos</Text>
      <Pressable onPress={onMenuPress}>
        <FontAwesome5 name="bars" size={24} color="black" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});
