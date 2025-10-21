import { Box, Container, Heading, Text, SimpleGrid, VStack, HStack, Button, useColorMode, Icon, Link, Input, Textarea, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, useToast } from '@chakra-ui/react'
import { FaPhone, FaEnvelope, FaComments, FaAmbulance, FaHospital } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import BreadcrumbNav from '../../components/Breadcrumb'
import { api } from '../../services/api'

export default function Support() {
  const { colorMode } = useColorMode()
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const [ticketData, setTicketData] = useState({ subject: '', description: '' })

  const breadcrumbItems = [
    { label: 'Patient', path: '/patient/dashboard' },
    { label: 'Get Support', path: '/patient/support' }
  ]

  return (
    <Box display="flex">
      <Sidebar />
      <Box ml="250px" w="calc(100% - 250px)" minH="100vh" bg={colorMode === 'dark' ? '#0b1437' : 'gray.50'}>
        <Container maxW="1000px" py={8}>
          <BreadcrumbNav items={breadcrumbItems} />
          <Heading mb={8}>Get Support</Heading>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
            <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={6} rounded="xl" shadow="md">
              <Icon as={FaPhone} color="brand.500" boxSize={12} mb={4} />
              <Heading size="md" mb={2}>Call Us</Heading>
              <Text color="gray.600" mb={4}>Speak with our support team</Text>
              <Link href="tel:+1234567890">
                <Text fontSize="xl" fontWeight="bold" color="brand.500">+1 (234) 567-890</Text>
              </Link>
              <Text fontSize="sm" color="gray.500" mt={2}>Mon-Fri: 9AM - 6PM</Text>
            </Box>

            <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={6} rounded="xl" shadow="md">
              <Icon as={FaEnvelope} color="brand.500" boxSize={12} mb={4} />
              <Heading size="md" mb={2}>Email Us</Heading>
              <Text color="gray.600" mb={4}>Send us your questions</Text>
              <Link href="mailto:support@healthconnect.com">
                <Text fontSize="lg" fontWeight="bold" color="brand.500">support@healthconnect.com</Text>
              </Link>
              <Text fontSize="sm" color="gray.500" mt={2}>Response within 24 hours</Text>
            </Box>

            <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={6} rounded="xl" shadow="md">
              <Icon as={FaComments} color="brand.500" boxSize={12} mb={4} />
              <Heading size="md" mb={2}>Live Chat</Heading>
              <Text color="gray.600" mb={4}>Chat with an agent now</Text>
              <Button 
                bgGradient="linear(to-r, brand.500, purple.400)" 
                color="white" 
                size="lg"
                onClick={onOpen}
              >
                Create Ticket
              </Button>
              <Button 
                colorScheme="purple"
                variant="outline"
                size="lg"
                onClick={() => navigate('/patient/support/my-tickets')}
              >
                View My Tickets
              </Button>
            </Box>

            <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={6} rounded="xl" shadow="md">
              <Icon as={FaHospital} color="brand.500" boxSize={12} mb={4} />
              <Heading size="md" mb={2}>Visit Us</Heading>
              <Text color="gray.600" mb={4}>123 Health Street, Medical City, MC 12345</Text>
              <Text fontSize="sm" color="gray.500">Mon-Fri: 8AM - 8PM</Text>
            </Box>
          </SimpleGrid>

          <Box bg="red.500" p={6} rounded="xl" shadow="md">
            <HStack spacing={4} align="start">
              <Icon as={FaAmbulance} color="white" boxSize={12} />
              <VStack align="start" spacing={2}>
                <Heading size="md" color="white">Emergency Numbers</Heading>
                <Text color="white">For medical emergencies, please call:</Text>
                <VStack align="start" spacing={1}>
                  <Link href="tel:911">
                    <Text fontSize="xl" fontWeight="bold" color="white">Emergency: 911</Text>
                  </Link>
                  <Link href="tel:+1234567999">
                    <Text fontSize="lg" fontWeight="bold" color="white">Hospital Hotline: +1 (234) 567-999</Text>
                  </Link>
                </VStack>
              </VStack>
            </HStack>
          </Box>
        </Container>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Support Ticket</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input placeholder="Subject" value={ticketData.subject} onChange={(e) => setTicketData({...ticketData, subject: e.target.value})} />
              <Textarea placeholder="Describe your issue..." value={ticketData.description} onChange={(e) => setTicketData({...ticketData, description: e.target.value})} rows={6} />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
            <Button bgGradient="linear(to-r, brand.500, purple.400)" color="white" onClick={async () => {
              try {
                await api.createSupportTicket(ticketData.subject, ticketData.description)
                toast({ title: 'Ticket created!', description: 'Support staff will respond soon.', status: 'success', duration: 3000, position: 'top' })
                setTicketData({ subject: '', description: '' })
                onClose()
              } catch (error) {
                toast({ title: 'Creation failed', description: error.message, status: 'error', duration: 5000, position: 'top' })
              }
            }}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
