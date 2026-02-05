"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Box, Container, Typography, Button, TextField, Paper,
  FormControl, InputLabel, Select, MenuItem, IconButton,
  Table, TableBody, TableCell, TableHead, TableRow, Alert
} from "@mui/material"
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material"

interface Customer {
  id: string
  name: string
  email: string
}

interface OrderItem {
  name: string
  quantity: number
  price: number
}

export default function NewOrderPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [customerId, setCustomerId] = useState("")
  const [items, setItems] = useState<OrderItem[]>([{ name: '', quantity: 1, price: 0 }])
  const [notes, setNotes] = useState("")
  const [error, setError] = useState("")

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

  const addItem = () => {
    setItems([...items, { name: '', quantity: 1, price: 0 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof OrderItem, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
  }

  const handleSubmit = async () => {
    if (!customerId) {
      setError("Vui lòng chọn khách hàng")
      return
    }

    if (items.some(item => !item.name || item.quantity <= 0 || item.price <= 0)) {
      setError("Vui lòng điền đầy đủ thông tin sản phẩm")
      return
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          totalAmount: calculateTotal(),
          items,
          notes
        })
      })

      if (response.ok) {
        router.push('/dashboard/orders')
      } else {
        setError("Lỗi khi tạo đơn hàng")
      }
    } catch (error) {
      setError("Có lỗi xảy ra")
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Tạo đơn hàng mới
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Thông tin khách hàng</Typography>
        <FormControl fullWidth>
          <InputLabel>Khách hàng</InputLabel>
          <Select
            value={customerId}
            label="Khách hàng"
            onChange={(e) => setCustomerId(e.target.value)}
          >
            {customers.map(customer => (
              <MenuItem key={customer.id} value={customer.id}>
                {customer.name} - {customer.email}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Sản phẩm / Dịch vụ</Typography>
          <Button startIcon={<AddIcon />} onClick={addItem}>
            Thêm sản phẩm
          </Button>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Đơn giá</TableCell>
              <TableCell>Thành tiền</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TextField
                    fullWidth
                    value={item.name}
                    onChange={(e) => updateItem(index, 'name', e.target.value)}
                    placeholder="Tên sản phẩm"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                    sx={{ width: 100 }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value))}
                    sx={{ width: 150 }}
                  />
                </TableCell>
                <TableCell>
                  {(item.quantity * item.price).toLocaleString('vi-VN')} VND
                </TableCell>
                <TableCell>
                  {items.length > 1 && (
                    <IconButton color="error" onClick={() => removeItem(index)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box mt={2} display="flex" justifyContent="flex-end">
          <Typography variant="h6">
            Tổng cộng: {calculateTotal().toLocaleString('vi-VN')} VND
          </Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Ghi chú</Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ghi chú thêm về đơn hàng..."
        />
      </Paper>

      <Box display="flex" gap={2} justifyContent="flex-end">
        <Button onClick={() => router.back()}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Tạo đơn hàng
        </Button>
      </Box>
    </Container>
  )
}
