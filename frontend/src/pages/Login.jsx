import { Box, Container, VStack, Heading, Text, Input, Button, FormControl, FormLabel, useColorMode, IconButton, InputGroup, InputRightElement, FormErrorMessage, useToast } from '@chakra-ui/react'
import { MoonIcon, SunIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { FaShieldAlt } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { login } from '../services/auth'

export default function Login() {
  const { colorMode, toggleColorMode } = useColorMode()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    
    if (!formData.email) newErrors.email = 'Please enter your email'
    if (!formData.password) newErrors.password = 'Please enter your password'
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true)
      try {
        const user = await login(formData.email, formData.password)
        
        toast({
          title: 'Login successful!',
          description: `Welcome back, ${user.email}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top'
        })
        
        // Role-based redirect
        switch(user.role) {
          case 'PATIENT':
            navigate('/patient/dashboard')
            break
          case 'DOCTOR':
            navigate('/doctor/dashboard')
            break
          case 'DIETITIAN':
            navigate('/dietitian/dashboard')
            break
          case 'SUPPORT_STAFF':
            navigate('/support-staff/dashboard')
            break
          case 'SYSTEM_ADMIN':
            navigate('/admin/dashboard')
            break
          case 'SUPER_ADMIN':
            navigate('/super-admin/dashboard')
            break
          default:
            navigate('/patient/dashboard')
        }
      } catch (error) {
        toast({
          title: 'Login failed',
          description: error.message || 'Invalid email or password',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top'
        })
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <Box minH="100vh" position="relative" display="flex" alignItems="center" justifyContent="center" p={4}>
      <Box position="absolute" top="0" left="0" right="0" bottom="0" bgGradient="linear(to-br, brand.500, purple.400)" opacity="0.1" />
      <IconButton
        icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
        onClick={toggleColorMode}
        position="fixed"
        top={4}
        right={4}
        aria-label="Toggle theme"
        rounded="full"
      />
      <Container maxW="440px" position="relative">
        <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={10} rounded="2xl" shadow="2xl" border="1px" borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}>
          <VStack spacing={6}>
            <Box p={4} bg="brand.50" rounded="full">
              <FaShieldAlt size={48} color="#4318ff" />
            </Box>
            <Heading size="lg">Welcome Back</Heading>
            <Text color="gray.600" textAlign="center">Sign in to your Health Connect account</Text>
            <FormControl isInvalid={errors.email}>
              <FormLabel fontWeight="semibold">Email</FormLabel>
              <Input type="email" placeholder="your@email.com" size="lg" focusBorderColor="brand.500" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.password}>
              <FormLabel fontWeight="semibold">Password</FormLabel>
              <InputGroup size="lg">
                <Input type={showPassword ? 'text' : 'password'} focusBorderColor="brand.500" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                <InputRightElement>
                  <IconButton
                    icon={showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                    size="sm"
                    aria-label="Toggle password"
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>
            <Button bgGradient="linear(to-r, brand.500, purple.400)" color="white" size="lg" w="100%" _hover={{ opacity: 0.9 }} shadow="lg" onClick={handleSubmit} isLoading={loading} loadingText="Signing in...">
              Sign In
            </Button>
            <Text color="gray.600" fontSize="sm">
              Don't have an account? <Link to="/register"><Text as="span" color="brand.500" fontWeight="semibold">Sign up</Text></Link>
            </Text>
            <Link to="/"><Text color="gray.500" fontSize="sm" _hover={{color: 'brand.500'}}>← Back to home</Text></Link>
          </VStack>
        </Box>
      </Container>
    </Box>
  )
}
