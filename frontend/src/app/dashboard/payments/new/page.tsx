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

export default function NewPaymentPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [formData, setFormData] = useState({
    customerId: '',
    amount: '',
    paymentMethod: 'CASH',
    notes: ''
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
    if (!formData.customerId || !formData.amount) {
      setError('Vui lòng điền đầy đủ thông tin')
      return
    }

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount)
        })
      })

      if (response.ok) {
        router.push('/dashboard/payments')
      } else {
        setError('Lỗi khi tạo phiếu thu')
      }
    } catch (error) {
      setError('Có lỗi xảy ra')
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Tạo phiếu thu mới
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper sx={{ p: 3 }}>
        <Box display="flex" flexDirection="column" gap={3}>
          <FormControl fullWidth>
            <InputLabel>Khách hàng</InputLabel>
            <Select
              value={formData.customerId}
              label="Khách hàng"
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
            >
              {customers.map(customer => (
                <MenuItem key={customer.id} value={customer.id}>
                  {customer.name} - {customer.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Số tiền"
            type="number"
            fullWidth
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />

          <FormControl fullWidth>
            <InputLabel>Phương thức thanh toán</InputLabel>
            <Select
              value={formData.paymentMethod}
              label="Phương thức thanh toán"
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            >
              <MenuItem value="CASH">Tiền mặt</MenuItem>
              <MenuItem value="BANK_TRANSFER">Chuyển khoản</MenuItem>
              <MenuItem value="ONLINE_PAYMENT">Thanh toán Online</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Ghi chú"
            multiline
            rows={3}
            fullWidth
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />

          <Box display="flex" gap={2} justifyContent="flex-end" mt={2}>
            <Button onClick={() => router.back()}>Hủy</Button>
            <Button variant="contained" onClick={handleSubmit}>
              Tạo phiếu thu
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}
