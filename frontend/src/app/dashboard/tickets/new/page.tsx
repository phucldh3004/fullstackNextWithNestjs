"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Box, Container, Typography, Button, Paper, TextField,
  FormControl, InputLabel, Select, MenuItem, Alert
} from "@mui/material"

interface Customer {
  id: string
  name: string
  email: string
}

export default function NewTicketPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [formData, setFormData] = useState({
    customerId: '',
    title: '',
    description: '',
    priority: 'MEDIUM'
  })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers')
      if (response.ok) {
        const data = await response.json()
        setCustomers(data)
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      setError('Vui lòng điền đầy đủ thông tin')
      return
    }

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push('/dashboard/tickets')
      } else {
        setError('Lỗi khi tạo ticket')
      }
    } catch (error) {
      setError('Có lỗi xảy ra')
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Tạo ticket hỗ trợ
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper sx={{ p: 3 }}>
        <Box display="flex" flexDirection="column" gap={3}>
          <FormControl fullWidth>
            <InputLabel>Khách hàng (Tùy chọn)</InputLabel>
            <Select
              value={formData.customerId}
              label="Khách hàng (Tùy chọn)"
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
            >
              <MenuItem value=""><em>Không chọn</em></MenuItem>
              {customers.map(customer => (
                <MenuItem key={customer.id} value={customer.id}>
                  {customer.name} - {customer.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Tiêu đề"
            fullWidth
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <FormControl fullWidth>
            <InputLabel>Mức độ ưu tiên</InputLabel>
            <Select
              value={formData.priority}
              label="Mức độ ưu tiên"
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <MenuItem value="LOW">Thấp</MenuItem>
              <MenuItem value="MEDIUM">Trung bình</MenuItem>
              <MenuItem value="HIGH">Cao</MenuItem>
              <MenuItem value="URGENT">Khẩn cấp</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Mô tả chi tiết"
            multiline
            rows={5}
            fullWidth
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <Box display="flex" gap={2} justifyContent="flex-end" mt={2}>
            <Button onClick={() => router.back()}>Hủy</Button>
            <Button variant="contained" onClick={handleSubmit}>
              Tạo ticket
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}
