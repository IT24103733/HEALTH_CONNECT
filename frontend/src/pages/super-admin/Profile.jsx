import { Box, Container, Heading, VStack, Input, Button, useColorMode, FormControl, FormLabel, useToast, Avatar, Text } from '@chakra-ui/react'
import { useState } from 'react'
import SuperAdminSidebar from '../../components/SuperAdminSidebar'
import BreadcrumbNav from '../../components/Breadcrumb'

export default function SuperAdminProfile() {
  const { colorMode } = useColorMode()
  const toast = useToast()
  const [formData, setFormData] = useState({
    userId: 'SUPADM001',
    name: 'Robert Martinez',
    email: 'robert.martinez@healthconnect.com',
    phone: '+1 (234) 567-2001'
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
    { label: 'Super Admin', path: '/super-admin/dashboard' },
    { label: 'Profile', path: '/super-admin/profile' }
  ]

  return (
    <Box display="flex">
      <SuperAdminSidebar />
      <Box ml="250px" w="calc(100% - 250px)" minH="100vh" bg={colorMode === 'dark' ? '#0b1437' : 'gray.50'}>
        <Container maxW="800px" py={8}>
          <BreadcrumbNav items={breadcrumbItems} />
          <Heading mb={8}>Profile</Heading>

          <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={8} rounded="xl" shadow="md" border="2px" borderColor="purple.500">
            <VStack spacing={6}>
              <Avatar size="2xl" name={formData.name} bg="purple.500" />
              <FormControl>
                <FormLabel fontWeight="semibold">User ID</FormLabel>
                <Input 
                  value={formData.userId} 
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
                <FormLabel fontWeight="semibold">Phone</FormLabel>
                <Input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </FormControl>
              <Button bgGradient="linear(to-r, purple.500, pink.400)" color="white" size="lg" w="100%" onClick={handleUpdate}>
                Update Profile
              </Button>
            </VStack>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
