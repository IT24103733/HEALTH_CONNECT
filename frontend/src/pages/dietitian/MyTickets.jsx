import { Box, Container, Heading, Text, VStack, HStack, Button, useColorMode, Badge, Spinner, useToast } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DietitianSidebar from '../../components/DietitianSidebar'
import BreadcrumbNav from '../../components/Breadcrumb'
import { api } from '../../services/api'

export default function DietitianMyTickets() {
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
      const data = await api.getMyTickets()
      setTickets(data)
    } catch (error) {
      toast({ title: 'Error loading tickets', description: error.message, status: 'error', duration: 5000, position: 'top' })
    } finally {
      setLoading(false)
    }
  }

  const breadcrumbItems = [
    { label: 'Dietitian', path: '/dietitian/dashboard' },
    { label: 'My Tickets', path: '/dietitian/support/my-tickets' }
  ]

  const getStatusColor = (status) => {
    switch(status) {
      case 'OPEN': return 'orange'
      case 'IN_PROGRESS': return 'blue'
      case 'RESOLVED': return 'green'
      default: return 'gray'
    }
  }

  return (
    <Box display="flex">
      <DietitianSidebar />
      <Box ml="250px" w="calc(100% - 250px)" minH="100vh" bg={colorMode === 'dark' ? '#0b1437' : 'gray.50'}>
        <Container maxW="1200px" py={8}>
          <BreadcrumbNav items={breadcrumbItems} />
          <Heading mb={6}>My Support Tickets</Heading>

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
                      <Text fontWeight="bold" fontSize="xl">{ticket.subject}</Text>
                      <Badge colorScheme={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                    </HStack>
                    <Text color="gray.600">{ticket.description}</Text>
                    <Text fontSize="sm" color="gray.500">Created: {new Date(ticket.createdAt).toLocaleString()}</Text>
                  </VStack>
                  {ticket.status !== 'RESOLVED' && (
                    <Button
                      bgGradient="linear(to-r, brand.500, purple.400)"
                      color="white"
                      size="lg"
                      onClick={() => navigate(`/dietitian/support/chat/${ticket.id}`)}
                    >
                      Open Chat
                    </Button>
                  )}
                </HStack>
              </Box>
            ))}
          </VStack>
          )}
          {!loading && tickets.length === 0 && (
            <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={12} rounded="xl" shadow="md" textAlign="center">
              <Text color="gray.500" fontSize="lg">No tickets found</Text>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  )
}
