import { Box, Container, Heading, Text, SimpleGrid, VStack, HStack, Button, useColorMode, Icon, Input, Select, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Avatar, Badge, IconButton, useToast, Spinner, Alert, AlertIcon } from '@chakra-ui/react'
import { FaCalendar, FaUserMd, FaEdit, FaTrash, FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import BreadcrumbNav from '../../components/Breadcrumb'
import { api } from '../../services/api'

export default function Appointments() {
  const { colorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const [selectedClinician, setSelectedClinician] = useState(null)
  const [appointmentData, setAppointmentData] = useState({ date: '', time: '', clinicianId: null })
  const [editingId, setEditingId] = useState(null)

  const [clinicians, setClinicians] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [checkingConflict, setCheckingConflict] = useState(false)
  const [hasConflict, setHasConflict] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [cliniciansData, appointmentsData] = await Promise.all([
        api.getDoctors(),
        api.getMyAppointments()
      ])
      setClinicians(cliniciansData)
      setAppointments(appointmentsData)
    } catch (error) {
      toast({ title: 'Error loading data', description: error.message, status: 'error', duration: 5000, position: 'top' })
    } finally {
      setLoading(false)
    }
  }

  const handleBookAppointment = (clinician) => {
    setSelectedClinician(clinician)
    setEditingId(null)
    setAppointmentData({ date: '', time: '', clinicianId: clinician.id })
    setHasConflict(false)
    onOpen()
  }

  const handleEditAppointment = (appointment) => {
    const aptDate = new Date(appointment.scheduledTime)
    const date = aptDate.toISOString().split('T')[0]
    const time = aptDate.toTimeString().slice(0, 5)
    
    setEditingId(appointment.id)
    setSelectedClinician(clinicians.find(c => c.id === appointment.clinicianId))
    setAppointmentData({ date, time, clinicianId: appointment.clinicianId })
    setHasConflict(false)
    onOpen()
  }

  const checkConflict = async (date, time, clinicianId) => {
    if (!date || !time || !clinicianId) return
    
    try {
      setCheckingConflict(true)
      const scheduledTime = `${date}T${time}:00`
      const result = await api.checkAppointmentConflict(clinicianId, scheduledTime)
      setHasConflict(result.hasConflict)
    } catch (error) {
      console.error('Conflict check failed:', error)
    } finally {
      setCheckingConflict(false)
    }
  }

  const handleSaveAppointment = async () => {
    if (!appointmentData.date || !appointmentData.time) {
      toast({ title: 'Missing fields', description: 'Please fill in all fields', status: 'error', duration: 3000, position: 'top' })
      return
    }

    if (hasConflict) {
      toast({ title: 'Time slot unavailable', description: 'Please select a different time', status: 'error', duration: 3000, position: 'top' })
      return
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selectedDate = new Date(appointmentData.date)
    const fourMonthsLater = new Date()
    fourMonthsLater.setMonth(fourMonthsLater.getMonth() + 4)

    if (selectedDate <= today) {
      toast({ title: 'Invalid date', description: 'Please select a future date', status: 'error', duration: 3000, position: 'top' })
      return
    }

    if (selectedDate > fourMonthsLater) {
      toast({ title: 'Date too far', description: 'Appointments can only be booked within 4 months', status: 'error', duration: 3000, position: 'top' })
      return
    }

    try {
      const scheduledTime = `${appointmentData.date}T${appointmentData.time}:00`
      if (editingId) {
        await api.updateAppointment(editingId, scheduledTime)
        toast({ title: 'Appointment updated!', status: 'success', duration: 3000, position: 'top' })
      } else {
        await api.scheduleAppointment(appointmentData.clinicianId, scheduledTime, '')
        toast({ title: 'Appointment booked!', status: 'success', duration: 3000, position: 'top' })
      }
      await loadData()
      onClose()
    } catch (error) {
      toast({ title: editingId ? 'Update failed' : 'Booking failed', description: error.message, status: 'error', duration: 5000, position: 'top' })
    }
  }

  const handleDeleteAppointment = async (id) => {
    try {
      await api.cancelAppointment(id)
      toast({ title: 'Appointment cancelled', status: 'info', duration: 3000, position: 'top' })
      await loadData()
    } catch (error) {
      toast({ title: 'Cancellation failed', description: error.message, status: 'error', duration: 5000, position: 'top' })
    }
  }

  const breadcrumbItems = [
    { label: 'Patient', path: '/patient/dashboard' },
    { label: 'Book Appointment', path: '/patient/appointments' }
  ]

  return (
    <Box display="flex">
      <Sidebar />
      <Box ml="250px" w="calc(100% - 250px)" minH="100vh" bg={colorMode === 'dark' ? '#0b1437' : 'gray.50'}>
        <Container maxW="1200px" py={8}>
          <BreadcrumbNav items={breadcrumbItems} />
          <Heading mb={8}>Book Appointment</Heading>

          <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={6} rounded="xl" shadow="lg" border="1px" borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'} mb={6}>
            <Heading size="md" mb={6} pb={3} borderBottom="2px" borderColor="brand.500">Available Clinicians</Heading>
            {loading ? (
              <VStack py={8}><Spinner size="xl" color="brand.500" /></VStack>
            ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {clinicians.map((clinician) => (
                <Box key={clinician.id} p={6} bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'gray.50'} rounded="xl" border="2px" borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'} _hover={{ borderColor: 'brand.500', transform: 'translateY(-4px)', shadow: 'xl' }} transition="all 0.3s">
                  <VStack spacing={4}>
                    <Avatar name={clinician.name} bg="brand.500" color="white" size="xl" />
                    <VStack spacing={1}>
                      <Text fontWeight="bold" fontSize="lg">{clinician.name}</Text>
                      {clinician.specialty && <Text color="gray.600" fontSize="sm">{clinician.specialty}</Text>}
                      <Badge colorScheme={clinician.role === 'DOCTOR' ? 'purple' : 'green'} fontSize="sm">{clinician.role}</Badge>
                    </VStack>
                    <Button bgGradient="linear(to-r, brand.500, purple.400)" color="white" size="sm" w="100%" onClick={() => handleBookAppointment(clinician)}>
                      Book Appointment
                    </Button>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
            )}
          </Box>

          <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={6} rounded="xl" shadow="lg" border="1px" borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}>
            <Heading size="md" mb={6} pb={3} borderBottom="2px" borderColor="brand.500">My Appointments</Heading>
            {loading ? (
              <VStack py={8}><Spinner size="xl" color="brand.500" /></VStack>
            ) : appointments.length === 0 ? (
              <Text color="gray.500" textAlign="center" py={8}>No appointments scheduled</Text>
            ) : (
              <VStack spacing={4} align="stretch">
                {appointments.map((apt) => {
                  const clinician = clinicians.find(c => c.id === apt.clinicianId)
                  const aptDate = new Date(apt.scheduledTime)
                  return (
                    <Box key={apt.id} p={6} bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'purple.50'} rounded="xl" border="2px" borderColor={apt.status === 'CANCELLED' ? 'red.500' : 'brand.500'} _hover={{ shadow: 'xl', transform: 'translateY(-2px)' }} transition="all 0.3s">
                      <HStack justify="space-between" mb={4}>
                        <HStack spacing={4}>
                          <Avatar name={clinician?.name} bg="brand.500" size="lg" />
                          <VStack align="start" spacing={1}>
                            <HStack>
                              <Text fontWeight="bold" fontSize="xl">{clinician?.name}</Text>
                              {apt.status === 'CANCELLED' && <Badge colorScheme="red" fontSize="sm">CANCELLED</Badge>}
                            </HStack>
                            {clinician && (
                              <>
                                {clinician.specialty && <Text fontSize="sm" color="gray.600">{clinician.specialty}</Text>}
                                <Badge colorScheme={clinician.role === 'DOCTOR' ? 'purple' : 'green'} fontSize="xs">{clinician.role}</Badge>
                              </>
                            )}
                          </VStack>
                        </HStack>
                        {apt.status === 'SCHEDULED' && (
                          <HStack spacing={2}>
                            <IconButton icon={<FaEdit />} colorScheme="blue" size="lg" onClick={() => handleEditAppointment(apt)} aria-label="Edit" />
                            <IconButton icon={<FaTrash />} colorScheme="red" size="lg" onClick={() => handleDeleteAppointment(apt.id)} aria-label="Delete" />
                          </HStack>
                        )}
                      </HStack>
                      <SimpleGrid columns={2} spacing={4}>
                        <HStack p={3} bg={colorMode === 'dark' ? 'whiteAlpha.200' : 'white'} rounded="lg">
                          <Icon as={FaCalendar} color="brand.500" boxSize={5} />
                          <VStack align="start" spacing={0}>
                            <Text fontSize="xs" color="gray.500">Date</Text>
                            <Text fontWeight="bold">{aptDate.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</Text>
                          </VStack>
                        </HStack>
                        <HStack p={3} bg={colorMode === 'dark' ? 'whiteAlpha.200' : 'white'} rounded="lg">
                          <Icon as={FaClock} color="brand.500" boxSize={5} />
                          <VStack align="start" spacing={0}>
                            <Text fontSize="xs" color="gray.500">Time</Text>
                            <Text fontWeight="bold">{aptDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</Text>
                          </VStack>
                        </HStack>
                      </SimpleGrid>
                    </Box>
                  )
                })}
              </VStack>
            )}
          </Box>
        </Container>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingId ? 'Edit' : 'Book'} Appointment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              {selectedClinician && (
                <HStack w="100%" p={4} bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'purple.50'} rounded="lg">
                  <Avatar name={selectedClinician.name} bg="brand.500" size="md" />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold">{selectedClinician.name}</Text>
                    {selectedClinician.specialty && <Text fontSize="sm" color="gray.600">{selectedClinician.specialty}</Text>}
                    <Badge colorScheme={selectedClinician.role === 'DOCTOR' ? 'purple' : 'green'} fontSize="xs">{selectedClinician.role}</Badge>
                  </VStack>
                </HStack>
              )}
              <VStack align="start" w="100%">
                <Text fontWeight="semibold">Date</Text>
                <Input 
                  type="date" 
                  value={appointmentData.date} 
                  onChange={(e) => {
                    setAppointmentData({...appointmentData, date: e.target.value})
                    if (e.target.value && appointmentData.time) {
                      checkConflict(e.target.value, appointmentData.time, appointmentData.clinicianId)
                    }
                  }} 
                  min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                  max={(() => {
                    const maxDate = new Date()
                    maxDate.setMonth(maxDate.getMonth() + 4)
                    return maxDate.toISOString().split('T')[0]
                  })()}
                />
                <Text fontSize="xs" color="gray.500">Appointments can be booked up to 4 months in advance</Text>
              </VStack>
              <VStack align="start" w="100%">
                <Text fontWeight="semibold">Time</Text>
                <Input 
                  type="time" 
                  value={appointmentData.time} 
                  onChange={(e) => {
                    setAppointmentData({...appointmentData, time: e.target.value})
                    if (appointmentData.date && e.target.value) {
                      checkConflict(appointmentData.date, e.target.value, appointmentData.clinicianId)
                    }
                  }} 
                />
              </VStack>
              {checkingConflict && (
                <Alert status="info" rounded="md">
                  <AlertIcon />
                  <Text fontSize="sm">Checking availability...</Text>
                </Alert>
              )}
              {!checkingConflict && appointmentData.date && appointmentData.time && hasConflict && (
                <Alert status="error" rounded="md">
                  <AlertIcon as={FaExclamationTriangle} />
                  <Text fontSize="sm">This time slot is unavailable. Please select a different time.</Text>
                </Alert>
              )}
              {!checkingConflict && appointmentData.date && appointmentData.time && !hasConflict && (
                <Alert status="success" rounded="md">
                  <AlertIcon as={FaCheckCircle} />
                  <Text fontSize="sm">Time slot is available!</Text>
                </Alert>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
            <Button bgGradient="linear(to-r, brand.500, purple.400)" color="white" onClick={handleSaveAppointment}>
              {editingId ? 'Update' : 'Book'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
