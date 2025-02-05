import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Text } from "@chakra-ui/react";
import { formatEther } from "viem";

export const EthToUsdConverter = ({ ethValue }: { ethValue: bigint }) => {
  const [usdPrice, setUsdPrice] = useState<number>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        setLoading(true);
        setError(undefined);
        const response = await axios.get(
          "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
        );
        const ethToUsd = response.data.USD;
        setUsdPrice(parseFloat(formatEther(ethValue)) * ethToUsd);
      } catch (err) {
        setError("Failed to fetch Ethereum price.");
      } finally {
        setLoading(false);
      }
    };

    fetchEthPrice();
  }, [ethValue]);

  if (loading) {
    return <Text>Load...</Text>;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  return (
    <Box>
      <Text>${usdPrice?.toFixed(2)}</Text>
    </Box>
  );
};
