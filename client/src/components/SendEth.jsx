import { useState, useCallback, useEffect } from 'react'
import { Stack, FormControl, Input, Button, useColorModeValue, Heading, Text, Container, Flex } from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'
import { parseUnits, formatEther, Wallet } from 'ethers'
import { useAuthenticated } from '../Context/AuthenticateContext'
import { useFetchVault } from '../hooks/useFetchVault'

export const SendEth = ({ contractInstance }) => {
  const [amount, setAmount] = useState(0)
  const [state, setState] = useState('initial')
  const [error, setError] = useState(false)
  const [erroMessage, setErrorMessage] = useState('')
  const { connectWalletHandler, isAuthenticated, defaultAccount, signer } = useAuthenticated()
  const [unlockTime] = useFetchVault(contractInstance, defaultAccount)
  const isReadyToWithdrawal = useMemo(() => new Date(unlockTime) < new Date(), [unlockTime])
  async function handleClick(e) {
    e.preventDefault()
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
        setErrorMessage('Amount must be greater then 0.')
        setState('initial')
        return
      }
      const amount_in_wei = parseUnits(amount, 'ether')
      const amountInWei = amount_in_wei.toString(16)
      const transactionObj = {
        from: defaultAccount,
        to: contractInstance.target,
        value: amountInWei,
      }
      console.log(transactionObj)
      await window.ethereum.request({ method: 'eth_sendTransaction', params: [transactionObj] })
      setState('success')
    } catch (error) {
      setError(true)
      setErrorMessage(error.message)
      setState('initial')
    }
  }

  async function withdrawFund() {
    try {
      setState('submitting')
      const txn = await contractInstance.connect(signer).withdraw()
      const res = txn.wait(1)
      setState('success')
    } catch (error) {
      setError(true)
      setErrorMessage(error.message)
      setState('initial')
    }
  }

  function renderSendForm() {
    return (
      <>
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
          {error ? erroMessage : 'Secure Your Crypto!'}
        </Text>
      </>
    )
  }
  function renderWithdraw() {
    return (
      <Stack
        direction={{ base: 'column', md: 'row' }}
        as={'form'}
        spacing={'12px'}
        onSubmit={async (e) => {
          handleClick(e)
        }}
      >
        <Button
          colorScheme={state === 'success' ? 'green' : 'red'}
          isLoading={state === 'submitting'}
          w="100%"
          type={state === 'success' ? 'button' : 'submit'}
          variant="outline"
          onClick={() => withdrawFund()}
        >
          {state === 'success' ? <CheckIcon /> : 'Withdraw'}
        </Button>
      </Stack>
    )
  }
  return (
    <Flex align={'center'} justify={'center'} margin={50}>
      <Container maxW={'lg'} bg={useColorModeValue('yellow.30', 'yellow.50')} boxShadow={'xl'} rounded={'lg'} p={6} direction={'column'}>
        <Heading as={'h2'} fontSize={{ base: 'xl', sm: '2xl' }} textAlign={'center'} mb={5}>
          {isReadyToWithdrawal ? 'Withdraw Your Fund!' : 'Send Eth To Vault'}
        </Heading>
        {isReadyToWithdrawal ? renderWithdraw() : renderSendForm()}
      </Container>
    </Flex>
  )
}
