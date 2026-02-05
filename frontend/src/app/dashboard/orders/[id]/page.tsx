"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Box, Container, Typography, Button, Paper, Chip, Table,
  TableBody, TableCell, TableHead, TableRow, Divider,
  CircularProgress, Dialog, DialogTitle, DialogContent,
  DialogActions, FormControl, InputLabel, Select, MenuItem
} from "@mui/material"
import { Edit as EditIcon, Cancel as CancelIcon } from "@mui/icons-material"

interface Order {
  id: string
  orderNumber: string
  customer: {
    name: string
    email: string
    phone?: string
  }
  status: string
  totalAmount: number
  items: any[]
  notes?: string
  createdAt: string
  updatedAt: string
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [statusDialog, setStatusDialog] = useState(false)
  const [newStatus, setNewStatus] = useState("")

  useEffect(() => {
    if (params.id) {
      fetchOrder(params.id as string)
    }
  }, [params.id])

  const fetchOrder = async (id: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
        setNewStatus(data.status)
      }
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}/status/${newStatus}`, {
        method: 'PATCH'
      })
      
      if (response.ok) {
        fetchOrder(params.id as string)
        setStatusDialog(false)
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleCancelOrder = async () => {
    if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      try {
        const response = await fetch(`/api/orders/${params.id}/cancel`, {
          method: 'PATCH'
        })
        
        if (response.ok) {
          fetchOrder(params.id as string)
        }
      } catch (error) {
        console.error('Error cancelling order:', error)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'default'
      case 'PROCESSING': return 'primary'
      case 'COMPLETED': return 'success'
      case 'CANCELLED': return 'error'
      default: return 'default'
    }
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (!order) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Không tìm thấy đơn hàng</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Đơn hàng #{order.orderNumber}
          </Typography>
          <Chip
            label={order.status}
            color={getStatusColor(order.status) as any}
            sx={{ mt: 1 }}
          />
        </Box>
        <Box display="flex" gap={2}>
          <Button
            color="warning"
            onClick={() => setStatusDialog(true)}
          >
            Đổi trạng thái
          </Button>
          {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && (
            <Button
              color="error"
              startIcon={<CancelIcon />}
              onClick={handleCancelOrder}
            >
              Hủy đơn
            </Button>
          )}
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Thông tin khách hàng</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography><strong>Tên:</strong> {order.customer.name}</Typography>
        <Typography><strong>Email:</strong> {order.customer.email}</Typography>
        {order.customer.phone && (
          <Typography><strong>Số điện thoại:</strong> {order.customer.phone}</Typography>
        )}
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Chi tiết đơn hàng</Typography>
        <Divider sx={{ mb: 2 }} />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sản phẩm</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Đơn giá</TableCell>
              <TableCell>Thành tiền</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.items && order.items.map((item: any, index: number) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.price?.toLocaleString('vi-VN')} VND</TableCell>
                <TableCell>
                  {(item.quantity * item.price).toLocaleString('vi-VN')} VND
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Typography variant="h6">
            Tổng cộng: {order.totalAmount.toLocaleString('vi-VN')} VND
          </Typography>
        </Box>
      </Paper>

      {order.notes && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Ghi chú</Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography>{order.notes}</Typography>
        </Paper>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Ngày tạo: {new Date(order.createdAt).toLocaleString('vi-VN')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Cập nhật: {new Date(order.updatedAt).toLocaleString('vi-VN')}
        </Typography>
      </Paper>

      <Dialog open={statusDialog} onClose={() => setStatusDialog(false)}>
        <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={newStatus}
              label="Trạng thái"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="NEW">Mới</MenuItem>
              <MenuItem value="PROCESSING">Đang xử lý</MenuItem>
              <MenuItem value="COMPLETED">Hoàn thành</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog(false)}>Hủy</Button>
          <Button onClick={handleUpdateStatus} variant="contained">
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
