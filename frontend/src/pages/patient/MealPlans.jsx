import { Box, Container, Heading, Text, VStack, HStack, Badge, Progress, Spinner, useColorMode, Icon } from '@chakra-ui/react'
import { FaUtensils, FaCalendar, FaChartLine } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { useToast } from '@chakra-ui/react'
import Sidebar from '../../components/Sidebar'
import BreadcrumbNav from '../../components/Breadcrumb'
import { api } from '../../services/api'
import { getCurrentUser } from '../../services/auth'

export default function MealPlans() {
  const { colorMode } = useColorMode()
  const [mealPlans, setMealPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()
  const user = getCurrentUser()

  const breadcrumbItems = [
    { label: 'Patient', path: '/patient/dashboard' },
    { label: 'Meal Plans', path: '/patient/meal-plans' }
  ]

  useEffect(() => {
    loadMealPlans()
  }, [])

  const loadMealPlans = async () => {
    try {
      setLoading(true)
      const data = await api.getPatientCarePlans(user.id)
      setMealPlans(data.filter(plan => plan.planType === 'MEAL_PLAN'))
    } catch (error) {
      toast({ title: 'Error loading meal plans', description: error.message, status: 'error', duration: 5000, position: 'top' })
    } finally {
      setLoading(false)
    }
  }

  const getAdherenceColor = (percentage) => {
    if (percentage >= 75) return 'green'
    if (percentage >= 50) return 'yellow'
    return 'red'
  }

  return (
    <Box display="flex">
      <Sidebar />
      <Box ml="250px" w="calc(100% - 250px)" minH="100vh" bg={colorMode === 'dark' ? '#0b1437' : 'gray.50'}>
        <Container maxW="1200px" py={8}>
          <BreadcrumbNav items={breadcrumbItems} />
          <Heading mb={8}>My Meal Plans</Heading>

          {loading ? (
            <VStack align="center" justify="center" minH="300px">
              <Spinner size="xl" color="brand.500" />
            </VStack>
          ) : mealPlans.length === 0 ? (
            <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={8} rounded="xl" shadow="lg" textAlign="center">
              <Icon as={FaUtensils} boxSize={16} color="gray.400" mb={4} />
              <Text fontSize="xl" color="gray.500">No meal plans assigned yet</Text>
              <Text color="gray.400" mt={2}>Your dietitian will create a personalized meal plan for you</Text>
            </Box>
          ) : (
            <VStack spacing={6} align="stretch">
              {mealPlans.map((plan) => (
                <Box key={plan.id} bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={6} rounded="xl" shadow="lg" border="1px" borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}>
                  <HStack justify="space-between" mb={4}>
                    <HStack>
                      <Icon as={FaUtensils} color="brand.500" boxSize={6} />
                      <Heading size="md">Meal Plan</Heading>
                    </HStack>
                    <Badge colorScheme="purple" fontSize="md" px={3} py={1}>
                      {plan.planType.replace('_', ' ')}
                    </Badge>
                  </HStack>

                  <HStack spacing={6} mb={4} flexWrap="wrap">
                    <HStack>
                      <Icon as={FaCalendar} color="gray.500" />
                      <Text fontSize="sm" color="gray.600">
                        Created: {new Date(plan.createdAt).toLocaleDateString()}
                      </Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaChartLine} color="gray.500" />
                      <Text fontSize="sm" color="gray.600">
                        Dietitian ID: {plan.creatorId}
                      </Text>
                    </HStack>
                  </HStack>

                  <Box mb={4} p={4} bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'} rounded="lg">
                    <Text whiteSpace="pre-wrap">{plan.content}</Text>
                  </Box>

                  <Box>
                    <HStack justify="space-between" mb={2}>
                      <Text fontWeight="semibold">Adherence Progress</Text>
                      <Text fontWeight="bold" color={`${getAdherenceColor(plan.adherencePercentage)}.500`}>
                        {plan.adherencePercentage}%
                      </Text>
                    </HStack>
                    <Progress 
                      value={plan.adherencePercentage} 
                      colorScheme={getAdherenceColor(plan.adherencePercentage)} 
                      size="lg" 
                      rounded="full"
                    />
                  </Box>
                </Box>
              ))}
            </VStack>
          )}
        </Container>
      </Box>
    </Box>
  )
}
