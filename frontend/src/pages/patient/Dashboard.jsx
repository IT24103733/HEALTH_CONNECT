import { Box, Container, Heading, Text, SimpleGrid, VStack, HStack, Button, useColorMode, Icon, Input, Textarea, IconButton, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Select, Spinner, useToast } from '@chakra-ui/react'
import { FaCalendar, FaChartLine, FaPlus, FaTrash, FaEdit } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import BreadcrumbNav from '../../components/Breadcrumb'
import Onboarding from '../../components/Onboarding'
import { api } from '../../services/api'
import { getCurrentUser } from '../../services/auth'

export default function Dashboard() {
  const { colorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isHealthModalOpen, onOpen: onHealthModalOpen, onClose: onHealthModalClose } = useDisclosure()
  const [checklist, setChecklist] = useState([])
  const [newTask, setNewTask] = useState('')
  const [selectedDate, setSelectedDate] = useState(null)
  const [healthData, setHealthData] = useState({
    date: '',
    caloriesIntake: '',
    exerciseMinutes: '',
    weight: '',
    sleepHours: '',
    waterIntake: '',
    symptoms: ''
  })
  const [dailyMetrics, setDailyMetrics] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()
  const user = getCurrentUser()

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding')
    if (!hasSeenOnboarding) {
      onOpen()
      localStorage.setItem('hasSeenOnboarding', 'true')
    }
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const metricsData = await api.getUserHealthMetrics(user.id)
      setDailyMetrics(metricsData)
      
      try {
        const appointmentsData = await api.getMyAppointments()
        setAppointments(appointmentsData.filter(apt => apt.status === 'SCHEDULED'))
      } catch (aptError) {
        setAppointments([])
      }
    } catch (error) {
      toast({ title: 'Error loading data', description: error.message, status: 'error', duration: 5000, position: 'top' })
    } finally {
      setLoading(false)
    }
  }

  const addTask = () => {
    if (newTask.trim()) {
      setChecklist([...checklist, { id: Date.now(), text: newTask }])
      setNewTask('')
    }
  }

  const deleteTask = (id) => {
    setChecklist(checklist.filter(task => task.id !== id))
  }

  const validateHealthData = () => {
    const calories = parseInt(healthData.caloriesIntake)
    const exercise = parseInt(healthData.exerciseMinutes)
    const weight = parseFloat(healthData.weight)
    const sleep = parseInt(healthData.sleepHours)
    const water = parseInt(healthData.waterIntake)

    if (healthData.caloriesIntake && (calories < 0 || calories > 10000)) {
      toast({ title: 'Invalid Calories', description: 'Calories must be between 0 and 10,000', status: 'error', duration: 5000, position: 'top' })
      return false
    }
    if (healthData.exerciseMinutes && (exercise < 0 || exercise > 1440)) {
      toast({ title: 'Invalid Exercise', description: 'Exercise minutes must be between 0 and 1,440 (24 hours)', status: 'error', duration: 5000, position: 'top' })
      return false
    }
    if (healthData.weight && (weight < 1 || weight > 500)) {
      toast({ title: 'Invalid Weight', description: 'Weight must be between 1 and 500 kg', status: 'error', duration: 5000, position: 'top' })
      return false
    }
    if (healthData.sleepHours && (sleep < 0 || sleep > 24)) {
      toast({ title: 'Invalid Sleep', description: 'Sleep hours must be between 0 and 24', status: 'error', duration: 5000, position: 'top' })
      return false
    }
    if (healthData.waterIntake && (water < 0 || water > 20000)) {
      toast({ title: 'Invalid Water Intake', description: 'Water intake must be between 0 and 20,000 ml', status: 'error', duration: 5000, position: 'top' })
      return false
    }
    return true
  }

  const handleHealthSubmit = async () => {
    if (!validateHealthData()) return

    try {
      await api.logHealthMetric({
        userId: user.id,
        date: healthData.date,
        caloriesIntake: parseInt(healthData.caloriesIntake) || null,
        exerciseMinutes: parseInt(healthData.exerciseMinutes) || null,
        weight: parseFloat(healthData.weight) || null,
        sleepHours: parseInt(healthData.sleepHours) || null,
        waterIntake: parseInt(healthData.waterIntake) || null,
        symptoms: healthData.symptoms || null
      })
      toast({ title: 'Health metric saved!', status: 'success', duration: 3000, position: 'top' })
      await loadData()
      onHealthModalClose()
      setHealthData({ date: '', caloriesIntake: '', exerciseMinutes: '', weight: '', sleepHours: '', waterIntake: '', symptoms: '' })
    } catch (error) {
      toast({ title: 'Save failed', description: error.message, status: 'error', duration: 5000, position: 'top' })
    }
  }

  const handleAddMetric = (date = null) => {
    setSelectedDate(date || new Date().toISOString().split('T')[0])
    setHealthData({ date: date || new Date().toISOString().split('T')[0], caloriesIntake: '', exerciseMinutes: '', weight: '', sleepHours: '', waterIntake: '', symptoms: '' })
    onHealthModalOpen()
  }

  const handleDeleteMetric = (date) => {
    setDailyMetrics(dailyMetrics.filter(m => m.date !== date))
  }

  const getWeeklyAverage = () => {
    if (dailyMetrics.length === 0) return '--'
    const recentMetrics = dailyMetrics.slice(0, 7)
    const sum = recentMetrics.reduce((acc, m) => acc + (m.healthScore || 0), 0)
    return Math.round(sum / recentMetrics.length)
  }

  const breadcrumbItems = [
    { label: 'Patient', path: '/patient/dashboard' },
    { label: 'Dashboard', path: '/patient/dashboard' }
  ]

  return (
    <Box display="flex">
      <Sidebar />
      <Onboarding isOpen={isOpen} onClose={onClose} />
      <Box ml="250px" w="calc(100% - 250px)" minH="100vh" bg={colorMode === 'dark' ? '#0b1437' : 'gray.50'}>
        <Container maxW="1200px" py={8}>
          <BreadcrumbNav items={breadcrumbItems} />
          <Heading mb={8}>Dashboard</Heading>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={6}>
            <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={6} rounded="xl" shadow="lg" border="1px" borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'} _hover={{ shadow: 'xl', transform: 'translateY(-2px)' }} transition="all 0.3s">
              <HStack mb={4} p={3} bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'purple.50'} rounded="lg">
                <Icon as={FaCalendar} color="brand.500" boxSize={6} />
                <Heading size="md">Next Appointment</Heading>
              </HStack>
              {loading ? (
                <VStack align="center" justify="center" minH="150px"><Spinner color="brand.500" /></VStack>
              ) : (() => {
                const nextApt = appointments.length > 0 ? appointments.sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime))[0] : null
                const aptDate = nextApt ? new Date(nextApt.scheduledTime) : null
                return nextApt ? (
                  <VStack align="start" spacing={3}>
                    <HStack w="100%" p={3} bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'} rounded="lg">
                      <Text fontWeight="semibold" color="gray.500">Clinician ID:</Text>
                      <Text fontWeight="bold">{nextApt.clinicianId}</Text>
                    </HStack>
                    <HStack w="100%" p={3} bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'} rounded="lg">
                      <Text fontWeight="semibold" color="gray.500">Date:</Text>
                      <Text fontWeight="bold">{aptDate.toLocaleDateString()}</Text>
                    </HStack>
                    <HStack w="100%" p={3} bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'} rounded="lg">
                      <Text fontWeight="semibold" color="gray.500">Time:</Text>
                      <Text fontWeight="bold">{aptDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</Text>
                    </HStack>
                  </VStack>
                ) : (
                  <VStack align="center" justify="center" minH="150px">
                    <Text color="gray.500" fontSize="lg">No upcoming appointments</Text>
                  </VStack>
                )
              })()}
            </Box>

            <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={6} rounded="xl" shadow="lg" border="1px" borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'} _hover={{ shadow: 'xl', transform: 'translateY(-2px)' }} transition="all 0.3s">
              <HStack mb={4} p={3} bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'purple.50'} rounded="lg">
                <Icon as={FaChartLine} color="brand.500" boxSize={6} />
                <Heading size="md">Health Score Trend</Heading>
              </HStack>
              <VStack align="start" spacing={2}>
                <Text fontSize="5xl" fontWeight="bold" bgGradient="linear(to-r, brand.500, purple.400)" bgClip="text">{getWeeklyAverage()}</Text>
                <Text color="gray.600" fontSize="lg">Weekly Average</Text>
              </VStack>
            </Box>
          </SimpleGrid>

          <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={6} rounded="xl" shadow="lg" border="1px" borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'} mb={6}>
            <Heading size="md" mb={6} pb={3} borderBottom="2px" borderColor="brand.500">Daily Health Metrics</Heading>
            <HStack spacing={4} mb={6} overflowX="auto" pb={2}>
              {dailyMetrics.map((item) => (
                <VStack key={item.date} minW="120px" p={4} bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'gray.50'} rounded="lg" border="2px" borderColor="brand.500">
                  <Text fontSize="xs" color="gray.600">{new Date(item.date).toLocaleDateString()}</Text>
                  <Text fontSize="3xl" fontWeight="bold" color="brand.500">{item.healthScore}</Text>
                  <HStack spacing={2}>
                    <IconButton icon={<FaEdit />} size="xs" colorScheme="brand" variant="ghost" onClick={() => handleAddMetric(item.date)} aria-label="Edit" />
                    <IconButton icon={<FaTrash />} size="xs" colorScheme="red" variant="ghost" onClick={() => handleDeleteMetric(item.date)} aria-label="Delete" />
                  </HStack>
                </VStack>
              ))}
              <VStack minW="120px" p={4} bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.100'} rounded="lg" border="2px" borderColor="gray.400" borderStyle="dashed" cursor="pointer" onClick={() => handleAddMetric()} _hover={{ borderColor: 'brand.500' }}>
                <Icon as={FaPlus} boxSize={8} color="gray.400" />
                <Text fontSize="sm" color="gray.600">Add Today</Text>
              </VStack>
            </HStack>
          </Box>

          <Modal isOpen={isHealthModalOpen} onClose={onHealthModalClose} size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Health Data - {selectedDate}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack align="start" mb={4}>
                  <Text fontWeight="semibold">Date</Text>
                  <Input type="date" value={healthData.date} onChange={(e) => setHealthData({...healthData, date: e.target.value})} />
                </VStack>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
                  <VStack align="start">
                    <Text fontWeight="semibold">Calories Intake</Text>
                    <Input type="number" placeholder="2000" value={healthData.caloriesIntake} onChange={(e) => setHealthData({...healthData, caloriesIntake: e.target.value})} />
                  </VStack>
                  <VStack align="start">
                    <Text fontWeight="semibold">Exercise (minutes)</Text>
                    <Input type="number" placeholder="30" value={healthData.exerciseMinutes} onChange={(e) => setHealthData({...healthData, exerciseMinutes: e.target.value})} />
                  </VStack>
                  <VStack align="start">
                    <Text fontWeight="semibold">Weight (kg)</Text>
                    <Input type="number" placeholder="70" value={healthData.weight} onChange={(e) => setHealthData({...healthData, weight: e.target.value})} />
                  </VStack>
                  <VStack align="start">
                    <Text fontWeight="semibold">Sleep (hours)</Text>
                    <Input type="number" placeholder="8" value={healthData.sleepHours} onChange={(e) => setHealthData({...healthData, sleepHours: e.target.value})} />
                  </VStack>
                  <VStack align="start">
                    <Text fontWeight="semibold">Water Intake (ml)</Text>
                    <Input type="number" placeholder="2500" value={healthData.waterIntake} onChange={(e) => setHealthData({...healthData, waterIntake: e.target.value})} />
                  </VStack>
                </SimpleGrid>
                <VStack align="start">
                  <Text fontWeight="semibold">Symptoms</Text>
                  <Textarea placeholder="Any symptoms..." value={healthData.symptoms} onChange={(e) => setHealthData({...healthData, symptoms: e.target.value})} />
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onHealthModalClose}>Cancel</Button>
                <Button bgGradient="linear(to-r, brand.500, purple.400)" color="white" onClick={handleHealthSubmit}>Save</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={6} rounded="xl" shadow="lg" border="1px" borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}>
            <Heading size="md" mb={6} pb={3} borderBottom="2px" borderColor="brand.500">Checklist</Heading>
            <HStack mb={4}>
              <Input placeholder="Add a task..." value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addTask()} />
              <IconButton icon={<FaPlus />} colorScheme="brand" onClick={addTask} aria-label="Add task" />
            </HStack>
            <VStack align="stretch" spacing={2}>
              {checklist.map(task => (
                <HStack key={task.id} p={3} bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'gray.50'} rounded="lg" justify="space-between">
                  <Text>{task.text}</Text>
                  <IconButton icon={<FaTrash />} size="sm" colorScheme="red" variant="ghost" onClick={() => deleteTask(task.id)} aria-label="Delete task" />
                </HStack>
              ))}
              {checklist.length === 0 && <Text color="gray.500" textAlign="center">No tasks yet</Text>}
            </VStack>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
