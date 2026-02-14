import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { horizontalScale, verticalScale, normalize } from './ResponsiveUtils';

interface SignOutScreenProps {
  onSignOut: () => void;
}

const SignOutScreen: React.FC<SignOutScreenProps> = ({ onSignOut }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Title */}
        <Text style={styles.title}>Cambridge Little Kids</Text>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.button} onPress={onSignOut}>
          <Text style={styles.buttonText}>Sign-out</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    // The thick yellow border from your image
    borderWidth: horizontalScale(15), 
    borderColor: '#FBBF24', 
  },
  title: {
    fontSize: normalize(22),
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: verticalScale(60),
    textAlign: 'center',
    position: 'absolute',
    top: verticalScale(200), // Positioned similarly to the image
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(60),
    borderRadius: 50,
    elevation: 5,
    // Optional: Add shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
});

export default SignOutScreen;
