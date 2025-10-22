import { Box, VStack, HStack, Text, Icon, useColorMode, IconButton, Divider, Button } from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { FaHome, FaCalendarAlt, FaUtensils, FaHeadset, FaUser, FaHeart, FaSignOutAlt } from 'react-icons/fa'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Sidebar() {
  const { colorMode, toggleColorMode } = useColorMode()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const menuItems = [
    { icon: FaHome, label: 'Dashboard', path: '/patient/dashboard' },
    { icon: FaCalendarAlt, label: 'Book Appointment', path: '/patient/appointments' },
    { icon: FaUtensils, label: 'Meal Plans', path: '/patient/meal-plans' },
    { icon: FaUtensils, label: 'Request Diet Plan', path: '/patient/diet-request' },
    { icon: FaUtensils, label: 'My Diet Requests', path: '/patient/my-diet-requests' },
    { icon: FaHeadset, label: 'Get Support', path: '/patient/support' },
    { icon: FaUser, label: 'Profile', path: '/patient/profile' }
  ]

  return (
    <Box
      w="250px"
      h="100vh"
      position="fixed"
      left={0}
      top={0}
      bg={colorMode === 'dark' ? '#1a2559' : 'white'}
      borderRight="1px"
      borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}
      p={6}
      display="flex"
      flexDirection="column"
    >
      <HStack mb={8}>
        <Icon as={FaHeart} color="brand.500" boxSize={6} />
        <Text fontSize="xl" fontWeight="bold" bgGradient="linear(to-r, brand.500, purple.400)" bgClip="text">
          Health Connect
        </Text>
      </HStack>
      <VStack spacing={2} align="stretch" flex={1}>
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <HStack
              p={3}
              rounded="lg"
              bg={location.pathname === item.path ? 'brand.500' : 'transparent'}
              color={location.pathname === item.path ? 'white' : 'gray.600'}
              _hover={{ bg: location.pathname === item.path ? 'brand.500' : colorMode === 'dark' ? 'whiteAlpha.100' : 'gray.100' }}
              cursor="pointer"
              transition="all 0.2s"
            >
              <Icon as={item.icon} />
              <Text fontWeight="medium">{item.label}</Text>
            </HStack>
          </Link>
        ))}
      </VStack>
      <Divider mb={4} />
      <HStack justify="space-between" mb={3}>
        <Text fontSize="sm" color="gray.600">Theme</Text>
        <IconButton
          icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
          onClick={toggleColorMode}
          size="sm"
          rounded="full"
          aria-label="Toggle theme"
        />
      </HStack>
      <Button
        leftIcon={<Icon as={FaSignOutAlt} />}
        colorScheme="red"
        variant="outline"
        size="sm"
        w="100%"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Box>
  )
}
