import { Box, Container, Heading, Text, VStack, HStack, useColorMode, Badge, Spinner, useToast } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import DoctorSidebar from '../../components/DoctorSidebar'
import BreadcrumbNav from '../../components/Breadcrumb'
import { api } from '../../services/api'

export default function PastAppointments() {
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
      const past = data.filter(apt => apt.status === 'DONE' || apt.status === 'CANCELLED').sort((a, b) => new Date(b.scheduledTime) - new Date(a.scheduledTime))
      setAppointments(past)
    } catch (error) {
      toast({ title: 'Error loading appointments', description: error.message, status: 'error', duration: 5000, position: 'top' })
    } finally {
      setLoading(false)
    }
  }

  const breadcrumbItems = [
    { label: 'Doctor', path: '/doctor/dashboard' },
    { label: 'Past Appointments', path: '/doctor/appointments/past' }
  ]

  return (
    <Box display="flex">
      <DoctorSidebar />
      <Box ml="250px" w="calc(100% - 250px)" minH="100vh" bg={colorMode === 'dark' ? '#0b1437' : 'gray.50'}>
        <Container maxW="1200px" py={8}>
          <BreadcrumbNav items={breadcrumbItems} />
          <Heading mb={6}>Past Appointments</Heading>

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
                <VStack align="start" spacing={3}>
                  <HStack>
                    <Text fontWeight="bold" fontSize="xl">Patient ID: {apt.patientId}</Text>
                    <Badge colorScheme={apt.status === 'COMPLETED' ? 'blue' : 'red'}>{apt.status}</Badge>
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
              </Box>
            ))}
          </VStack>
          )}
          {!loading && appointments.length === 0 && (
            <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={12} rounded="xl" shadow="md" textAlign="center">
              <Text color="gray.500" fontSize="lg">No past appointments</Text>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  )
}
