import { useState, useEffect, useRef } from 'react'
import { Box, Container, Heading, VStack, HStack, Input, Button, Text, useColorMode, Avatar } from '@chakra-ui/react'
import { FaPaperPlane } from 'react-icons/fa'
import DietitianSidebar from '../../components/DietitianSidebar'
import BreadcrumbNav from '../../components/Breadcrumb'

export default function DietitianSupportChat() {
  const { colorMode } = useColorMode()
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef(null)

  const breadcrumbItems = [
    { label: 'Dietitian', path: '/dietitian/dashboard' },
    { label: 'Get Support', path: '/dietitian/support' },
    { label: 'Live Chat', path: '/dietitian/support/chat' }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: Date.now(),
        text: inputMessage,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages([...messages, newMessage])
      setInputMessage('')

      setTimeout(() => {
        const agentMessage = {
          id: Date.now() + 1,
          text: 'Thank you for your message. A support agent will respond shortly.',
          sender: 'agent',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        setMessages(prev => [...prev, agentMessage])
      }, 1000)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  return (
    <Box display="flex">
      <DietitianSidebar />
      <Box ml="250px" w="calc(100% - 250px)" minH="100vh" bg={colorMode === 'dark' ? '#0b1437' : 'gray.50'}>
        <Container maxW="1000px" py={8}>
          <BreadcrumbNav items={breadcrumbItems} />
          <Heading mb={6}>Live Support Chat</Heading>

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
        </Container>
      </Box>
    </Box>
  )
}
