import { useState } from 'react'
import { Stack, FormControl, Input, Button, useColorModeValue, Heading, Text, Container, Flex } from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'
import { parseUnits } from 'ethers'
import { useAuthenticated } from '../Context/AuthenticateContext'
import * as VaultArtifact from '../artifacts/contracts/Vault.sol/Vault.json'
import useContract from '../hooks/useContract'

export const SendEth = () => {
  const [amount, setAmount] = useState(0)
  const [state, setState] = useState('initial')
  const [error, setError] = useState(false)
  const { connectWalletHandler, isAuthenticated, defaultAccount } = useAuthenticated()
  const { contractInstance } = useContract(VaultArtifact, '0x6600a6F9B2229d465EF963d1C9ee6b3C82D80A45')

  async function handleClick(e) {
    try {
      setError(false)
      setState('submitting')
      if (!isAuthenticated) {
        setError(true)
        setState('initial')
        return connectWalletHandler()
      }
      if (amount === 0) {
        setError(true)
        setState('initial')
        return
      }
      const amountInWei = parseUnits(amount, 'ether')
      const transactionObj = {
        from: defaultAccount,
        to: contractInstance.address,
        value: amountInWei._hex,
      }
      await window.ethereum.request({ method: 'eth_sendTransaction', params: [transactionObj] })
      setState('success')
    } catch (error) {
      setError(true)
    }
  }
  return (
    <Flex align={'center'} justify={'center'} margin={50}>
      <Container maxW={'lg'} bg={useColorModeValue('yellow.30', 'yellow.50')} boxShadow={'xl'} rounded={'lg'} p={6} direction={'column'}>
        <Heading as={'h2'} fontSize={{ base: 'xl', sm: '2xl' }} textAlign={'center'} mb={5}>
          Send Eth To Vault
        </Heading>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          as={'form'}
          spacing={'12px'}
          onSubmit={async (e) => {
            handleClick(e)
          }}
        >
          <FormControl>
            <Input
              variant={'solid'}
              borderWidth={1}
              step={0.01}
              color={'gray.800'}
              _placeholder={{
                color: 'gray.400',
              }}
              borderColor={useColorModeValue('gray.300', 'gray.700')}
              id={'amount'}
              type="number"
              required
              placeholder={'Eth to deposite'}
              aria-label={'Eth to deposite'}
              value={amount}
              disabled={state !== 'initial'}
              onChange={(e) => setAmount(e.target.value)}
            />
          </FormControl>
          <FormControl w={{ base: '100%', md: '40%' }}>
            <Button
              colorScheme={state === 'success' ? 'green' : 'red'}
              isLoading={state === 'submitting'}
              w="100%"
              type={state === 'success' ? 'button' : 'submit'}
              variant="outline"
            >
              {state === 'success' ? <CheckIcon /> : 'Send'}
            </Button>
          </FormControl>
        </Stack>
        <Text mt={2} textAlign={'center'} color={error ? 'red.500' : 'gray.500'}>
          {error ? 'Oh no an error occured! 😢 Please try again later.' : 'Secure your investment!'}
        </Text>
      </Container>
    </Flex>
  )
}
