import { Box, Container, Heading, VStack, Input, Textarea, Button, useColorMode, FormControl, FormLabel, Select, useToast } from '@chakra-ui/react'
import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import BreadcrumbNav from '../../components/Breadcrumb'
import { api } from '../../services/api'
import { getCurrentUser } from '../../services/auth'

export default function DietRequest() {
  const { colorMode } = useColorMode()
  const toast = useToast()
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    dietaryRestrictions: '',
    healthGoals: '',
    activityLevel: ''
  })

  const handleSubmit = async () => {
    const user = getCurrentUser()
    try {
      await api.createDietRequest({
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        dietaryRestrictions: formData.dietaryRestrictions,
        healthGoals: formData.healthGoals,
        activityLevel: formData.activityLevel
      })
      toast({
        title: 'Diet plan request submitted!',
        description: 'A dietitian will review your request soon.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top'
      })
      setFormData({ age: '', weight: '', height: '', dietaryRestrictions: '', healthGoals: '', activityLevel: '' })
    } catch (error) {
      toast({ title: 'Submission failed', description: error.message, status: 'error', duration: 5000, position: 'top' })
    }
  }

  const breadcrumbItems = [
    { label: 'Patient', path: '/patient/dashboard' },
    { label: 'Diet Plan Request', path: '/patient/diet-request' }
  ]

  return (
    <Box display="flex">
      <Sidebar />
      <Box ml="250px" w="calc(100% - 250px)" minH="100vh" bg={colorMode === 'dark' ? '#0b1437' : 'gray.50'}>
        <Container maxW="800px" py={8}>
          <BreadcrumbNav items={breadcrumbItems} />
          <Heading mb={8}>Request Diet Plan</Heading>

          <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={8} rounded="xl" shadow="md">
            <VStack spacing={6}>
              <FormControl>
                <FormLabel fontWeight="semibold">Age</FormLabel>
                <Input placeholder="25" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight="semibold">Weight (kg)</FormLabel>
                <Input placeholder="70" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight="semibold">Height (cm)</FormLabel>
                <Input placeholder="175" value={formData.height} onChange={(e) => setFormData({...formData, height: e.target.value})} />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight="semibold">Dietary Restrictions</FormLabel>
                <Textarea placeholder="Vegetarian, gluten-free, etc." value={formData.dietaryRestrictions} onChange={(e) => setFormData({...formData, dietaryRestrictions: e.target.value})} />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight="semibold">Health Goals</FormLabel>
                <Textarea placeholder="Weight loss, muscle gain, etc." value={formData.healthGoals} onChange={(e) => setFormData({...formData, healthGoals: e.target.value})} />
              </FormControl>
              <FormControl>
                <FormLabel fontWeight="semibold">Activity Level</FormLabel>
                <Select placeholder="Select activity level" value={formData.activityLevel} onChange={(e) => setFormData({...formData, activityLevel: e.target.value})}>
                  <option value="SEDENTARY">Sedentary</option>
                  <option value="LIGHT">Light</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="ACTIVE">Active</option>
                  <option value="VERY_ACTIVE">Very Active</option>
                </Select>
              </FormControl>
              <Button bgGradient="linear(to-r, brand.500, purple.400)" color="white" size="lg" w="100%" onClick={handleSubmit}>
                Submit Request
              </Button>
            </VStack>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
