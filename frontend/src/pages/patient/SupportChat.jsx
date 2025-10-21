import { useState, useEffect, useRef } from 'react'
import { Box, Container, Heading, VStack, HStack, Input, Button, Text, useColorMode, Avatar, Spinner, useToast } from '@chakra-ui/react'
import { FaPaperPlane } from 'react-icons/fa'
import { useParams, useLocation } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import DoctorSidebar from '../../components/DoctorSidebar'
import DietitianSidebar from '../../components/DietitianSidebar'
import BreadcrumbNav from '../../components/Breadcrumb'
import { api } from '../../services/api'
import { getCurrentUser } from '../../services/auth'

export default function SupportChat() {
  const { colorMode } = useColorMode()
  const { ticketId } = useParams()
  const location = useLocation()
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [ticket, setTicket] = useState(null)
  const messagesEndRef = useRef(null)
  const toast = useToast()
  const user = getCurrentUser()
  
  const role = location.pathname.includes('/doctor/') ? 'DOCTOR' : 
               location.pathname.includes('/dietitian/') ? 'DIETITIAN' : 'PATIENT'
  
  const SidebarComponent = role === 'DOCTOR' ? DoctorSidebar : 
                           role === 'DIETITIAN' ? DietitianSidebar : Sidebar
  
  const basePath = role === 'DOCTOR' ? '/doctor' : 
                   role === 'DIETITIAN' ? '/dietitian' : '/patient'

  useEffect(() => {
    if (ticketId) {
      loadTicketAndMessages()
    }
  }, [ticketId])

  const loadTicketAndMessages = async () => {
    try {
      setLoading(true)
      const tickets = await api.getMyTickets()
      const currentTicket = tickets.find(t => t.id === parseInt(ticketId))
      setTicket(currentTicket)
    } catch (error) {
      toast({ title: 'Error loading ticket', description: error.message, status: 'error', duration: 5000, position: 'top' })
    } finally {
      setLoading(false)
    }
  }

  const roleLabel = role === 'DOCTOR' ? 'Doctor' : role === 'DIETITIAN' ? 'Dietitian' : 'Patient'
  
  const breadcrumbItems = [
    { label: roleLabel, path: `${basePath}/dashboard` },
    { label: 'My Tickets', path: `${basePath}/support/my-tickets` },
    { label: `Ticket #${ticketId}`, path: `${basePath}/support/chat/${ticketId}` }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (inputMessage.trim() && ticket) {
      try {
        const recipientId = ticket.assignedStaffId || 1
        await api.sendTicketMessage(ticketId, recipientId, inputMessage)
        const newMessage = {
          id: Date.now(),
          text: inputMessage,
          sender: 'user',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        setMessages([...messages, newMessage])
        setInputMessage('')
      } catch (error) {
        toast({ title: 'Send failed', description: error.message, status: 'error', duration: 5000, position: 'top' })
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  return (
    <Box display="flex">
      <SidebarComponent />
      <Box ml="250px" w="calc(100% - 250px)" minH="100vh" bg={colorMode === 'dark' ? '#0b1437' : 'gray.50'}>
        <Container maxW="1000px" py={8}>
          <BreadcrumbNav items={breadcrumbItems} />
          {loading ? (
            <VStack py={12}><Spinner size="xl" color="brand.500" /></VStack>
          ) : (
          <>
          <Heading mb={2}>Support Chat - Ticket #{ticketId}</Heading>
          {ticket && <Text color="gray.600" mb={6}>{ticket.subject}</Text>}

          <Box 
            bg={colorMode === 'dark' ? '#1a2559' : 'white'} 
            rounded="xl" 
            shadow="md" 
            h="600px" 
            display="flex" 
            flexDirection="column"
          >
            {/* Messages Area */}
            <Box 
              flex="1" 
              overflowY="auto" 
              p={6}
              css={{
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: colorMode === 'dark' ? '#0b1437' : '#f1f1f1',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: colorMode === 'dark' ? '#4318ff' : '#888',
                  borderRadius: '4px',
                },
              }}
            >
              <VStack spacing={4} align="stretch">
                {messages.length === 0 && (
                  <Text textAlign="center" color="gray.500" mt={8}>
                    Start a conversation with our support team
                  </Text>
                )}
                {messages.map((message) => (
                  <HStack
                    key={message.id}
                    justify={message.sender === 'user' ? 'flex-end' : 'flex-start'}
                    align="flex-start"
                  >
                    {message.sender === 'agent' && (
                      <Avatar size="sm" name="Support Agent" bg="brand.500" />
                    )}
                    <Box maxW="70%">
                      <Box
                        bg={message.sender === 'user' 
                          ? 'linear-gradient(to right, #4318ff, #a78bfa)' 
                          : colorMode === 'dark' ? '#0b1437' : 'gray.100'
                        }
                        color={message.sender === 'user' ? 'white' : colorMode === 'dark' ? 'white' : 'black'}
                        px={4}
                        py={3}
                        rounded="lg"
                        shadow="sm"
                      >
                        <Text>{message.text}</Text>
                      </Box>
                      <Text 
                        fontSize="xs" 
                        color="gray.500" 
                        mt={1}
                        textAlign={message.sender === 'user' ? 'right' : 'left'}
                      >
                        {message.timestamp}
                      </Text>
                    </Box>
                    {message.sender === 'user' && (
                      <Avatar size="sm" name="You" bg="purple.400" />
                    )}
                  </HStack>
                ))}
                <div ref={messagesEndRef} />
              </VStack>
            </Box>

            {/* Input Area */}
            <Box 
              p={4} 
              borderTop="1px" 
              borderColor={colorMode === 'dark' ? '#0b1437' : 'gray.200'}
            >
              <HStack spacing={3}>
                <Input
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  bg={colorMode === 'dark' ? '#0b1437' : 'white'}
                  border="1px"
                  borderColor={colorMode === 'dark' ? '#4318ff' : 'gray.300'}
                  _focus={{
                    borderColor: 'brand.500',
                    boxShadow: '0 0 0 1px #4318ff'
                  }}
                  size="lg"
                />
                <Button
                  bgGradient="linear(to-r, brand.500, purple.400)"
                  color="white"
                  size="lg"
                  onClick={handleSendMessage}
                  leftIcon={<FaPaperPlane />}
                  _hover={{
                    bgGradient: "linear(to-r, brand.600, purple.500)"
                  }}
                >
                  Send
                </Button>
              </HStack>
            </Box>
          </Box>
          </>
          )}
        </Container>
      </Box>
    </Box>
  )
}
