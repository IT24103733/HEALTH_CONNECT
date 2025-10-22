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
    if (!formData.age || !formData.weight || !formData.height || !formData.dietaryRestrictions || !formData.healthGoals || !formData.activityLevel) {
      toast({ title: 'Missing fields', description: 'Please fill in all fields', status: 'error', duration: 3000, position: 'top' })
      return
    }

    const age = parseInt(formData.age)
    const weight = parseFloat(formData.weight)
    const height = parseFloat(formData.height)

    if (isNaN(age) || age < 1 || age > 120) {
      toast({ title: 'Invalid age', description: 'Age must be between 1 and 120', status: 'error', duration: 3000, position: 'top' })
      return
    }

    if (isNaN(weight) || weight < 20 || weight > 300) {
      toast({ title: 'Invalid weight', description: 'Weight must be between 20 and 300 kg', status: 'error', duration: 3000, position: 'top' })
      return
    }

    if (isNaN(height) || height < 50 || height > 250) {
      toast({ title: 'Invalid height', description: 'Height must be between 50 and 250 cm', status: 'error', duration: 3000, position: 'top' })
      return
    }

    try {
      await api.createDietRequest({
        age,
        weight,
        height,
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
              <FormControl isRequired>
                <FormLabel fontWeight="semibold">Age</FormLabel>
                <Input type="number" placeholder="25" min="1" max="120" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontWeight="semibold">Weight (kg)</FormLabel>
                <Input type="number" placeholder="70" min="20" max="300" step="0.1" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontWeight="semibold">Height (cm)</FormLabel>
                <Input type="number" placeholder="175" min="50" max="250" value={formData.height} onChange={(e) => setFormData({...formData, height: e.target.value})} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontWeight="semibold">Dietary Restrictions</FormLabel>
                <Textarea placeholder="Vegetarian, gluten-free, etc." value={formData.dietaryRestrictions} onChange={(e) => setFormData({...formData, dietaryRestrictions: e.target.value})} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontWeight="semibold">Health Goals</FormLabel>
                <Textarea placeholder="Weight loss, muscle gain, etc." value={formData.healthGoals} onChange={(e) => setFormData({...formData, healthGoals: e.target.value})} />
              </FormControl>
              <FormControl isRequired>
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
