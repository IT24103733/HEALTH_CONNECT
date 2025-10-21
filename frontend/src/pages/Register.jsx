import { Box, Container, VStack, Heading, Text, Input, Button, FormControl, FormLabel, Select, useColorMode, IconButton, InputGroup, InputRightElement, FormErrorMessage, useToast } from '@chakra-ui/react'
import { MoonIcon, SunIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { FaUserPlus } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { register } from '../services/auth'

export default function Register() {
  const { colorMode, toggleColorMode } = useColorMode()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: '', specialization: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    
    if (!formData.name) newErrors.name = 'Name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    if (!formData.role) newErrors.role = 'Role is required'
    if ((formData.role === 'DOCTOR' || formData.role === 'DIETITIAN') && !formData.specialization) {
      newErrors.specialization = 'Specialization is required'
    }
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true)
      register(formData.name, formData.email, formData.password, formData.role, formData.specialization)
        .then(() => {
          toast({
            title: 'Account created successfully!',
            description: `Welcome ${formData.name}! Please log in to continue.`,
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top'
          })
          navigate('/login')
        })
        .catch((error) => {
          toast({
            title: 'Registration failed',
            description: error.message || 'An error occurred',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top'
          })
        })
        .finally(() => setLoading(false))
    }
  }

  const roles = [
    { value: 'PATIENT', label: 'Patient' },
    { value: 'DIETITIAN', label: 'Dietitian' },
    { value: 'DOCTOR', label: 'Doctor' },
    { value: 'SUPPORT_STAFF', label: 'Support Staff' },
    { value: 'SYSTEM_ADMIN', label: 'System Admin' },
    { value: 'SUPER_ADMIN', label: 'Super Admin' }
  ]

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
              <FaUserPlus size={48} color="#4318ff" />
            </Box>
            <Heading size="lg">Create Account</Heading>
            <Text color="gray.600" textAlign="center">Join Health Connect today</Text>
            <FormControl isInvalid={errors.name}>
              <FormLabel fontWeight="semibold">Full Name</FormLabel>
              <Input type="text" placeholder="John Doe" size="lg" focusBorderColor="brand.500" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>
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
            <FormControl isInvalid={errors.confirmPassword}>
              <FormLabel fontWeight="semibold">Confirm Password</FormLabel>
              <InputGroup size="lg">
                <Input type={showConfirmPassword ? 'text' : 'password'} focusBorderColor="brand.500" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
                <InputRightElement>
                  <IconButton
                    icon={showConfirmPassword ? <ViewIcon /> : <ViewOffIcon />}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    variant="ghost"
                    size="sm"
                    aria-label="Toggle confirm password"
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.role}>
              <FormLabel fontWeight="semibold">Role</FormLabel>
              <Select placeholder="Select role" size="lg" focusBorderColor="brand.500" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                {roles.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </Select>
              <FormErrorMessage>{errors.role}</FormErrorMessage>
            </FormControl>
            {(formData.role === 'DOCTOR' || formData.role === 'DIETITIAN') && (
              <FormControl isInvalid={errors.specialization}>
                <FormLabel fontWeight="semibold">Specialization</FormLabel>
                <Input type="text" placeholder="e.g., Cardiology, Nutrition" size="lg" focusBorderColor="brand.500" value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} />
                <FormErrorMessage>{errors.specialization}</FormErrorMessage>
              </FormControl>
            )}
            <Button bgGradient="linear(to-r, brand.500, purple.400)" color="white" size="lg" w="100%" _hover={{ opacity: 0.9 }} shadow="lg" onClick={handleSubmit} isLoading={loading} loadingText="Creating account...">
              Create Account
            </Button>
            <Text color="gray.600" fontSize="sm">
              Already have an account? <Link to="/login"><Text as="span" color="brand.500" fontWeight="semibold">Sign in</Text></Link>
            </Text>
            <Link to="/"><Text color="gray.500" fontSize="sm" _hover={{color: 'brand.500'}}>← Back to home</Text></Link>
          </VStack>
        </Box>
      </Container>
    </Box>
  )
}
