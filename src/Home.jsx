import React, {useEffect, useState} from 'react';
import ProductList from './components/products/ProductList';
import { axiosRequest } from './helpers/config';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filter Portion
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); 

  

    useEffect(() => {
       const fectchProducts = async () => {
           try{

               const params = new URLSearchParams();

               if (selectedSize) {
                   params.append('size', selectedSize);
               }
               if (selectedColor) {
                   params.append('color', selectedColor);
               }
               if (searchTerm) {
                   params.append('search', searchTerm);
               }

              const url = `products${params.toString() ? '?' + params.toString() : ''}`;
              const response = await axiosRequest.get(url);
                        


        
                setProducts(response.data.data);
                setColors(response.data.colors);
                setSizes(response.data.sizes);
            
           }catch(e){
               console.log(e);
           }
       }

       fectchProducts();
    },[selectedSize, selectedColor, searchTerm]);


    return (
        <>
          <div className="flex justify-evenly m-6">

            <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} className="border border-gray-300 w-50 rounded-md p-2">
              <option value="">Sort by Size</option>
              {sizes?.map((size) => (
                <option key={size.id} value={size.id}>{size.name}</option>
              ))}
            </select>

            <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value) } className="border border-gray-300 w-50 rounded-md p-2">
              <option value="">Filter by Color</option>
              {colors?.map((color) => (
                <option key={color.id} value={color.id}>{color.name}</option>
              ))}
            </select>

            <input type="text"value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search products..." className="border border-gray-300 rounded-md p-2 w-1/3"/>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> 
            <ProductList products={products}/>
          </div>
        </>
    )
}

export default Home;