import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'

const MyOrdersScreen = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('User not logged in')
        }

        const response = await fetch('/api/orders/myorders', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch orders')
        }

        const data = await response.json()
        setOrders(data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>My Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : orders.length === 0 ? (
        <Message variant="info">No orders found</Message>
      ) : (
        <div style={styles.tableContainer}>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>IMAGE</th>
                <th>PRICE</th>
                <th>STATUS</th>
                <th>ORDERED AT</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) =>
                order.orderItems.map((item) => (
                  <tr key={item._id}>
                    <td>{order._id}</td>
                    <td>{item.name}</td>
                    <td>
                      <img
                        src={item.image || 'https://via.placeholder.com/50'}
                        alt={item.name}
                        style={styles.image}
                      />
                    </td>
                    <td>₹{item.price}</td>
                    <td style={styles.status}>
                      {order.isDelivered ? 'Delivered' : 'Pending'}
                    </td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  )
}

// Inline CSS styles
const styles = {
  container: {
    padding: '20px',
  },
  heading: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  tableContainer: {
    overflowX: 'auto', // Enables scrolling on small screens
  },
  image: {
    width: '200px',
    height: '200px',
    objectFit: 'cover', // Ensures images look neat
    borderRadius: '5px',
  },
  status: {
    fontWeight: 'bold',
    color: '#ff5733', // Orange color for Pending status
  },
}

export default MyOrdersScreen
