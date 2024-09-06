import { Stack } from 'expo-router';

import { observer } from 'mobx-react-lite';

const Layout = observer(() => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Crypto Rates",
        }}
      />
      <Stack.Screen
        name="[baseCurrency]"
        options={{
          title: "",
        }}
      />
    </Stack>
  );
});

export default Layout;