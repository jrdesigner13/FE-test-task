import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function CurrencyDetails() {
  const params = useLocalSearchParams<{
    quoteCurrency: string;
    rate: string;
    ask: string;
    bid: string;
    diff24h: string;
  }>();

  const { quoteCurrency, rate, ask, bid, diff24h } = params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{quoteCurrency.toUpperCase()}</Text>
      <Text style={styles.detail}>Medium price: {parseFloat(rate).toFixed(3)}</Text>
      <Text style={styles.detail}>Ask price: {parseFloat(ask).toFixed(3)}</Text>
      <Text style={styles.detail}>Bid price: {parseFloat(bid).toFixed(3)}</Text>
      <Text style={[styles.detail, parseFloat(diff24h) >= 0 ? styles.positive : styles.negative]}>
        24h Change: {parseFloat(diff24h).toFixed(3)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detail: {
    fontSize: 18,
    marginBottom: 10,
  },
  positive: {
    color: 'green',
  },
  negative: {
    color: 'red',
  },
});