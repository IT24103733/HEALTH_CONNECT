import { Box, Container, Heading, VStack, Input, Button, useColorMode, FormControl, FormLabel, useToast, Avatar, Text, Spinner } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import DietitianSidebar from '../../components/DietitianSidebar'
import BreadcrumbNav from '../../components/Breadcrumb'
import { api } from '../../services/api'

export default function DietitianProfile() {
  const { colorMode } = useColorMode()
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    specialization: ''
  })

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userData = await api.getCurrentUser()
        setFormData({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          specialization: userData.specialty || ''
        })
      } catch (error) {
        toast({
          title: 'Failed to load profile',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top'
        })
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  const handleUpdate = async () => {
    try {
      await api.updateCurrentUser({ 
        name: formData.name, 
        email: formData.email,
        specialization: formData.specialization
      })
      const user = JSON.parse(localStorage.getItem('user'))
      localStorage.setItem('user', JSON.stringify({ ...user, name: formData.name, email: formData.email }))
      toast({
        title: 'Profile updated successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top'
      })
    } catch (error) {
      toast({
        title: 'Failed to update profile',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      })
    }
  }

  const breadcrumbItems = [
    { label: 'Dietitian', path: '/dietitian/dashboard' },
    { label: 'Profile', path: '/dietitian/profile' }
  ]

  return (
    <Box display="flex">
      <DietitianSidebar />
      <Box ml="250px" w="calc(100% - 250px)" minH="100vh" bg={colorMode === 'dark' ? '#0b1437' : 'gray.50'}>
        <Container maxW="800px" py={8}>
          <BreadcrumbNav items={breadcrumbItems} />
          <Heading mb={8}>Profile</Heading>

          <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={8} rounded="xl" shadow="md">
            {loading ? (
              <VStack py={8}>
                <Spinner size="xl" color="brand.500" />
              </VStack>
            ) : (
              <VStack spacing={6}>
                <Avatar size="2xl" name={formData.name} bg="brand.500" />
                <FormControl>
                  <FormLabel fontWeight="semibold">User ID</FormLabel>
                  <Input 
                    value={formData.id} 
                    isReadOnly 
                    bg={colorMode === 'dark' ? '#0b1437' : 'gray.100'}
                    cursor="not-allowed"
                    opacity={0.7}
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>User ID cannot be changed</Text>
                </FormControl>
              <FormControl>
                <FormLabel fontWeight="semibold">Full Name</FormLabel>
                <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight="semibold">Email</FormLabel>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight="semibold">Specialization</FormLabel>
                <Input value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} />
              </FormControl>
                <Button bgGradient="linear(to-r, brand.500, purple.400)" color="white" size="lg" w="100%" onClick={handleUpdate}>
                  Update Profile
                </Button>
              </VStack>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
