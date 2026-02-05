"use client"

import { useState, useEffect } from "react"
import {
  Box, Container, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Select,
  MenuItem, FormControl, InputLabel, Chip, Avatar, CircularProgress,
  Alert, Snackbar
} from "@mui/material"
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Person as PersonIcon, Lock as LockIcon, LockOpen as LockOpenIcon
} from "@mui/icons-material"

interface User {
  id: string
  name: string
  email: string
  role: string
  is_active: boolean
  createdAt: string
}

const ROLES = [
  { value: 'admin', label: 'ADMIN' },
  { value: 'sales', label: 'SALES' },
  { value: 'marketing', label: 'MARKETING' },
  { value: 'accountant', label: 'ACCOUNTANT' },
  { value: 'support', label: 'SUPPORT' }
]

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'sales'
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      showSnackbar('Lỗi khi tải danh sách người dùng', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity })
  }

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user)
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role
      })
    } else {
      setEditingUser(null)
      setFormData({ name: '', email: '', password: '', role: 'sales' })
    }
    setOpen(true)
  }

  const handleCloseDialog = () => {
    setOpen(false)
    setEditingUser(null)
  }

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        const response = await fetch('/api/users', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingUser.id,
            ...formData
          })
        })
        
        if (response.ok) {
          showSnackbar('Cập nhật người dùng thành công', 'success')
          fetchUsers()
        } else {
          showSnackbar('Lỗi khi cập nhật người dùng', 'error')
        }
      } else {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        
        if (response.ok) {
          showSnackbar('Tạo người dùng thành công', 'success')
          fetchUsers()
        } else {
          showSnackbar('Lỗi khi tạo người dùng', 'error')
        }
      }
      handleCloseDialog()
    } catch (error) {
      console.error('Error saving user:', error)
      showSnackbar('Có lỗi xảy ra', 'error')
    }
  }

  const handleDelete = async (userId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          showSnackbar('Xóa người dùng thành công', 'success')
          fetchUsers()
        } else {
          showSnackbar('Lỗi khi xóa người dùng', 'error')
        }
      } catch (error) {
        console.error('Error deleting user:', error)
        showSnackbar('Có lỗi xảy ra', 'error')
      }
    }
  }

  const handleToggleLock = async (userId: string, isActive: boolean) => {
    try {
      const endpoint = isActive ? 'lock' : 'unlock'
      const response = await fetch(`/api/users/${userId}/${endpoint}`, {
        method: 'PATCH'
      })
      
      if (response.ok) {
        showSnackbar(`${isActive ? 'Khóa' : 'Mở khóa'} người dùng thành công`, 'success')
        fetchUsers()
      } else {
        showSnackbar('Có lỗi xảy ra', 'error')
      }
    } catch (error) {
      console.error('Error toggling lock:', error)
      showSnackbar('Có lỗi xảy ra', 'error')
    }
  }

  const getRoleLabel = (role: string) => {
    return ROLES.find(r => r.value === role)?.label || role.toUpperCase()
  }

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Quản lý người dùng
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Thêm người dùng
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Người dùng</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <PersonIcon />
                    </Avatar>
                    <Typography fontWeight="medium">{user.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip label={getRoleLabel(user.role)} color="primary" size="small" />
                </TableCell>
                <TableCell>
                   <Box display="flex" justifyContent="center">
                  <Chip
                    label={user.is_active ? 'Hoạt động' : 'Đã khóa'}
                    color={user.is_active ? 'success' : 'error'}
                    size="small"
                  />
                  </Box>
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleOpenDialog(user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color={user.is_active ? 'warning' : 'success'}
                    onClick={() => handleToggleLock(user.id, user.is_active)}
                  >
                    {user.is_active ? <LockIcon /> : <LockOpenIcon />}
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(user.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Tên"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {!editingUser && (
              <TextField
                label="Mật khẩu"
                type="password"
                fullWidth
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            )}
            <FormControl fullWidth>
              <InputLabel>Vai trò</InputLabel>
              <Select
                value={formData.role}
                label="Vai trò"
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                {ROLES.map(role => (
                  <MenuItem key={role.value} value={role.value}>{role.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingUser ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}
