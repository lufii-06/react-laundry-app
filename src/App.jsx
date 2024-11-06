import { Route, Routes } from 'react-router-dom'
import ProductPage from './components/ProductPage';
import CostumerPage from './components/CostumerPage';
import OrderPage from './components/OrderPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DetailProductPage from './components/DetailProductPage';
import DetailCustomerPage from './components/DetailCustomerPage';
import DetailOrderPage from './components/DetailOrderPage';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<ProductPage />} />
        <Route path='/product-detail/:productId' element={<DetailProductPage />} />
        <Route path='/customer-detail/:customerId' element={<DetailCustomerPage />} />
        <Route path='/order-detail/:orderId' element={<DetailOrderPage />} />
        <Route path='/customer' element={<CostumerPage />} />
        <Route path='/order' element={<OrderPage />} />
        <Route path='/login' element={<LoginPage />} />
        {/* <Route path='/register' element={<RegisterPage />} /> */}
      </Routes>
    </>
  )
}

export default App




