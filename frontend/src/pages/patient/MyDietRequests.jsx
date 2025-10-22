import { Box, Container, Heading, VStack, HStack, Text, Button, useColorMode, Badge, Spinner, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Input, Textarea, FormControl, FormLabel, Select, useDisclosure } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import Sidebar from '../../components/Sidebar'
import BreadcrumbNav from '../../components/Breadcrumb'
import { api } from '../../services/api'

export default function MyDietRequests() {
  const { colorMode } = useColorMode()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingRequest, setEditingRequest] = useState(null)
  const [formData, setFormData] = useState({})
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      setLoading(true)
      const data = await api.getMyDietRequests()
      setRequests(data)
    } catch (error) {
      toast({ title: 'Error loading requests', description: error.message, status: 'error', duration: 3000, position: 'top' })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (request) => {
    setEditingRequest(request)
    setFormData({
      weight: request.weight,
      height: request.height,
      dietaryRestrictions: request.dietaryRestrictions,
      healthGoals: request.healthGoals,
      activityLevel: request.activityLevel
    })
    onOpen()
  }

  const handleUpdate = async () => {
    try {
      await api.updateDietRequest(editingRequest.id, {
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        dietaryRestrictions: formData.dietaryRestrictions,
        healthGoals: formData.healthGoals,
        activityLevel: formData.activityLevel
      })
      toast({ title: 'Request updated successfully', status: 'success', duration: 3000, position: 'top' })
      onClose()
      loadRequests()
    } catch (error) {
      toast({ title: 'Update failed', description: error.message, status: 'error', duration: 3000, position: 'top' })
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await api.deleteDietRequest(id)
        toast({ title: 'Request deleted successfully', status: 'success', duration: 3000, position: 'top' })
        loadRequests()
      } catch (error) {
        toast({ title: 'Delete failed', description: error.message, status: 'error', duration: 3000, position: 'top' })
      }
    }
  }

  const breadcrumbItems = [
    { label: 'Patient', path: '/patient/dashboard' },
    { label: 'My Diet Requests', path: '/patient/my-diet-requests' }
  ]

  return (
    <Box display="flex">
      <Sidebar />
      <Box ml="250px" w="calc(100% - 250px)" minH="100vh" bg={colorMode === 'dark' ? '#0b1437' : 'gray.50'}>
        <Container maxW="1200px" py={8}>
          <BreadcrumbNav items={breadcrumbItems} />
          <Heading mb={6}>My Diet Plan Requests</Heading>

          {loading ? (
            <VStack py={12}><Spinner size="xl" color="brand.500" /></VStack>
          ) : requests.length === 0 ? (
            <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={8} rounded="xl" shadow="md" textAlign="center">
              <Text color="gray.500">No diet plan requests found</Text>
            </Box>
          ) : (
            <VStack spacing={4} align="stretch">
              {requests.map((request) => (
                <Box
                  key={request.id}
                  bg={colorMode === 'dark' ? '#1a2559' : 'white'}
                  p={6}
                  rounded="xl"
                  shadow="md"
                >
                  <HStack justify="space-between" align="start">
                    <VStack align="start" spacing={2} flex={1}>
                      <HStack>
                        <Text fontWeight="bold" fontSize="lg">Request #{request.id}</Text>
                        <Badge colorScheme={request.status === 'PENDING' ? 'orange' : 'green'}>{request.status}</Badge>
                      </HStack>
                      <Text><strong>Age:</strong> {request.age} | <strong>Weight:</strong> {request.weight}kg | <strong>Height:</strong> {request.height}cm</Text>
                      <Text><strong>Activity Level:</strong> {request.activityLevel}</Text>
                      <Text><strong>Dietary Restrictions:</strong> {request.dietaryRestrictions}</Text>
                      <Text><strong>Health Goals:</strong> {request.healthGoals}</Text>
                      <Text fontSize="sm" color="gray.500">Created: {new Date(request.createdAt).toLocaleDateString()}</Text>
                    </VStack>
                    {request.status === 'PENDING' && (
                      <HStack>
                        <Button leftIcon={<FaEdit />} colorScheme="blue" size="sm" onClick={() => handleEdit(request)}>
                          Edit
                        </Button>
                        <Button leftIcon={<FaTrash />} colorScheme="red" size="sm" onClick={() => handleDelete(request.id)}>
                          Delete
                        </Button>
                      </HStack>
                    )}
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
        </Container>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg={colorMode === 'dark' ? '#1a2559' : 'white'}>
          <ModalHeader>Edit Diet Plan Request</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Weight (kg)</FormLabel>
                <Input value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} />
              </FormControl>
              <FormControl>
                <FormLabel>Height (cm)</FormLabel>
                <Input value={formData.height} onChange={(e) => setFormData({...formData, height: e.target.value})} />
              </FormControl>
              <FormControl>
                <FormLabel>Dietary Restrictions</FormLabel>
                <Textarea value={formData.dietaryRestrictions} onChange={(e) => setFormData({...formData, dietaryRestrictions: e.target.value})} />
              </FormControl>
              <FormControl>
                <FormLabel>Health Goals</FormLabel>
                <Textarea value={formData.healthGoals} onChange={(e) => setFormData({...formData, healthGoals: e.target.value})} />
              </FormControl>
              <FormControl>
                <FormLabel>Activity Level</FormLabel>
                <Select value={formData.activityLevel} onChange={(e) => setFormData({...formData, activityLevel: e.target.value})}>
                  <option value="SEDENTARY">Sedentary</option>
                  <option value="LIGHT">Light</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="ACTIVE">Active</option>
                  <option value="VERY_ACTIVE">Very Active</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
            <Button colorScheme="blue" onClick={handleUpdate}>Update</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
