import { Box, Container, Heading, VStack, Input, Button, useColorMode, FormControl, FormLabel, useToast, Avatar, HStack } from '@chakra-ui/react'
import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import BreadcrumbNav from '../../components/Breadcrumb'

export default function Profile() {
  const { colorMode } = useColorMode()
  const toast = useToast()
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john@example.com'
  })

  const handleUpdate = () => {
    console.log('Profile update:', formData)
    toast({
      title: 'Profile updated successfully!',
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top'
    })
  }

  const breadcrumbItems = [
    { label: 'Patient', path: '/patient/dashboard' },
    { label: 'Profile', path: '/patient/profile' }
  ]

  return (
    <Box display="flex">
      <Sidebar />
      <Box ml="250px" w="calc(100% - 250px)" minH="100vh" bg={colorMode === 'dark' ? '#0b1437' : 'gray.50'}>
        <Container maxW="800px" py={8}>
          <BreadcrumbNav items={breadcrumbItems} />
          <Heading mb={8}>Profile</Heading>

          <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={8} rounded="xl" shadow="md">
            <VStack spacing={6}>
              <Avatar size="2xl" name={formData.name} bg="brand.500" />
              <FormControl>
                <FormLabel fontWeight="semibold">Full Name</FormLabel>
                <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight="semibold">Email</FormLabel>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </FormControl>
              <Button bgGradient="linear(to-r, brand.500, purple.400)" color="white" size="lg" w="100%" onClick={handleUpdate}>
                Update Profile
              </Button>
            </VStack>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
