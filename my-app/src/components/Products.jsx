import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Products.css';

function Products() {
   const [products, setProducts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [showModal, setShowModal] = useState(false);
   const [newProduct, setNewProduct] = useState({
     name: '',
     description: '',
     price: '',
     image: null
   });

   useEffect(() => {
     fetchProducts();
   }, []);

   const fetchProducts = () => {
     axios.get('http://localhost:5000/api/products')
       .then(response => {
         setProducts(response.data);
         setLoading(false);
       })
       .catch(error => {
         console.error('Error fetching products:', error);
         setLoading(false);
       });
   };

   const handleInputChange = (e) => {
     const { name, value } = e.target;
     setNewProduct(prev => ({
       ...prev,
       [name]: value
     }));
   };

   const handleImageChange = (e) => {
     setNewProduct(prev => ({
       ...prev,
       image: e.target.files[0]
     }));
   };

   const handleSubmit = async (e) => {
     e.preventDefault();
     
     const formData = new FormData();
     formData.append('name', newProduct.name);
     formData.append('description', newProduct.description);
     formData.append('price', newProduct.price);
     if (newProduct.image) {
       formData.append('image', newProduct.image);
     }

     try {
       await axios.post('http://localhost:5000/api/products', formData, {
         headers: {
           'Content-Type': 'multipart/form-data'
         }
       });
       
       // Reset form and close modal
       setNewProduct({
         name: '',
         description: '',
         price: '',
         image: null
       });
       setShowModal(false);
       
       // Refresh products list
       fetchProducts();
     } catch (error) {
       console.error('Error adding product:', error);
       alert('Failed to add product');
     }
   };

   if (loading) {
     return(
       <div className="loading-container">
     <div className="loading-spinner"></div>
     
   </div>)
   }

   return (
     <div className="products-container">
       <div className="products-header">
         <h2 className="section-title">Products</h2>
         <button 
           className="add-product-btn" 
           onClick={() => setShowModal(true)}
         >
           + Add Product
         </button>
       </div>

       <div className="products-grid">
         {products.map(product => (
           <div className="product-card" key={product.id}>
             <img
               src={product.image ? `/${product.image}` : '/images/default-image.webp'}
               alt={product.name}
               className="product-image"
               loading='lazy'
             />
             <h3 className="product-name">{product.name}</h3>
             <p className="product-price">${product.price}</p>
           </div>
         ))}
       </div>

       {showModal && (
         <div className="modal-overlay">
           <div className="modal-content">
             <h2>Add New Product</h2>
             <form onSubmit={handleSubmit}>
               <input
                 type="text"
                 name="name"
                 placeholder="Product Name"
                 value={newProduct.name}
                 onChange={handleInputChange}
                 required
               />
               <textarea
                 name="description"
                 placeholder="Product Description"
                 value={newProduct.description}
                 onChange={handleInputChange}
                 required
               />
               <input
                 type="number"
                 name="price"
                 placeholder="Price"
                 value={newProduct.price}
                 onChange={handleInputChange}
                 step="0.01"
                 min="0"
                 required
               />
               <input
                 type="file"
                 name="image"
                 accept="image/*"
                 onChange={handleImageChange}
               />
               <div className="modal-actions">
                 <button 
                   type="button" 
                   onClick={() => setShowModal(false)}
                   className="cancel-btn"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit"
                   className="submit-btn"
                 >
                   Add Product
                 </button>
               </div>
             </form>
           </div>
         </div>
       )}
     </div>
   );
}

export default Products;