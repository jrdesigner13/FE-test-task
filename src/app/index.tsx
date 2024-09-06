import React, { useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Button, SafeAreaView } from "react-native"
import { Link } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { cryptoStore, TransformedData } from './store/CryptoStore';

const safelyFormatNumber = (value: any, decimals: number = 3): string => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return 'N/A';
  }
  const numValue = Number(value);
  return numValue.toFixed(decimals);
};

type SortOrder = 'asc' | 'desc' | 'none';

const CryptoRatesList = observer(() => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('none');

  useEffect(() => {
    cryptoStore.fetchCryptoRates();
  }, []);

  const handleSearchChange = (text: string) => {
    setSearchTerm(text.toUpperCase());
  };

  const toggleSortOrder = () => {
    setSortOrder(current => {
      if (current === 'none') return 'asc';
      if (current === 'asc') return 'desc';
      return 'none';
    });
  };

  const sortedAndFilteredData = useMemo(() => {
    return cryptoStore.transformedData
      .map(item => ({
        ...item,
        pairs: item.pairs
          .filter(([quoteCurrency]) => 
            quoteCurrency.toUpperCase().includes(searchTerm)
          )
          .sort(([a], [b]) => {
            if (sortOrder === 'none') return 0;
            return sortOrder === 'asc' 
              ? a.localeCompare(b) 
              : b.localeCompare(a);
          })
      }))
      .filter(item => item.pairs.length > 0);
  }, [cryptoStore.transformedData, searchTerm, sortOrder]);

  const renderItem = ({ item }: { item: TransformedData }) => {
    return (
      <View style={styles.baseItem}>
        {item.pairs.map(([quoteCurrency, data]) => (
          <Link
            key={quoteCurrency}
            href={{
              pathname: "./[baseCurrency]",
              params: {
                quoteCurrency,
                rate: safelyFormatNumber(data.rate),
                ask: safelyFormatNumber(data.ask),
                bid: safelyFormatNumber(data.bid),
                diff24h: safelyFormatNumber(data.diff24h)
              }
            }}
            asChild
          >
            <TouchableOpacity style={styles.quoteItem}>
              <Text style={styles.quoteCurrency}>{quoteCurrency.toUpperCase()}</Text>
              <Text>Bid price: {safelyFormatNumber(data.bid)}</Text>
              <Text style={data.diff24h != null ? (data.diff24h >= 0 ? styles.positive : styles.negative) : styles.neutral}>
                24h Change: {safelyFormatNumber(data.diff24h)}
              </Text>
            </TouchableOpacity>
          </Link>
        ))}
      </View>
    );
  };

  if (cryptoStore.loading) {
    return <Text>Loading...</Text>;
  }

  if (cryptoStore.error) {
    return <Text style={styles.error}>{cryptoStore.error}</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchSortContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search quote currency..."
          value={searchTerm}
          onChangeText={handleSearchChange}
          autoCapitalize="characters"
          />
        <Button
          title={`${sortOrder === 'none' ? 'None' : sortOrder === 'asc' ? 'Asc' : 'Desc'}`}
          onPress={toggleSortOrder}
          />
      </View>
    <FlatList
      data={sortedAndFilteredData}
      renderItem={renderItem}
      keyExtractor={(item) => item.baseCurrency}
    />
    </SafeAreaView>
  );
});

export default CryptoRatesList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchSortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  baseItem: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  baseCurrency: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  quoteItem: {
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  quoteCurrency: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  positive: {
    color: 'green',
  },
  neutral: {
    color: 'gray',
  },
  negative: {
    color: 'red',
  },
  error: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});