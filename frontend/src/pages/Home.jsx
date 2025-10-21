import { Box, Container, Heading, Text, Button, SimpleGrid, VStack, HStack, useColorMode } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { FaShieldAlt, FaChartLine, FaClipboardList, FaCalendar, FaComments, FaLock, FaUsers, FaHeart, FaBell, FaChevronDown } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`

export default function Home() {
  const { colorMode } = useColorMode()
  const [scrollY, setScrollY] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const heroRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const features = [
    { icon: FaShieldAlt, title: 'Role-Based Access Control', desc: 'Secure access and data protection with tiered permissions for patients, clinicians, and administrators' },
    { icon: FaChartLine, title: 'Health Metrics Dashboard', desc: 'Patient logging of nutrition, exercise, and symptoms with automated progress visualization' },
    { icon: FaUsers, title: 'Care Plan Management', desc: 'Collaborative meal plans by dietitians and treatment protocols by physicians with adherence tracking' },
    { icon: FaBell, title: 'Appointment Management', desc: 'Calendar-based booking with conflict detection and automated reminder notifications' },
    { icon: FaComments, title: 'Communication Hub', desc: 'Secure messaging between patients and clinicians with staff group discussions' },
    { icon: FaLock, title: 'Compliance Reporting', desc: 'Audit-ready reports and anonymized data export for regulatory oversight' }
  ]

  return (
    <Box>
      <Navbar />
      
      {/* Hero Section */}
      <Box ref={heroRef} position="relative" overflow="hidden" pt={32} pb={20} minH="100vh" display="flex" alignItems="center">
        <Box position="absolute" top="0" left="0" right="0" bottom="0" zIndex={0}>
          <Box position="absolute" top="0" left="0" right="0" bottom="0" bgGradient="linear(to-br, brand.500, purple.400)" opacity="0.05" />
          <Box 
            position="absolute" 
            top={mousePos.y - 400} 
            left={mousePos.x - 400} 
            w="800px" 
            h="800px" 
            bgGradient={colorMode === 'dark' ? 'radial(circle, rgba(67, 24, 255, 0.25), rgba(139, 92, 246, 0.15) 40%, transparent 70%)' : 'radial(circle, rgba(67, 24, 255, 0.2), rgba(139, 92, 246, 0.1) 40%, transparent 70%)'}
            pointerEvents="none"
            transition="all 0.15s ease-out"
            filter="blur(60px)"
          />
          <Box position="absolute" top="0" left="0" right="0" bottom="0" bg={colorMode === 'dark' ? 'rgba(11, 20, 55, 0.7)' : 'rgba(255, 255, 255, 0.7)'} />
        </Box>
        <Container maxW="1200px" position="relative">
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={20} alignItems="center">
            <VStack align="start" spacing={6} style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
              <HStack bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'blackAlpha.50'} px={4} py={2} rounded="full" spacing={2}>
                <FaShieldAlt color="#4318ff" />
                <Text fontSize="sm" fontWeight="semibold">Secure Healthcare Platform</Text>
              </HStack>
              <Heading size="3xl" lineHeight="1.2">
                Transform Healthcare with
                <Text 
                  as="span" 
                  bgGradient="linear(to-r, brand.500, purple.400, brand.500)" 
                  bgClip="text"
                  backgroundSize="200% 200%"
                  animation={`${gradientShift} 3s ease infinite`}
                > Smart Collaboration</Text>
              </Heading>
              <Text fontSize="lg" color="gray.600">
                Empower patients, doctors, and dietitians with online health management, personalized care plans, and seamless communication in one unified platform.
              </Text>
              <SimpleGrid columns={3} spacing={8} w="100%">
                <Box>
                  <Text fontSize="3xl" fontWeight="bold" color="brand.500">5</Text>
                  <Text fontSize="sm" color="gray.600">User Roles</Text>
                </Box>
                <Box>
                  <Text fontSize="3xl" fontWeight="bold" color="brand.500">30+</Text>
                  <Text fontSize="sm" color="gray.600">Concurrent Users</Text>
                </Box>
                <Box>
                  <Text fontSize="3xl" fontWeight="bold" color="brand.500">24/7</Text>
                  <Text fontSize="sm" color="gray.600">Support</Text>
                </Box>
              </SimpleGrid>
              <Link to="/register">
                <Button bgGradient="linear(to-r, brand.500, purple.400)" color="white" size="lg" rightIcon={<Text>→</Text>} _hover={{ opacity: 0.9 }}>
                  Get Started Free
                </Button>
              </Link>
            </VStack>

            {/* Dashboard Visual */}
            <Box position="relative" h="500px">
              <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={6} rounded="2xl" shadow="2xl">
                <HStack justify="space-between" mb={4}>
                  <HStack spacing={2}>
                    <Box w={3} h={3} rounded="full" bg="green.400" />
                    <Box w={3} h={3} rounded="full" bg="yellow.400" />
                    <Box w={3} h={3} rounded="full" bg="red.400" />
                  </HStack>
                  <Text fontWeight="bold">Health Dashboard</Text>
                </HStack>
                <VStack spacing={3}>
                  <HStack w="100%" p={4} bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'gray.50'} rounded="lg" justify="space-between">
                    <HStack>
                      <FaChartLine color="#4318ff" />
                      <VStack align="start" spacing={0}>
                        <Text fontSize="xs" color="gray.600">Daily Activity</Text>
                        <Text fontWeight="bold">8,547 steps</Text>
                      </VStack>
                    </HStack>
                    <Text fontSize="sm" color="green.500">+12%</Text>
                  </HStack>
                  <HStack w="100%" p={4} bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'gray.50'} rounded="lg" justify="space-between">
                    <HStack>
                      <FaHeart color="#48bb78" />
                      <VStack align="start" spacing={0}>
                        <Text fontSize="xs" color="gray.600">Heart Rate</Text>
                        <Text fontWeight="bold">72 bpm</Text>
                      </VStack>
                    </HStack>
                    <Text fontSize="sm" color="blue.500">Normal</Text>
                  </HStack>
                  <HStack w="100%" p={4} bg={colorMode === 'dark' ? 'whiteAlpha.100' : 'gray.50'} rounded="lg" justify="space-between">
                    <HStack>
                      <FaUsers color="#4299e1" />
                      <VStack align="start" spacing={0}>
                        <Text fontSize="xs" color="gray.600">Care Team</Text>
                        <Text fontWeight="bold">3 members</Text>
                      </VStack>
                    </HStack>
                    <Text fontSize="sm" color="green.500">Active</Text>
                  </HStack>
                </VStack>
              </Box>
              <Box position="absolute" top="20px" right="-20px" p={3} bg={colorMode === 'dark' ? '#1a2559' : 'white'} rounded="lg" shadow="lg" animation="float 3s ease-in-out infinite">
                <HStack spacing={2}>
                  <FaBell color="#4318ff" size={16} />
                  <Text fontSize="sm">Appointment in 2h</Text>
                </HStack>
              </Box>
            </Box>
          </SimpleGrid>
          <VStack mt={20} spacing={2} opacity={0.6} animation={`${bounce} 2s ease-in-out infinite`}>
            <FaChevronDown />
            <Text fontSize="sm">Scroll to explore</Text>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box bg={colorMode === 'dark' ? '#111c44' : 'gray.50'} py={20}>
        <Container maxW="1200px">
          <VStack spacing={4} mb={16}>
            <Heading size="2xl">Powerful Features for Healthcare</Heading>
            <Text color="gray.600">Everything you need for comprehensive health management in one platform</Text>
          </VStack>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {features.map((feature, i) => (
              <Box 
                key={i} 
                p={8} 
                bg={colorMode === 'dark' ? '#1a2559' : 'white'} 
                rounded="xl" 
                shadow="md" 
                _hover={{ transform: 'translateY(-8px)', shadow: 'xl' }} 
                transition="all 0.3s"
                style={{
                  transform: scrollY > 300 ? 'translateY(0)' : 'translateY(50px)',
                  opacity: scrollY > 300 ? 1 : 0,
                  transitionDelay: `${i * 0.1}s`
                }}
              >
                <feature.icon size={48} color="#4318ff" />
                <Heading size="md" mt={4} mb={3}>{feature.title}</Heading>
                <Text color="gray.600">{feature.desc}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box py={20}>
        <Container maxW="1200px">
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8}>
            <VStack>
              <Heading size="2xl" color="brand.500">6</Heading>
              <Text color="gray.600">Core Functions</Text>
            </VStack>
            <VStack>
              <Heading size="2xl" color="brand.500">5</Heading>
              <Text color="gray.600">User Roles</Text>
            </VStack>
            <VStack>
              <Heading size="2xl" color="brand.500">30+</Heading>
              <Text color="gray.600">Concurrent Users</Text>
            </VStack>
            <VStack>
              <Heading size="2xl" color="brand.500">30min</Heading>
              <Text color="gray.600">Session Timeout</Text>
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Footer */}
      <Box bg={colorMode === 'dark' ? '#1a2559' : 'gray.100'} py={8}>
        <Container maxW="1200px">
          <VStack spacing={2}>
            <HStack spacing={2}>
              <FaHeart color="#4318ff" size={24} />
              <Text fontWeight="bold">Health Connect</Text>
            </HStack>
            <Text fontSize="sm" color="gray.600">© 2025 project group 249. ALL RIGHTS RESERVED</Text>
          </VStack>
        </Container>
      </Box>
    </Box>
  )
}
