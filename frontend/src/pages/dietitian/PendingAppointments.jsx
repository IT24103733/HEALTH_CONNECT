import { Box, Container, Heading, Text, VStack, HStack, useColorMode, Badge, IconButton, Spinner, useToast } from '@chakra-ui/react'
import { FaTimes, FaCheck } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import DietitianSidebar from '../../components/DietitianSidebar'
import BreadcrumbNav from '../../components/Breadcrumb'
import { api } from '../../services/api'

export default function DietitianPendingAppointments() {
  const { colorMode } = useColorMode()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    try {
      setLoading(true)
      const data = await api.getMyAppointments()
      const pending = data.filter(apt => apt.status === 'SCHEDULED').sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime))
      setAppointments(pending)
    } catch (error) {
      toast({ title: 'Error loading appointments', description: error.message, status: 'error', duration: 5000, position: 'top' })
    } finally {
      setLoading(false)
    }
  }

  const breadcrumbItems = [
    { label: 'Dietitian', path: '/dietitian/dashboard' },
    { label: 'Pending Appointments', path: '/dietitian/appointments/pending' }
  ]

  const handleComplete = async (id) => {
    try {
      await api.updateAppointmentStatus(id, 'COMPLETED')
      toast({ title: 'Appointment marked as completed', status: 'success', duration: 3000, position: 'top' })
      await loadAppointments()
    } catch (error) {
      toast({ title: 'Update failed', description: error.message, status: 'error', duration: 5000, position: 'top' })
    }
  }

  const handleCancel = async (id) => {
    try {
      await api.updateAppointmentStatus(id, 'CANCELLED')
      toast({ title: 'Appointment cancelled', status: 'info', duration: 3000, position: 'top' })
      await loadAppointments()
    } catch (error) {
      toast({ title: 'Cancellation failed', description: error.message, status: 'error', duration: 5000, position: 'top' })
    }
  }

  return (
    <Box display="flex">
      <DietitianSidebar />
      <Box ml="250px" w="calc(100% - 250px)" minH="100vh" bg={colorMode === 'dark' ? '#0b1437' : 'gray.50'}>
        <Container maxW="1200px" py={8}>
          <BreadcrumbNav items={breadcrumbItems} />
          <Heading mb={2}>Pending Appointments</Heading>
          <Text color="gray.600" mb={6} fontSize="lg">
            You have <Badge colorScheme="purple" fontSize="lg" px={3} py={1} rounded="full">{appointments.length}</Badge> pending appointments
          </Text>

          {loading ? (
            <VStack py={12}><Spinner size="xl" color="purple.500" /></VStack>
          ) : (
          <VStack spacing={4} align="stretch">
            {appointments.map((apt) => (
              <Box 
                key={apt.id} 
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
                      <Text fontWeight="bold" fontSize="xl">Patient ID: {apt.patientId}</Text>
                      <Badge colorScheme="green">{apt.status}</Badge>
                    </HStack>
                    <HStack spacing={6}>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" color="gray.500">Date & Time</Text>
                        <Text fontWeight="semibold">{new Date(apt.scheduledTime).toLocaleString()}</Text>
                      </VStack>
                    </HStack>
                    {apt.notes && (
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" color="gray.500">Notes</Text>
                        <Text>{apt.notes}</Text>
                      </VStack>
                    )}
                  </VStack>
                  <HStack>
                    <IconButton
                      icon={<FaCheck />}
                      colorScheme="green"
                      size="lg"
                      onClick={() => handleComplete(apt.id)}
                      aria-label="Complete"
                    />
                    <IconButton
                      icon={<FaTimes />}
                      colorScheme="red"
                      variant="ghost"
                      size="lg"
                      onClick={() => handleCancel(apt.id)}
                      aria-label="Cancel"
                    />
                  </HStack>
                </HStack>
              </Box>
            ))}
          </VStack>
          )}
            {!loading && appointments.length === 0 && (
              <Box 
                bg={colorMode === 'dark' ? '#1a2559' : 'white'} 
                p={12} 
                rounded="xl" 
                shadow="md" 
                textAlign="center"
              >
                <Text color="gray.500" fontSize="lg">No pending appointments</Text>
              </Box>
            )}
        </Container>
      </Box>
    </Box>
  )
}
