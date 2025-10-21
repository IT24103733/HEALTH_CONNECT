import { Box, Container, Heading, Text, VStack, HStack, Input, Button, useColorMode, Badge, Select, Spinner, useToast } from '@chakra-ui/react'
import { FaDownload, FaFilter } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import SuperAdminSidebar from '../../components/SuperAdminSidebar'
import BreadcrumbNav from '../../components/Breadcrumb'
import { api } from '../../services/api'

export default function ComplianceLogs() {
  const { colorMode } = useColorMode()
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    loadLogs()
  }, [])

  const loadLogs = async () => {
    try {
      setLoading(true)
      const data = await api.getComplianceLogs(startDate || null, endDate || null)
      setLogs(data)
    } catch (error) {
      toast({ title: 'Error loading logs', description: error.message, status: 'error', duration: 5000, position: 'top' })
    } finally {
      setLoading(false)
    }
  }

  const handleApplyFilters = () => {
    loadLogs()
  }

  const breadcrumbItems = [
    { label: 'Super Admin', path: '/super-admin/dashboard' },
    { label: 'Compliance Logs', path: '/super-admin/compliance' }
  ]

  const handleExportCSV = async () => {
    try {
      const csvData = await api.exportLogsToCSV(startDate || null, endDate || null)
      const blob = new Blob([csvData], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `compliance_logs_${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      toast({ title: 'Export successful', status: 'success', duration: 3000, position: 'top' })
    } catch (error) {
      toast({ title: 'Export failed', description: error.message, status: 'error', duration: 5000, position: 'top' })
    }
  }

  return (
    <Box display="flex">
      <SuperAdminSidebar />
      <Box ml="250px" w="calc(100% - 250px)" minH="100vh" bg={colorMode === 'dark' ? '#0b1437' : 'gray.50'}>
        <Container maxW="1400px" py={8}>
          <BreadcrumbNav items={breadcrumbItems} />
          <Heading mb={6}>Compliance Logs</Heading>

          <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={6} rounded="xl" shadow="md" mb={6}>
            <HStack spacing={4} mb={4}>
              <VStack align="start" flex="1">
                <Text fontSize="sm" fontWeight="semibold">Start Date</Text>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </VStack>
              <VStack align="start" flex="1">
                <Text fontSize="sm" fontWeight="semibold">End Date</Text>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </VStack>

            </HStack>
            <HStack spacing={3}>
              <Button leftIcon={<FaFilter />} colorScheme="purple" variant="outline" onClick={handleApplyFilters}>
                Apply Filters
              </Button>
              <Button leftIcon={<FaDownload />} bgGradient="linear(to-r, purple.500, pink.400)" color="white" onClick={handleExportCSV}>
                Export to CSV
              </Button>
            </HStack>
          </Box>

          {loading ? (
            <VStack py={12}><Spinner size="xl" color="purple.500" /></VStack>
          ) : (
          <VStack spacing={3} align="stretch">
            {logs.map((log) => (
              <Box 
                key={log.id} 
                bg={colorMode === 'dark' ? '#1a2559' : 'white'} 
                p={5} 
                rounded="xl" 
                shadow="sm" 
                border="1px" 
                borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}
              >
                <HStack justify="space-between" align="start">
                  <VStack align="start" spacing={2} flex="1">
                    <HStack>
                      <Badge colorScheme="purple" fontSize="sm">{log.action || 'ACTION'}</Badge>
                      <Text fontSize="sm" color="gray.500">{new Date(log.timestamp).toLocaleString()}</Text>
                    </HStack>
                    <HStack spacing={6}>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="xs" color="gray.500">User ID</Text>
                        <Text fontWeight="semibold" fontSize="sm">{log.userId}</Text>
                      </VStack>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="xs" color="gray.500">Endpoint</Text>
                        <Text fontWeight="semibold" fontSize="sm">{log.endpoint}</Text>
                      </VStack>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="xs" color="gray.500">IP Address</Text>
                        <Text fontWeight="semibold" fontSize="sm">{log.ipAddress}</Text>
                      </VStack>
                    </HStack>
                  </VStack>
                </HStack>
              </Box>
            ))}
          </VStack>
          )}
          {!loading && logs.length === 0 && (
            <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={12} rounded="xl" shadow="md" textAlign="center">
              <Text color="gray.500" fontSize="lg">No logs found</Text>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  )
}
