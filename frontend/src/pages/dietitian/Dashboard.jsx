import { Box, Container, Heading, Text, SimpleGrid, VStack, HStack, Input, IconButton, useColorMode, Icon, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Button, useDisclosure, Badge } from '@chakra-ui/react'
import { FaCalendar, FaDollarSign, FaPlus, FaTrash, FaEdit, FaUtensils } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import DietitianSidebar from '../../components/DietitianSidebar'
import BreadcrumbNav from '../../components/Breadcrumb'
import DietitianOnboarding from '../../components/DietitianOnboarding'

export default function DietitianDashboard() {
  const { colorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isOnboardingOpen, onOpen: onOnboardingOpen, onClose: onOnboardingClose } = useDisclosure()
  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem('dietitianChecklist')
    return saved ? JSON.parse(saved) : []
  })
  const [newTask, setNewTask] = useState('')
  const [chargePerAppointment, setChargePerAppointment] = useState(() => {
    return localStorage.getItem('dietitianCharge') || ''
  })
  const [tempCharge, setTempCharge] = useState('')
  const [todayAppointments] = useState(2)
  const [pendingDietPlans] = useState(5)
  const [revenue, setRevenue] = useState(0)

  const breadcrumbItems = [
    { label: 'Dietitian', path: '/dietitian/dashboard' },
    { label: 'Dashboard', path: '/dietitian/dashboard' }
  ]

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenDietitianOnboarding')
    if (!hasSeenOnboarding) {
      onOnboardingOpen()
      localStorage.setItem('hasSeenDietitianOnboarding', 'true')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('dietitianChecklist', JSON.stringify(checklist))
  }, [checklist])

  useEffect(() => {
    if (chargePerAppointment) {
      localStorage.setItem('dietitianCharge', chargePerAppointment)
    }
  }, [chargePerAppointment])

  useEffect(() => {
    const calculateRevenue = () => {
      if (chargePerAppointment) {
        setRevenue(todayAppointments * parseFloat(chargePerAppointment))
      }
    }
    calculateRevenue()
    const interval = setInterval(calculateRevenue, 1200000)
    return () => clearInterval(interval)
  }, [chargePerAppointment, todayAppointments])

  const addTask = () => {
    if (newTask.trim()) {
      setChecklist([...checklist, { id: Date.now(), text: newTask }])
      setNewTask('')
    }
  }

  const deleteTask = (id) => {
    setChecklist(checklist.filter(task => task.id !== id))
  }

  const handleSetCharge = () => {
    setChargePerAppointment(tempCharge)
    onClose()
  }

  return (
    <Box display="flex">
      <DietitianSidebar />
      <DietitianOnboarding isOpen={isOnboardingOpen} onClose={onOnboardingClose} />
      <Box ml="250px" w="calc(100% - 250px)" minH="100vh" bg={colorMode === 'dark' ? '#0b1437' : 'gray.50'}>
        <Container maxW="1200px" py={8}>
          <BreadcrumbNav items={breadcrumbItems} />
          <Heading mb={8}>Dietitian Dashboard</Heading>

          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6} mb={6}>
            <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={6} rounded="xl" shadow="lg" border="1px" borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}>
              <HStack mb={4} p={3} bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'purple.50'} rounded="lg">
                <Icon as={FaCalendar} color="brand.500" boxSize={6} />
                <Heading size="md">Today's Appointments</Heading>
              </HStack>
              <VStack align="start" spacing={2}>
                <Text fontSize="5xl" fontWeight="bold" bgGradient="linear(to-r, brand.500, purple.400)" bgClip="text">{todayAppointments}</Text>
                <Text color="gray.600" fontSize="lg">Scheduled for today</Text>
              </VStack>
            </Box>

            <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={6} rounded="xl" shadow="lg" border="1px" borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}>
              <HStack mb={4} p={3} bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'purple.50'} rounded="lg" justify="space-between">
                <HStack>
                  <Icon as={FaDollarSign} color="brand.500" boxSize={6} />
                  <Heading size="md">Approximate Revenue</Heading>
                </HStack>
                <IconButton icon={<FaEdit />} size="sm" colorScheme="brand" variant="ghost" onClick={onOpen} aria-label="Set charge" />
              </HStack>
              <VStack align="start" spacing={2}>
                <Text fontSize="5xl" fontWeight="bold" bgGradient="linear(to-r, brand.500, purple.400)" bgClip="text">
                  ${revenue.toFixed(2)}
                </Text>
                <Text color="gray.600" fontSize="lg">
                  {chargePerAppointment ? `$${chargePerAppointment} × ${todayAppointments} appointments` : 'Set your charge per appointment'}
                </Text>
              </VStack>
            </Box>

            <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={6} rounded="xl" shadow="lg" border="1px" borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}>
              <HStack mb={4} p={3} bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'purple.50'} rounded="lg">
                <Icon as={FaUtensils} color="brand.500" boxSize={6} />
                <Heading size="md">Pending Diet Plans</Heading>
              </HStack>
              <VStack align="start" spacing={2}>
                <Text fontSize="5xl" fontWeight="bold" bgGradient="linear(to-r, brand.500, purple.400)" bgClip="text">{pendingDietPlans}</Text>
                <Text color="gray.600" fontSize="lg">Awaiting review</Text>
              </VStack>
            </Box>
          </SimpleGrid>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Set Charge Per Appointment</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack align="start" spacing={4}>
                  <Text>Enter the amount you charge per appointment:</Text>
                  <Input 
                    type="number" 
                    placeholder="e.g., 100" 
                    value={tempCharge} 
                    onChange={(e) => setTempCharge(e.target.value)}
                    size="lg"
                  />
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
                <Button bgGradient="linear(to-r, brand.500, purple.400)" color="white" onClick={handleSetCharge}>Save</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={6} rounded="xl" shadow="lg" border="1px" borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}>
            <Heading size="md" mb={6} pb={3} borderBottom="2px" borderColor="brand.500">Reminders</Heading>
            <HStack mb={4}>
              <Input 
                placeholder="Add a reminder..." 
                value={newTask} 
                onChange={(e) => setNewTask(e.target.value)} 
                onKeyPress={(e) => e.key === 'Enter' && addTask()} 
              />
              <IconButton icon={<FaPlus />} colorScheme="brand" onClick={addTask} aria-label="Add task" />
            </HStack>
            <VStack align="stretch" spacing={2}>
              {checklist.map(task => (
                <HStack key={task.id} p={3} bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'gray.50'} rounded="lg" justify="space-between">
                  <Text>{task.text}</Text>
                  <IconButton icon={<FaTrash />} size="sm" colorScheme="red" variant="ghost" onClick={() => deleteTask(task.id)} aria-label="Delete task" />
                </HStack>
              ))}
              {checklist.length === 0 && <Text color="gray.500" textAlign="center">No reminders yet</Text>}
            </VStack>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
