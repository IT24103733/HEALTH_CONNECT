import { Box, Flex, Button, useColorMode, IconButton, HStack, Text } from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { FaShieldAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} px={4} shadow="sm" position="fixed" w="100%" zIndex={1000}>
      <Flex h={16} alignItems="center" justifyContent="space-between" maxW="1200px" mx="auto">
        <HStack spacing={2}>
          <FaShieldAlt color="#4318ff" size={24} />
          <Text fontSize="xl" fontWeight="bold" color="brand.500">Health Connect</Text>
        </HStack>
        <HStack spacing={8} alignItems="center">
          <Link to="/"><Text cursor="pointer" _hover={{color: 'brand.500'}}>Features</Text></Link>
          <Link to="/"><Text cursor="pointer" _hover={{color: 'brand.500'}}>About</Text></Link>
          <Link to="/login"><Button variant="ghost">Login</Button></Link>
          <IconButton
            icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            aria-label="Toggle theme"
          />
        </HStack>
      </Flex>
    </Box>
  )
}
