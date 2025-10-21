import { Box, Container, Heading, Text, SimpleGrid, VStack, HStack, useColorMode, Icon, Link } from '@chakra-ui/react'
import { FaUserShield, FaPhone, FaEnvelope, FaBriefcase } from 'react-icons/fa'
import AdminSidebar from '../../components/AdminSidebar'
import BreadcrumbNav from '../../components/Breadcrumb'

export default function AdminContactStaff() {
  const { colorMode } = useColorMode()

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'Contact Staff', path: '/admin/contact' }
  ]

  const superAdmins = [
    {
      name: 'Robert Martinez',
      phone: '+1 (234) 567-2001',
      email: 'robert.martinez@healthconnect.com',
      availability: '24/7 Emergency'
    },
    {
      name: 'Emily Thompson',
      phone: '+1 (234) 567-2002',
      email: 'emily.thompson@healthconnect.com',
      availability: '24/7 Emergency'
    }
  ]

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

  return (
    <Box display="flex">
      <AdminSidebar />
      <Box ml="250px" w="calc(100% - 250px)" minH="100vh" bg={colorMode === 'dark' ? '#0b1437' : 'gray.50'}>
        <Container maxW="1200px" py={8}>
          <BreadcrumbNav items={breadcrumbItems} />
          <Heading mb={2}>Contact Staff</Heading>
          <Text color="gray.600" mb={8}>
            Reach out to super admins and managers for escalations and coordination
          </Text>

          <Heading size="lg" mb={4}>Super Admins</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
            {superAdmins.map((contact, index) => (
              <Box 
                key={index}
                bg={colorMode === 'dark' ? '#1a2559' : 'white'} 
                p={6} 
                rounded="xl" 
                shadow="md" 
                border="2px" 
                borderColor="purple.500"
              >
                <HStack mb={4} spacing={3}>
                  <Icon as={FaUserShield} color="purple.500" boxSize={8} />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold" fontSize="xl">{contact.name}</Text>
                    <Text fontSize="sm" color="purple.500" fontWeight="semibold">Super Admin</Text>
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
                    <Text fontWeight="semibold">{contact.availability}</Text>
                  </Box>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>

          <Heading size="lg" mb={4}>Managers</Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {managers.map((contact, index) => (
              <Box 
                key={index}
                bg={colorMode === 'dark' ? '#1a2559' : 'white'} 
                p={6} 
                rounded="xl" 
                shadow="md" 
                border="1px" 
                borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}
              >
                <HStack mb={4} spacing={3}>
                  <Icon as={FaBriefcase} color="brand.500" boxSize={8} />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold" fontSize="xl">{contact.name}</Text>
                    <Text fontSize="sm" color="brand.500" fontWeight="semibold">{contact.role}</Text>
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
        </Container>
      </Box>
    </Box>
  )
}
