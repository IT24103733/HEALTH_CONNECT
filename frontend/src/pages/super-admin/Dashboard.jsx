import { Box, Container, Heading, Text, SimpleGrid, VStack, HStack, Input, IconButton, useColorMode, Icon, useDisclosure, Spinner } from '@chakra-ui/react'
import { FaUserCheck, FaPlus, FaTrash, FaCheckCircle } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import SuperAdminSidebar from '../../components/SuperAdminSidebar'
import BreadcrumbNav from '../../components/Breadcrumb'
import SuperAdminOnboarding from '../../components/SuperAdminOnboarding'
import { api } from '../../services/api'

export default function SuperAdminDashboard() {
  const { colorMode } = useColorMode()
  const { isOpen: isOnboardingOpen, onOpen: onOnboardingOpen, onClose: onOnboardingClose } = useDisclosure()
  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem('superAdminChecklist')
    return saved ? JSON.parse(saved) : []
  })
  const [newTask, setNewTask] = useState('')
  const [activeUsers, setActiveUsers] = useState(0)
  const [loading, setLoading] = useState(true)

  const breadcrumbItems = [
    { label: 'Super Admin', path: '/super-admin/dashboard' },
    { label: 'Dashboard', path: '/super-admin/dashboard' }
  ]

  const quickChecklist = [
    'Review compliance logs daily',
    'Monitor system security and access patterns',
    'Approve critical system changes',
    'Coordinate with cybersecurity manager',
    'Oversee admin operations and escalations',
    'Ensure regulatory compliance standards'
  ]

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenSuperAdminOnboarding')
    if (!hasSeenOnboarding) {
      onOnboardingOpen()
      localStorage.setItem('hasSeenSuperAdminOnboarding', 'true')
    }
    loadUserCount()
  }, [])

  const loadUserCount = async () => {
    try {
      const activeCount = await api.getActiveUsersCount()
      setActiveUsers(activeCount.activeUsers || 0)
    } catch (error) {
      console.error('Failed to load user count:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    localStorage.setItem('superAdminChecklist', JSON.stringify(checklist))
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
      <SuperAdminSidebar />
      <SuperAdminOnboarding isOpen={isOnboardingOpen} onClose={onOnboardingClose} />
      <Box ml="250px" w="calc(100% - 250px)" minH="100vh" bg={colorMode === 'dark' ? '#0b1437' : 'gray.50'}>
        <Container maxW="1200px" py={8}>
          <BreadcrumbNav items={breadcrumbItems} />
          <Heading mb={8}>Super Admin Dashboard</Heading>

          <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={6} rounded="xl" shadow="lg" border="2px" borderColor="purple.500" mb={6}>
            <HStack mb={4} p={3} bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'purple.50'} rounded="lg">
              <Icon as={FaUserCheck} color="purple.500" boxSize={6} />
              <Heading size="md">Active Users</Heading>
            </HStack>
            <VStack align="start" spacing={2}>
              {loading ? (
                <Spinner size="xl" color="purple.500" />
              ) : (
                <>
                  <Text fontSize="5xl" fontWeight="bold" bgGradient="linear(to-r, purple.500, pink.400)" bgClip="text">{activeUsers}</Text>
                  <Text color="gray.600" fontSize="lg">(including yourself)</Text>
                </>
              )}
            </VStack>
          </Box>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={6} rounded="xl" shadow="lg" border="1px" borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}>
              <Heading size="md" mb={4} pb={3} borderBottom="2px" borderColor="purple.500">Quick Checklist</Heading>
              <VStack align="stretch" spacing={2}>
                {quickChecklist.map((item, index) => (
                  <HStack key={index} p={2} bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'} rounded="md">
                    <Icon as={FaCheckCircle} color="purple.500" boxSize={4} />
                    <Text fontSize="sm">{item}</Text>
                  </HStack>
                ))}
              </VStack>
            </Box>

            <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={6} rounded="xl" shadow="lg" border="1px" borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}>
              <Heading size="md" mb={6} pb={3} borderBottom="2px" borderColor="purple.500">My Tasks</Heading>
              <HStack mb={4}>
                <Input 
                  placeholder="Add a task..." 
                  value={newTask} 
                  onChange={(e) => setNewTask(e.target.value)} 
                  onKeyPress={(e) => e.key === 'Enter' && addTask()} 
                />
                <IconButton icon={<FaPlus />} colorScheme="purple" onClick={addTask} aria-label="Add task" />
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
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  )
}
