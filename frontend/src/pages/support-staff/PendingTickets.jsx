import { Box, Container, Heading, Text, VStack, HStack, Button, useColorMode, Badge, Spinner, useToast } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SupportStaffSidebar from '../../components/SupportStaffSidebar'
import BreadcrumbNav from '../../components/Breadcrumb'
import { api } from '../../services/api'

export default function PendingTickets() {
  const { colorMode } = useColorMode()
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    loadTickets()
  }, [])

  const loadTickets = async () => {
    try {
      setLoading(true)
      const data = await api.getPendingTickets()
      setTickets(data)
    } catch (error) {
      toast({ title: 'Error loading tickets', description: error.message, status: 'error', duration: 5000, position: 'top' })
    } finally {
      setLoading(false)
    }
  }

  const breadcrumbItems = [
    { label: 'Support Staff', path: '/support-staff/dashboard' },
    { label: 'Pending Tickets', path: '/support-staff/tickets' }
  ]

  const handleAccept = async (ticketId) => {
    try {
      await api.acceptTicket(ticketId)
      toast({ title: 'Ticket accepted!', status: 'success', duration: 3000, position: 'top' })
      navigate(`/support-staff/chat/${ticketId}`)
    } catch (error) {
      toast({ title: 'Accept failed', description: error.message, status: 'error', duration: 5000, position: 'top' })
    }
  }

  const getBadgeColor = (userType) => {
    switch(userType) {
      case 'Patient': return 'blue'
      case 'Doctor': return 'purple'
      case 'Dietitian': return 'green'
      default: return 'gray'
    }
  }

  return (
    <Box display="flex">
      <SupportStaffSidebar />
      <Box ml="250px" w="calc(100% - 250px)" minH="100vh" bg={colorMode === 'dark' ? '#0b1437' : 'gray.50'}>
        <Container maxW="1200px" py={8}>
          <BreadcrumbNav items={breadcrumbItems} />
          <Heading mb={2}>Pending Support Tickets</Heading>
          <Text color="gray.600" mb={6} fontSize="lg">
            You have <Badge colorScheme="purple" fontSize="lg" px={3} py={1} rounded="full">{tickets.length}</Badge> pending tickets
          </Text>

          {loading ? (
            <VStack py={12}><Spinner size="xl" color="brand.500" /></VStack>
          ) : (
          <VStack spacing={4} align="stretch">
            {tickets.map((ticket) => (
              <Box 
                key={ticket.id} 
                bg={colorMode === 'dark' ? '#1a2559' : 'white'} 
                p={6} 
                rounded="xl" 
                shadow="md" 
                border="1px" 
                borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}
              >
                <HStack justify="space-between" align="start">
                  <VStack align="start" spacing={3} flex="1">
                    <HStack>
                      <Text fontWeight="bold" fontSize="xl">{ticket.userName}</Text>
                      <Badge colorScheme={getBadgeColor(ticket.userType)}>{ticket.userType}</Badge>
                      <Badge colorScheme="orange">Pending</Badge>
                    </HStack>
                    <HStack spacing={6}>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" color="gray.500">Patient ID</Text>
                        <Text fontWeight="semibold">{ticket.patientId}</Text>
                      </VStack>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" color="gray.500">Subject</Text>
                        <Text fontWeight="semibold">{ticket.subject}</Text>
                      </VStack>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" color="gray.500">Created</Text>
                        <Text fontWeight="semibold">{new Date(ticket.createdAt).toLocaleString()}</Text>
                      </VStack>
                    </HStack>
                  </VStack>
                  <Button
                    bgGradient="linear(to-r, brand.500, purple.400)"
                    color="white"
                    size="lg"
                    onClick={() => handleAccept(ticket.id)}
                  >
                    Accept
                  </Button>
                </HStack>
              </Box>
            ))}
          </VStack>
          )}
            {!loading && tickets.length === 0 && (
              <Box 
                bg={colorMode === 'dark' ? '#1a2559' : 'white'} 
                p={12} 
                rounded="xl" 
                shadow="md" 
                textAlign="center"
              >
                <Text color="gray.500" fontSize="lg">No pending tickets</Text>
              </Box>
            )}
        </Container>
      </Box>
    </Box>
  )
}
