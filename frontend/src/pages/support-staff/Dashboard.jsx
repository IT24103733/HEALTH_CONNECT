import { Box, Container, Heading, Text, SimpleGrid, VStack, HStack, Input, IconButton, useColorMode, Icon, useDisclosure } from '@chakra-ui/react'
import { FaCheckCircle, FaPlus, FaTrash } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import SupportStaffSidebar from '../../components/SupportStaffSidebar'
import BreadcrumbNav from '../../components/Breadcrumb'
import SupportStaffOnboarding from '../../components/SupportStaffOnboarding'

export default function SupportStaffDashboard() {
  const { colorMode } = useColorMode()
  const { isOpen: isOnboardingOpen, onOpen: onOnboardingOpen, onClose: onOnboardingClose } = useDisclosure()
  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem('supportStaffChecklist')
    return saved ? JSON.parse(saved) : []
  })
  const [newTask, setNewTask] = useState('')
  const [completedTickets] = useState(24)

  const breadcrumbItems = [
    { label: 'Support Staff', path: '/support-staff/dashboard' },
    { label: 'Dashboard', path: '/support-staff/dashboard' }
  ]

  const bestPractices = [
    'Respond to tickets within 5 minutes',
    'Always maintain a professional and empathetic tone',
    'Document all issues and resolutions clearly',
    'Escalate complex technical issues to admins',
    'Follow up on resolved tickets after 24 hours',
    'Keep your knowledge base updated'
  ]

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenSupportStaffOnboarding')
    if (!hasSeenOnboarding) {
      onOnboardingOpen()
      localStorage.setItem('hasSeenSupportStaffOnboarding', 'true')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('supportStaffChecklist', JSON.stringify(checklist))
  }, [checklist])

  const addTask = () => {
    if (newTask.trim()) {
      setChecklist([...checklist, { id: Date.now(), text: newTask }])
      setNewTask('')
    }
  }

  const deleteTask = (id) => {
    setChecklist(checklist.filter(task => task.id !== id))
  }

  return (
    <Box display="flex">
      <SupportStaffSidebar />
      <SupportStaffOnboarding isOpen={isOnboardingOpen} onClose={onOnboardingClose} />
      <Box ml="250px" w="calc(100% - 250px)" minH="100vh" bg={colorMode === 'dark' ? '#0b1437' : 'gray.50'}>
        <Container maxW="1200px" py={8}>
          <BreadcrumbNav items={breadcrumbItems} />
          <Heading mb={8}>Support Staff Dashboard</Heading>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={6}>
            <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={6} rounded="xl" shadow="lg" border="1px" borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}>
              <HStack mb={4} p={3} bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'purple.50'} rounded="lg">
                <Icon as={FaCheckCircle} color="brand.500" boxSize={6} />
                <Heading size="md">Tickets Completed</Heading>
              </HStack>
              <VStack align="start" spacing={2}>
                <Text fontSize="5xl" fontWeight="bold" bgGradient="linear(to-r, brand.500, purple.400)" bgClip="text">{completedTickets}</Text>
                <Text color="gray.600" fontSize="lg">Total resolved tickets</Text>
              </VStack>
            </Box>

            <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={6} rounded="xl" shadow="lg" border="1px" borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}>
              <Heading size="md" mb={4} pb={3} borderBottom="2px" borderColor="brand.500">Best Practices</Heading>
              <VStack align="stretch" spacing={2}>
                {bestPractices.map((practice, index) => (
                  <HStack key={index} p={2} bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'} rounded="md">
                    <Icon as={FaCheckCircle} color="green.500" boxSize={4} />
                    <Text fontSize="sm">{practice}</Text>
                  </HStack>
                ))}
              </VStack>
            </Box>
          </SimpleGrid>

          <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={6} rounded="xl" shadow="lg" border="1px" borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}>
            <Heading size="md" mb={6} pb={3} borderBottom="2px" borderColor="brand.500">My Checklist</Heading>
            <HStack mb={4}>
              <Input 
                placeholder="Add a task..." 
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
              {checklist.length === 0 && <Text color="gray.500" textAlign="center">No tasks yet</Text>}
            </VStack>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
