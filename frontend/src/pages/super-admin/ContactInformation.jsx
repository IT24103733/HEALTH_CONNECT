import { Box, Container, Heading, Text, SimpleGrid, VStack, HStack, useColorMode, Icon, Link } from '@chakra-ui/react'
import { FaShieldAlt, FaBriefcase, FaPhone, FaEnvelope, FaUserTie } from 'react-icons/fa'
import SuperAdminSidebar from '../../components/SuperAdminSidebar'
import BreadcrumbNav from '../../components/Breadcrumb'

export default function SuperAdminContactInformation() {
  const { colorMode } = useColorMode()

  const breadcrumbItems = [
    { label: 'Super Admin', path: '/super-admin/dashboard' },
    { label: 'Contact Information', path: '/super-admin/contact' }
  ]

  const cybersecurityManager = {
    name: 'Dr. Richard Chen',
    role: 'Cybersecurity Manager',
    phone: '+1 (234) 567-4001',
    email: 'richard.chen@healthconnect.com',
    availability: '24/7 Security Hotline'
  }

  const managers = [
    {
      name: 'David Wilson',
      role: 'Operations Manager',
      phone: '+1 (234) 567-3001',
      email: 'david.wilson@healthconnect.com',
      availability: 'Mon-Fri: 8AM - 6PM'
    },
    {
      name: 'Lisa Brown',
      role: 'Compliance Manager',
      phone: '+1 (234) 567-3002',
      email: 'lisa.brown@healthconnect.com',
      availability: 'Mon-Fri: 9AM - 5PM'
    },
    {
      name: 'James Taylor',
      role: 'Technical Manager',
      phone: '+1 (234) 567-3003',
      email: 'james.taylor@healthconnect.com',
      availability: 'Mon-Sat: 10AM - 7PM'
    }
  ]

  const adminManager = {
    name: 'Patricia Moore',
    role: 'Admin Manager',
    phone: '+1 (234) 567-5001',
    email: 'patricia.moore@healthconnect.com',
    availability: 'Mon-Fri: 9AM - 6PM'
  }

  const supportStaffManager = {
    name: 'Kevin Rodriguez',
    role: 'Support Staff Manager',
    phone: '+1 (234) 567-6001',
    email: 'kevin.rodriguez@healthconnect.com',
    availability: 'Mon-Sun: 8AM - 8PM'
  }

  return (
    <Box display="flex">
      <SuperAdminSidebar />
      <Box ml="250px" w="calc(100% - 250px)" minH="100vh" bg={colorMode === 'dark' ? '#0b1437' : 'gray.50'}>
        <Container maxW="1200px" py={8}>
          <BreadcrumbNav items={breadcrumbItems} />
          <Heading mb={2}>Contact Information</Heading>
          <Text color="gray.600" mb={8}>
            Key contacts for system coordination and escalations
          </Text>

          <Heading size="lg" mb={4}>Cybersecurity Manager</Heading>
          <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={6} rounded="xl" shadow="md" border="2px" borderColor="red.500" mb={8}>
            <HStack mb={4} spacing={3}>
              <Icon as={FaShieldAlt} color="red.500" boxSize={8} />
              <VStack align="start" spacing={0}>
                <Text fontWeight="bold" fontSize="xl">{cybersecurityManager.name}</Text>
                <Text fontSize="sm" color="red.500" fontWeight="semibold">{cybersecurityManager.role}</Text>
              </VStack>
            </HStack>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
              <HStack p={3} bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'} rounded="lg">
                <Icon as={FaPhone} color="brand.500" />
                <VStack align="start" spacing={0} flex="1">
                  <Text fontSize="xs" color="gray.500">Phone</Text>
                  <Link href={`tel:${cybersecurityManager.phone}`}>
                    <Text fontWeight="semibold" color="brand.500">{cybersecurityManager.phone}</Text>
                  </Link>
                </VStack>
              </HStack>
              <HStack p={3} bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'} rounded="lg">
                <Icon as={FaEnvelope} color="brand.500" />
                <VStack align="start" spacing={0} flex="1">
                  <Text fontSize="xs" color="gray.500">Email</Text>
                  <Link href={`mailto:${cybersecurityManager.email}`}>
                    <Text fontWeight="semibold" color="brand.500" fontSize="sm">{cybersecurityManager.email}</Text>
                  </Link>
                </VStack>
              </HStack>
              <Box p={3} bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'} rounded="lg">
                <Text fontSize="xs" color="gray.500">Availability</Text>
                <Text fontWeight="semibold">{cybersecurityManager.availability}</Text>
              </Box>
            </SimpleGrid>
          </Box>

          <Heading size="lg" mb={4}>Managers</Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
            {managers.map((contact, index) => (
              <Box key={index} bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={6} rounded="xl" shadow="md" border="1px" borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}>
                <HStack mb={4} spacing={3}>
                  <Icon as={FaBriefcase} color="purple.500" boxSize={8} />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold" fontSize="xl">{contact.name}</Text>
                    <Text fontSize="sm" color="purple.500" fontWeight="semibold">{contact.role}</Text>
                  </VStack>
                </HStack>
                <VStack align="stretch" spacing={3}>
                  <HStack p={3} bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'} rounded="lg">
                    <Icon as={FaPhone} color="brand.500" />
                    <VStack align="start" spacing={0} flex="1">
                      <Text fontSize="xs" color="gray.500">Phone</Text>
                      <Link href={`tel:${contact.phone}`}>
                        <Text fontWeight="semibold" color="brand.500">{contact.phone}</Text>
                      </Link>
                    </VStack>
                  </HStack>
                  <HStack p={3} bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'} rounded="lg">
                    <Icon as={FaEnvelope} color="brand.500" />
                    <VStack align="start" spacing={0} flex="1">
                      <Text fontSize="xs" color="gray.500">Email</Text>
                      <Link href={`mailto:${contact.email}`}>
                        <Text fontWeight="semibold" color="brand.500" fontSize="sm">{contact.email}</Text>
                      </Link>
                    </VStack>
                  </HStack>
                  <Box p={3} bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'} rounded="lg">
                    <Text fontSize="xs" color="gray.500">Availability</Text>
                    <Text fontWeight="semibold" fontSize="sm">{contact.availability}</Text>
                  </Box>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={6} rounded="xl" shadow="md" border="1px" borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}>
              <HStack mb={4} spacing={3}>
                <Icon as={FaUserTie} color="brand.500" boxSize={8} />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold" fontSize="xl">{adminManager.name}</Text>
                  <Text fontSize="sm" color="brand.500" fontWeight="semibold">{adminManager.role}</Text>
                </VStack>
              </HStack>
              <VStack align="stretch" spacing={3}>
                <HStack p={3} bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'} rounded="lg">
                  <Icon as={FaPhone} color="brand.500" />
                  <VStack align="start" spacing={0} flex="1">
                    <Text fontSize="xs" color="gray.500">Phone</Text>
                    <Link href={`tel:${adminManager.phone}`}>
                      <Text fontWeight="semibold" color="brand.500">{adminManager.phone}</Text>
                    </Link>
                  </VStack>
                </HStack>
                <HStack p={3} bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'} rounded="lg">
                  <Icon as={FaEnvelope} color="brand.500" />
                  <VStack align="start" spacing={0} flex="1">
                    <Text fontSize="xs" color="gray.500">Email</Text>
                    <Link href={`mailto:${adminManager.email}`}>
                      <Text fontWeight="semibold" color="brand.500" fontSize="sm">{adminManager.email}</Text>
                    </Link>
                  </VStack>
                </HStack>
                <Box p={3} bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'} rounded="lg">
                  <Text fontSize="xs" color="gray.500">Availability</Text>
                  <Text fontWeight="semibold">{adminManager.availability}</Text>
                </Box>
              </VStack>
            </Box>

            <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={6} rounded="xl" shadow="md" border="1px" borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}>
              <HStack mb={4} spacing={3}>
                <Icon as={FaUserTie} color="orange.500" boxSize={8} />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold" fontSize="xl">{supportStaffManager.name}</Text>
                  <Text fontSize="sm" color="orange.500" fontWeight="semibold">{supportStaffManager.role}</Text>
                </VStack>
              </HStack>
              <VStack align="stretch" spacing={3}>
                <HStack p={3} bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'} rounded="lg">
                  <Icon as={FaPhone} color="brand.500" />
                  <VStack align="start" spacing={0} flex="1">
                    <Text fontSize="xs" color="gray.500">Phone</Text>
                    <Link href={`tel:${supportStaffManager.phone}`}>
                      <Text fontWeight="semibold" color="brand.500">{supportStaffManager.phone}</Text>
                    </Link>
                  </VStack>
                </HStack>
                <HStack p={3} bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'} rounded="lg">
                  <Icon as={FaEnvelope} color="brand.500" />
                  <VStack align="start" spacing={0} flex="1">
                    <Text fontSize="xs" color="gray.500">Email</Text>
                    <Link href={`mailto:${supportStaffManager.email}`}>
                      <Text fontWeight="semibold" color="brand.500" fontSize="sm">{supportStaffManager.email}</Text>
                    </Link>
                  </VStack>
                </HStack>
                <Box p={3} bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'} rounded="lg">
                  <Text fontSize="xs" color="gray.500">Availability</Text>
                  <Text fontWeight="semibold">{supportStaffManager.availability}</Text>
                </Box>
              </VStack>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  )
}
