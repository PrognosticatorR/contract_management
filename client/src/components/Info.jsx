import { Box, Flex, SimpleGrid, Stat, StatLabel, StatNumber, useColorModeValue } from '@chakra-ui/react'
import { FaEthereum } from 'react-icons/fa'
import { AiFillLock } from 'react-icons/ai'

import { useFetchVault } from '../hooks/useFetchVault'
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
  const [unlockTime, usersDeposite, totalValue] = useFetchVault(contract, defaultAccount)
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
