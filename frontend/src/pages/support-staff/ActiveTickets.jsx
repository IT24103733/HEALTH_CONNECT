import { useState, useEffect } from 'react'
import { Box, Container, Heading, VStack, HStack, Text, Button, useColorMode, Badge, Spinner, useToast } from '@chakra-ui/react'
import { FaComments } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import SupportStaffSidebar from '../../components/SupportStaffSidebar'
import BreadcrumbNav from '../../components/Breadcrumb'
import { api } from '../../services/api'

export default function ActiveTickets() {
  const { colorMode } = useColorMode()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    loadActiveTickets()
  }, [])

  const loadActiveTickets = async () => {
    try {
      setLoading(true)
      const allTickets = await api.getMyTickets()
      const activeTickets = allTickets.filter(t => t.status === 'ASSIGNED' || t.status === 'IN_PROGRESS')
      setTickets(activeTickets)
    } catch (error) {
      toast({
        title: 'Failed to load tickets',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      })
    } finally {
      setLoading(false)
    }
  }

  const breadcrumbItems = [
    { label: 'Support Staff', path: '/support-staff/dashboard' },
    { label: 'Active Tickets', path: '/support-staff/active-tickets' }
  ]

  return (
    <Box display="flex">
      <SupportStaffSidebar />
      <Box ml="250px" w="calc(100% - 250px)" minH="100vh" bg={colorMode === 'dark' ? '#0b1437' : 'gray.50'}>
        <Container maxW="1200px" py={8}>
          <BreadcrumbNav items={breadcrumbItems} />
          <Heading mb={6}>Active Tickets</Heading>

          {loading ? (
            <VStack py={12}>
              <Spinner size="xl" color="brand.500" />
            </VStack>
          ) : tickets.length === 0 ? (
            <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={8} rounded="xl" shadow="md" textAlign="center">
              <Text color="gray.500">No active tickets</Text>
            </Box>
          ) : (
            <VStack spacing={4} align="stretch">
              {tickets.map((ticket) => (
                <Box
                  key={ticket.id}
                  bg={colorMode === 'dark' ? '#1a2559' : 'white'}
                  p={6}
                  rounded="xl"
                  shadow="md"
                  _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
                  transition="all 0.2s"
                >
                  <HStack justify="space-between" align="start">
                    <VStack align="start" spacing={2} flex={1}>
                      <HStack>
                        <Text fontWeight="bold" fontSize="lg">Ticket #{ticket.id}</Text>
                        <Badge colorScheme="blue">{ticket.status}</Badge>
                      </HStack>
                      <Text fontWeight="semibold">{ticket.subject}</Text>
                      <Text color="gray.600" fontSize="sm" noOfLines={2}>{ticket.description}</Text>
                      <HStack spacing={4} fontSize="sm" color="gray.500">
                        <Text>Patient ID: {ticket.patientId}</Text>
                        <Text>•</Text>
                        <Text>Created: {new Date(ticket.createdAt).toLocaleDateString()}</Text>
                      </HStack>
                    </VStack>
                    <Button
                      leftIcon={<FaComments />}
                      bgGradient="linear(to-r, brand.500, purple.400)"
                      color="white"
                      onClick={() => navigate(`/support-staff/chat/${ticket.id}`)}
                      _hover={{ bgGradient: "linear(to-r, brand.600, purple.500)" }}
                    >
                      View Chat
                    </Button>
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
        </Container>
      </Box>
    </Box>
  )
}
