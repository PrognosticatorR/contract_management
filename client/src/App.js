import './App.css'
import { useAuthenticated } from './Context/AuthenticateContext'
import { Button, Card, CardBody, CardHeader, Center, Container, Text } from '@chakra-ui/react'
import { SendEth } from './components/SendEth'
import useContract from './hooks/useContract'
import { Info } from './components/Info'
import * as VaultArtifact from './artifacts/contracts/Vault.sol/Vault.json'

function App() {
  const { connectWalletHandler, ConnButtonText, accountChangedHandler, chainChangedHandler, isAuthenticated, defaultAccount, userBalance, signer } =
    useAuthenticated()
  window.ethereum.on('accountsChanged', accountChangedHandler)
  window.ethereum.on('chainChanged', chainChangedHandler)
  const { contractInstance } = useContract(VaultArtifact, '0x09b94a47B98fBF0Ee95ee4851cEf9835e8f0aE74', signer)

  return (
    <Center alignItems="center" display="flex" height={'100vh'}>
      <Card zIndex={5} width={800} height={500} display="flex" backgroundColor="yellow.50">
        <CardHeader alignSelf="center" fontSize={20} fontWeight={500}>
          Welcome to <strong>Crypto Vault</strong>
        </CardHeader>
        <hr />
        <CardBody display="flex" flexDirection="column">
          <Container alignItems="center">
            {!isAuthenticated && (
              <Text align="center" fontSize={16}>
                To Play Please Connect Your Wallet.
              </Text>
            )}
            {!!isAuthenticated && (
              <>
                <Container display="flex" width={'100%'} justifyContent="space-between">
                  {defaultAccount && typeof defaultAccount === 'string' && (
                    <Text align="left" fontSize={16}>
                      Address: {defaultAccount.substring(0, 15)}
                    </Text>
                  )}
                  <Text align="right " fontSize={16}>
                    Balance Of: {userBalance} Ether
                  </Text>
                </Container>
                <Info contract={contractInstance} defaultAccount={defaultAccount} />
                <SendEth contractInstance={contractInstance} />
              </>
            )}
          </Container>

          {!isAuthenticated && (
            <Button
              color={'red.300'}
              margin={50}
              alignSelf="center"
              width={200}
              colorScheme="red"
              variant="outline"
              onClick={connectWalletHandler}
              type="button"
            >
              {ConnButtonText}
            </Button>
          )}
        </CardBody>
      </Card>
    </Center>
  )
}

export default App
