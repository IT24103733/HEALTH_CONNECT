import { Box, Container, Heading, Text, SimpleGrid, VStack, HStack, useColorMode, Icon, Link } from '@chakra-ui/react'
import { FaUserShield, FaPhone, FaEnvelope } from 'react-icons/fa'
import SupportStaffSidebar from '../../components/SupportStaffSidebar'
import BreadcrumbNav from '../../components/Breadcrumb'

export default function ContactStaff() {
  const { colorMode } = useColorMode()

  const breadcrumbItems = [
    { label: 'Support Staff', path: '/support-staff/dashboard' },
    { label: 'Contact Staff', path: '/support-staff/contact' }
  ]

  const contacts = [
    {
      name: 'Michael Anderson',
      role: 'System Admin',
      phone: '+1 (234) 567-1001',
      email: 'michael.anderson@healthconnect.com',
      availability: 'Mon-Fri: 9AM - 6PM'
    },
    {
      name: 'Jennifer Williams',
      role: 'System Admin',
      phone: '+1 (234) 567-1002',
      email: 'jennifer.williams@healthconnect.com',
      availability: 'Mon-Fri: 9AM - 6PM'
    },
    {
      name: 'Robert Martinez',
      role: 'Super Admin',
      phone: '+1 (234) 567-2001',
      email: 'robert.martinez@healthconnect.com',
      availability: '24/7 Emergency'
    },
    {
      name: 'Emily Thompson',
      role: 'Super Admin',
      phone: '+1 (234) 567-2002',
      email: 'emily.thompson@healthconnect.com',
      availability: '24/7 Emergency'
    }
  ]

  return (
    <Box display="flex">
      <SupportStaffSidebar />
      <Box ml="250px" w="calc(100% - 250px)" minH="100vh" bg={colorMode === 'dark' ? '#0b1437' : 'gray.50'}>
        <Container maxW="1200px" py={8}>
          <BreadcrumbNav items={breadcrumbItems} />
          <Heading mb={2}>Contact Staff</Heading>
          <Text color="gray.600" mb={8}>
            Reach out to admins and super admins for escalations and technical support
          </Text>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {contacts.map((contact, index) => (
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
                  <Icon 
                    as={FaUserShield} 
                    color={contact.role === 'Super Admin' ? 'purple.500' : 'brand.500'} 
                    boxSize={8} 
                  />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold" fontSize="xl">{contact.name}</Text>
                    <Text 
                      fontSize="sm" 
                      color={contact.role === 'Super Admin' ? 'purple.500' : 'brand.500'}
                      fontWeight="semibold"
                    >
                      {contact.role}
                    </Text>
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
        </Container>
      </Box>
    </Box>
  )
}
