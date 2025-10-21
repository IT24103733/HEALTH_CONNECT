import { Box, Container, Heading, Text, VStack, HStack, Badge, Button, Textarea, Select, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, useDisclosure, Spinner, useColorMode, Icon, IconButton, Progress } from '@chakra-ui/react'
import { FaUtensils, FaPlus, FaEdit, FaCalendar, FaUser } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { useToast } from '@chakra-ui/react'
import DietitianSidebar from '../../components/DietitianSidebar'
import BreadcrumbNav from '../../components/Breadcrumb'
import { api } from '../../services/api'
import { getCurrentUser } from '../../services/auth'

export default function MealPlans() {
  const { colorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [mealPlans, setMealPlans] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ patientId: '', content: '' })
  const [editingPlan, setEditingPlan] = useState(null)
  const toast = useToast()
  const user = getCurrentUser()

  const breadcrumbItems = [
    { label: 'Dietitian', path: '/dietitian/dashboard' },
    { label: 'Meal Plans', path: '/dietitian/meal-plans' }
  ]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [plansData, usersData] = await Promise.all([
        api.getCreatorCarePlans(user.id),
        api.getUsers(0, 1000)
      ])
      setMealPlans(plansData.filter(plan => plan.planType === 'MEAL_PLAN'))
      setPatients((usersData.content || usersData).filter(u => u.role === 'PATIENT'))
    } catch (error) {
      toast({ title: 'Error loading data', description: error.message, status: 'error', duration: 5000, position: 'top' })
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingPlan(null)
    setFormData({ patientId: '', content: '' })
    onOpen()
  }

  const handleEdit = (plan) => {
    setEditingPlan(plan)
    setFormData({ patientId: plan.patientId, content: plan.content })
    onOpen()
  }

  const handleSubmit = async () => {
    if (!formData.patientId || !formData.content.trim()) {
      toast({ title: 'Missing fields', description: 'Please select a patient and enter plan content', status: 'warning', duration: 3000, position: 'top' })
      return
    }

    try {
      if (editingPlan) {
        await api.updateCarePlan(editingPlan.id, formData.content)
        toast({ title: 'Meal plan updated!', status: 'success', duration: 3000, position: 'top' })
      } else {
        await api.createCarePlan(parseInt(formData.patientId), user.id, 'MEAL_PLAN', formData.content)
        toast({ title: 'Meal plan created!', status: 'success', duration: 3000, position: 'top' })
      }
      await loadData()
      onClose()
      setFormData({ patientId: '', content: '' })
    } catch (error) {
      toast({ title: 'Operation failed', description: error.message, status: 'error', duration: 5000, position: 'top' })
    }
  }

  const getAdherenceColor = (percentage) => {
    if (percentage >= 75) return 'green'
    if (percentage >= 50) return 'yellow'
    return 'red'
  }

  return (
    <Box display="flex">
      <DietitianSidebar />
      <Box ml="250px" w="calc(100% - 250px)" minH="100vh" bg={colorMode === 'dark' ? '#0b1437' : 'gray.50'}>
        <Container maxW="1200px" py={8}>
          <BreadcrumbNav items={breadcrumbItems} />
          <HStack justify="space-between" mb={8}>
            <Heading>My Meal Plans</Heading>
            <Button leftIcon={<FaPlus />} bgGradient="linear(to-r, brand.500, purple.400)" color="white" onClick={handleCreate}>
              Create Meal Plan
            </Button>
          </HStack>

          {loading ? (
            <VStack align="center" justify="center" minH="300px">
              <Spinner size="xl" color="brand.500" />
            </VStack>
          ) : mealPlans.length === 0 ? (
            <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={8} rounded="xl" shadow="lg" textAlign="center">
              <Icon as={FaUtensils} boxSize={16} color="gray.400" mb={4} />
              <Text fontSize="xl" color="gray.500">No meal plans created yet</Text>
              <Text color="gray.400" mt={2}>Create your first meal plan for a patient</Text>
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
                    <HStack>
                      <Badge colorScheme="purple" fontSize="md" px={3} py={1}>
                        {plan.planType.replace('_', ' ')}
                      </Badge>
                      <IconButton icon={<FaEdit />} size="sm" colorScheme="brand" variant="ghost" onClick={() => handleEdit(plan)} aria-label="Edit" />
                    </HStack>
                  </HStack>

                  <HStack spacing={6} mb={4} flexWrap="wrap">
                    <HStack>
                      <Icon as={FaUser} color="gray.500" />
                      <Text fontSize="sm" color="gray.600">
                        Patient ID: {plan.patientId}
                      </Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaCalendar} color="gray.500" />
                      <Text fontSize="sm" color="gray.600">
                        Created: {new Date(plan.createdAt).toLocaleDateString()}
                      </Text>
                    </HStack>
                  </HStack>

                  <Box mb={4} p={4} bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'} rounded="lg">
                    <Text whiteSpace="pre-wrap">{plan.content}</Text>
                  </Box>

                  <Box>
                    <HStack justify="space-between" mb={2}>
                      <Text fontWeight="semibold">Patient Adherence</Text>
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

          <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{editingPlan ? 'Edit Meal Plan' : 'Create Meal Plan'}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Text fontWeight="semibold" mb={2}>Patient</Text>
                    <Select 
                      placeholder="Select patient" 
                      value={formData.patientId} 
                      onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                      isDisabled={editingPlan !== null}
                    >
                      {patients.map(patient => (
                        <option key={patient.id} value={patient.id}>{patient.name} ({patient.email})</option>
                      ))}
                    </Select>
                  </Box>
                  <Box>
                    <Text fontWeight="semibold" mb={2}>Meal Plan Content</Text>
                    <Textarea 
                      placeholder="Enter meal plan details, dietary guidelines, meal schedules, etc." 
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      rows={10}
                    />
                  </Box>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
                <Button bgGradient="linear(to-r, brand.500, purple.400)" color="white" onClick={handleSubmit}>
                  {editingPlan ? 'Update' : 'Create'}
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Container>
      </Box>
    </Box>
  )
}
