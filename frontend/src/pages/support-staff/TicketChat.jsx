import { useState, useEffect, useRef } from 'react'
import { Box, Container, Heading, VStack, HStack, Input, Button, Text, useColorMode, Avatar, Badge, Spinner, useToast } from '@chakra-ui/react'
import { FaPaperPlane } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import SupportStaffSidebar from '../../components/SupportStaffSidebar'
import BreadcrumbNav from '../../components/Breadcrumb'
import { api } from '../../services/api'
import { getCurrentUser } from '../../services/auth'

export default function TicketChat() {
  const { colorMode } = useColorMode()
  const { ticketId } = useParams()
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [ticket, setTicket] = useState(null)
  const messagesEndRef = useRef(null)
  const toast = useToast()
  const user = getCurrentUser()

  useEffect(() => {
    if (ticketId) {
      loadTicket()
    }
  }, [ticketId])

  const loadTicket = async () => {
    try {
      setLoading(true)
      const tickets = await api.getMyTickets()
      const currentTicket = tickets.find(t => t.id === parseInt(ticketId))
      setTicket(currentTicket)
      
      const msgs = await api.getTicketMessages(ticketId)
      const formattedMessages = msgs.map(m => ({
        id: m.id,
        text: m.content,
        sender: m.senderId === user.id ? 'agent' : 'user',
        timestamp: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }))
      setMessages(formattedMessages)
    } catch (error) {
      toast({ title: 'Error loading ticket', description: error.message, status: 'error', duration: 5000, position: 'top' })
    } finally {
      setLoading(false)
    }
  }

  const breadcrumbItems = [
    { label: 'Support Staff', path: '/support-staff/dashboard' },
    { label: 'Pending Tickets', path: '/support-staff/tickets' },
    { label: `Ticket #${ticketId}`, path: `/support-staff/chat/${ticketId}` }
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
        await api.sendTicketMessage(ticketId, inputMessage)
        const newMessage = {
          id: Date.now(),
          text: inputMessage,
          sender: 'agent',
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
      <SupportStaffSidebar />
      <Box ml="250px" w="calc(100% - 250px)" minH="100vh" bg={colorMode === 'dark' ? '#0b1437' : 'gray.50'}>
        <Container maxW="1000px" py={8}>
          <BreadcrumbNav items={breadcrumbItems} />
          {loading ? (
            <VStack py={12}><Spinner size="xl" color="brand.500" /></VStack>
          ) : ticket ? (
          <>
          <HStack mb={6} justify="space-between">
            <VStack align="start" spacing={1}>
              <Heading>Support Chat - Ticket #{ticketId}</Heading>
              <HStack>
                <Text color="gray.600">Patient ID: {ticket.patientId}</Text>
                <Badge colorScheme={ticket.status === 'OPEN' ? 'orange' : ticket.status === 'IN_PROGRESS' ? 'blue' : 'green'}>{ticket.status}</Badge>
                <Text color="gray.500">•</Text>
                <Text color="gray.600">{ticket.subject}</Text>
              </HStack>
            </VStack>
          </HStack>

          <Box 
            bg={colorMode === 'dark' ? '#1a2559' : 'white'} 
            rounded="xl" 
            shadow="md" 
            h="600px" 
            display="flex" 
            flexDirection="column"
          >
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
                {messages.map((message) => (
                  <HStack
                    key={message.id}
                    justify={message.sender === 'agent' ? 'flex-end' : 'flex-start'}
                    align="flex-start"
                  >
                    {message.sender === 'user' && (
                      <Avatar size="sm" name="Patient" bg="blue.500" />
                    )}
                    <Box maxW="70%">
                      <Box
                        bg={message.sender === 'agent' 
                          ? 'linear-gradient(to right, #4318ff, #a78bfa)' 
                          : colorMode === 'dark' ? '#0b1437' : 'gray.100'
                        }
                        color={message.sender === 'agent' ? 'white' : colorMode === 'dark' ? 'white' : 'black'}
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
                        textAlign={message.sender === 'agent' ? 'right' : 'left'}
                      >
                        {message.timestamp}
                      </Text>
                    </Box>
                    {message.sender === 'agent' && (
                      <Avatar size="sm" name="Support Agent" bg="purple.400" />
                    )}
                  </HStack>
                ))}
                <div ref={messagesEndRef} />
              </VStack>
            </Box>

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

          {ticket && ticket.status !== 'RESOLVED' && (
            <Button
              mt={4}
              colorScheme="green"
              size="lg"
              w="100%"
              onClick={async () => {
                try {
                  await api.resolveTicket(ticketId)
                  toast({ title: 'Ticket marked as resolved', status: 'success', duration: 3000, position: 'top' })
                  setTimeout(() => window.location.href = '/support-staff/active-tickets', 1000)
                } catch (error) {
                  toast({ title: 'Failed to resolve ticket', description: error.message, status: 'error', duration: 3000, position: 'top' })
                }
              }}
            >
              Mark as Resolved
            </Button>
          )}
          </>
          ) : (
            <Text color="gray.500">Ticket not found</Text>
          )}
        </Container>
      </Box>
    </Box>
  )
}
