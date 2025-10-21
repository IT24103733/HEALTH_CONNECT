import { Box, Container, Heading, Text, VStack, HStack, Badge, Button, Spinner, useColorMode, Icon, ButtonGroup } from '@chakra-ui/react'
import { FaCalendar, FaUser, FaClock, FaCheck, FaTimes } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { useToast } from '@chakra-ui/react'
import DoctorSidebar from '../../components/DoctorSidebar'
import BreadcrumbNav from '../../components/Breadcrumb'
import { api } from '../../services/api'

export default function PendingAppointments() {
  const { colorMode } = useColorMode()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  const breadcrumbItems = [
    { label: 'Doctor', path: '/doctor/dashboard' },
    { label: 'Pending Appointments', path: '/doctor/pending-appointments' }
  ]

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    try {
      setLoading(true)
      const data = await api.getMyAppointments()
      setAppointments(data.filter(apt => apt.status === 'SCHEDULED').sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime)))
    } catch (error) {
      toast({ title: 'Error loading appointments', description: error.message, status: 'error', duration: 5000, position: 'top' })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.updateAppointmentStatus(id, status)
      toast({ 
        title: `Appointment ${status.toLowerCase()}!`, 
        status: 'success', 
        duration: 3000, 
        position: 'top' 
      })
      await loadAppointments()
    } catch (error) {
      toast({ title: 'Update failed', description: error.message, status: 'error', duration: 5000, position: 'top' })
    }
  }

  return (
    <Box display="flex">
      <DoctorSidebar />
      <Box ml="250px" w="calc(100% - 250px)" minH="100vh" bg={colorMode === 'dark' ? '#0b1437' : 'gray.50'}>
        <Container maxW="1200px" py={8}>
          <BreadcrumbNav items={breadcrumbItems} />
          <Heading mb={8}>Pending Appointments</Heading>

          {loading ? (
            <VStack align="center" justify="center" minH="300px">
              <Spinner size="xl" color="brand.500" />
            </VStack>
          ) : appointments.length === 0 ? (
            <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={8} rounded="xl" shadow="lg" textAlign="center">
              <Icon as={FaCalendar} boxSize={16} color="gray.400" mb={4} />
              <Text fontSize="xl" color="gray.500">No pending appointments</Text>
              <Text color="gray.400" mt={2}>All appointments are up to date</Text>
            </Box>
          ) : (
            <VStack spacing={6} align="stretch">
              {appointments.map((apt) => {
                const aptDate = new Date(apt.scheduledTime)
                return (
                  <Box key={apt.id} bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={6} rounded="xl" shadow="lg" border="1px" borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}>
                    <HStack justify="space-between" mb={4}>
                      <HStack>
                        <Icon as={FaCalendar} color="brand.500" boxSize={6} />
                        <Heading size="md">Appointment</Heading>
                      </HStack>
                      <Badge colorScheme="yellow" fontSize="md" px={3} py={1}>
                        {apt.status}
                      </Badge>
                    </HStack>

                    <VStack align="stretch" spacing={3} mb={4}>
                      <HStack p={3} bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'} rounded="lg">
                        <Icon as={FaUser} color="gray.500" />
                        <Text fontWeight="semibold" color="gray.500">Patient ID:</Text>
                        <Text fontWeight="bold">{apt.patientId}</Text>
                      </HStack>

                      <HStack p={3} bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'} rounded="lg" spacing={6}>
                        <HStack>
                          <Icon as={FaCalendar} color="gray.500" />
                          <Text fontWeight="semibold" color="gray.500">Date:</Text>
                          <Text fontWeight="bold">{aptDate.toLocaleDateString()}</Text>
                        </HStack>
                        <HStack>
                          <Icon as={FaClock} color="gray.500" />
                          <Text fontWeight="semibold" color="gray.500">Time:</Text>
                          <Text fontWeight="bold">{aptDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</Text>
                        </HStack>
                      </HStack>

                      {apt.notes && (
                        <Box p={3} bg={colorMode === 'dark' ? 'whiteAlpha.50' : 'gray.50'} rounded="lg">
                          <Text fontWeight="semibold" color="gray.500" mb={2}>Notes:</Text>
                          <Text>{apt.notes}</Text>
                        </Box>
                      )}
                    </VStack>

                    <ButtonGroup w="full" spacing={4}>
                      <Button 
                        leftIcon={<FaCheck />} 
                        colorScheme="green" 
                        flex={1}
                        onClick={() => handleUpdateStatus(apt.id, 'DONE')}
                      >
                        Mark as Done
                      </Button>
                      <Button 
                        leftIcon={<FaTimes />} 
                        colorScheme="red" 
                        flex={1}
                        onClick={() => handleUpdateStatus(apt.id, 'CANCELLED')}
                      >
                        Cancel
                      </Button>
                    </ButtonGroup>
                  </Box>
                )
              })}
            </VStack>
          )}
        </Container>
      </Box>
    </Box>
  )
}
