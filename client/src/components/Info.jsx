import { Box, Flex, SimpleGrid, Stat, StatLabel, StatNumber, useColorModeValue } from '@chakra-ui/react'
import { FaEthereum } from 'react-icons/fa'
import { AiFillLock } from 'react-icons/ai'
import { useEffect, useState, useCallback } from 'react'
import { formatEther, parseUnits } from 'ethers'

function StatsCard(props) {
  const { title, stat, icon } = props
  return (
    <Stat px={{ base: 2, md: 4 }} py={'2'} shadow={'xl'} border={'1px solid'} borderColor={useColorModeValue('gray.800', 'gray.500')} rounded={'lg'}>
      <Flex justifyContent={'space-between'}>
        <Box pl={{ base: 2, md: 4 }}>
          <StatLabel fontWeight={'medium'} isTruncated>
            {title}
          </StatLabel>
          <StatNumber fontSize={'l'} fontWeight={'bold'}>
            {stat}
          </StatNumber>
        </Box>
        <Box my={'auto'} color={useColorModeValue('gray.800', 'gray.200')} alignContent={'center'}>
          {icon}
        </Box>
      </Flex>
    </Stat>
  )
}

export const Info = ({ contract, defaultAccount }) => {
  const [totalValue, setTotalValue] = useState(null)
  const [usersDeposite, setUsersDeposite] = useState(null)
  const [unlockTime, setunlockTime] = useState(null)
  const fetchData = useCallback(async () => {
    const value = await contract.getTotalValueLocked()
    const myShare = await contract.getShare(defaultAccount)
    const unlockTime = await contract.unlockTime()
    return [value, myShare, unlockTime]
  }, [contract, defaultAccount])

  useEffect(() => {
    fetchData().then((data) => {
      const [value, myShare, unlockTime] = data
      const date = new Date(unlockTime.toString(10) * 1000).toDateString()
      setTotalValue(formatEther(value))
      setUsersDeposite(formatEther(myShare))
      setunlockTime(date)
    })
  }, [fetchData, usersDeposite, totalValue, defaultAccount])

  return (
    <Box maxW="5xl" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
        <StatsCard title={'TVL'} stat={totalValue} icon={<FaEthereum size={'2em'} />} />
        <StatsCard title={'Your Deposite'} stat={usersDeposite} icon={<FaEthereum size={'2em'} />} />
        <StatsCard title={'Locked Till'} stat={unlockTime} icon={<AiFillLock size={'2em'} />} />
      </SimpleGrid>
    </Box>
  )
}
