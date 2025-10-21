import { Box, Container, Heading, Text, VStack, HStack, Badge, Button, Spinner, useColorMode, Icon } from '@chakra-ui/react'
import { FaClipboardList, FaCheck, FaUser, FaWeight, FaBirthdayCake, FaBullseye } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import DietitianSidebar from '../../components/DietitianSidebar'
import BreadcrumbNav from '../../components/Breadcrumb'
import { api } from '../../services/api'

export default function DietRequests() {
  const { colorMode } = useColorMode()
  const [pendingRequests, setPendingRequests] = useState([])
  const [myRequests, setMyRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()
  const navigate = useNavigate()

  const breadcrumbItems = [
    { label: 'Dietitian', path: '/dietitian/dashboard' },
    { label: 'Diet Requests', path: '/dietitian/diet-requests' }
  ]

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      setLoading(true)
      const [pending, mine] = await Promise.all([
        api.getDietRequestQueue(),
        api.getMyDietRequests()
      ])
      setPendingRequests(pending)
      setMyRequests(mine.filter(r => r.status !== 'PENDING'))
    } catch (error) {
      toast({ title: 'Error loading requests', description: error.message, status: 'error', duration: 5000, position: 'top' })
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (id) => {
    try {
      await api.acceptDietRequest(id)
      toast({ title: 'Request accepted!', description: 'You can now create a meal plan for this patient', status: 'success', duration: 3000, position: 'top' })
      await loadRequests()
      navigate('/dietitian/meal-plans')
    } catch (error) {
      toast({ title: 'Accept failed', description: error.message, status: 'error', duration: 5000, position: 'top' })
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'yellow'
      case 'ACCEPTED': return 'blue'
      case 'COMPLETED': return 'green'
      case 'CANCELLED': return 'red'
      default: return 'gray'
    }
  }

  const RequestCard = ({ request, showAccept }) => (
    <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={6} rounded="xl" shadow="lg" border="1px" borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}>
      <HStack justify="space-between" mb={4}>
        <HStack>
          <Icon as={FaClipboardList} color="brand.500" boxSize={6} />
          <Heading size="md">Diet Plan Request</Heading>
        </HStack>
        <Badge colorScheme={getStatusColor(request.status)} fontSize="md" px={3} py={1}>
          {request.status}
        </Badge>
      </HStack>

      <VStack align="stretch" spacing={3} mb={4}>
        <HStack p={3} bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'} rounded="lg">
          <Icon as={FaUser} color="gray.500" />
          <Text fontWeight="semibold" color="gray.500">Patient ID:</Text>
          <Text fontWeight="bold">{request.patientId}</Text>
        </HStack>

        <HStack p={3} bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'} rounded="lg" spacing={6}>
          <HStack>
            <Icon as={FaBirthdayCake} color="gray.500" />
            <Text fontWeight="semibold" color="gray.500">Age:</Text>
            <Text fontWeight="bold">{request.age}</Text>
          </HStack>
          <HStack>
            <Icon as={FaWeight} color="gray.500" />
            <Text fontWeight="semibold" color="gray.500">Weight:</Text>
            <Text fontWeight="bold">{request.weight} kg</Text>
          </HStack>
        </HStack>

        <Box p={3} bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'} rounded="lg">
          <HStack mb={2}>
            <Icon as={FaBullseye} color="gray.500" />
            <Text fontWeight="semibold" color="gray.500">Health Goals:</Text>
          </HStack>
          <Text>{request.healthGoals}</Text>
        </Box>

        {request.dietaryRestrictions && (
          <Box p={3} bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'} rounded="lg">
            <Text fontWeight="semibold" color="gray.500" mb={2}>Dietary Restrictions:</Text>
            <Text>{request.dietaryRestrictions}</Text>
          </Box>
        )}

        <Box p={3} bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'} rounded="lg">
          <Text fontWeight="semibold" color="gray.500" mb={2}>Activity Level:</Text>
          <Text>{request.activityLevel}</Text>
        </Box>
      </VStack>

      {showAccept && (
        <Button 
          leftIcon={<FaCheck />} 
          bgGradient="linear(to-r, brand.500, purple.400)" 
          color="white" 
          w="full"
          onClick={() => handleAccept(request.id)}
        >
          Accept Request
        </Button>
      )}
    </Box>
  )

  return (
    <Box display="flex">
      <DietitianSidebar />
      <Box ml="250px" w="calc(100% - 250px)" minH="100vh" bg={colorMode === 'dark' ? '#0b1437' : 'gray.50'}>
        <Container maxW="1200px" py={8}>
          <BreadcrumbNav items={breadcrumbItems} />
          <Heading mb={8}>Diet Plan Requests</Heading>

          {loading ? (
            <VStack align="center" justify="center" minH="300px">
              <Spinner size="xl" color="brand.500" />
            </VStack>
          ) : (
            <VStack spacing={8} align="stretch">
              <Box>
                <Heading size="md" mb={4} pb={3} borderBottom="2px" borderColor="brand.500">
                  Pending Requests ({pendingRequests.length})
                </Heading>
                {pendingRequests.length === 0 ? (
                  <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={8} rounded="xl" shadow="lg" textAlign="center">
                    <Icon as={FaClipboardList} boxSize={16} color="gray.400" mb={4} />
                    <Text fontSize="xl" color="gray.500">No pending requests</Text>
                  </Box>
                ) : (
                  <VStack spacing={4} align="stretch">
                    {pendingRequests.map(request => (
                      <RequestCard key={request.id} request={request} showAccept={true} />
                    ))}
                  </VStack>
                )}
              </Box>

              <Box>
                <Heading size="md" mb={4} pb={3} borderBottom="2px" borderColor="purple.500">
                  My Accepted Requests ({myRequests.length})
                </Heading>
                {myRequests.length === 0 ? (
                  <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={8} rounded="xl" shadow="lg" textAlign="center">
                    <Text fontSize="lg" color="gray.500">No accepted requests yet</Text>
                  </Box>
                ) : (
                  <VStack spacing={4} align="stretch">
                    {myRequests.map(request => (
                      <RequestCard key={request.id} request={request} showAccept={false} />
                    ))}
                  </VStack>
                )}
              </Box>
            </VStack>
          )}
        </Container>
      </Box>
    </Box>
  )
}
