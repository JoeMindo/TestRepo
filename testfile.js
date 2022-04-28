// import axios from 'axios';
// import { BASEURL } from './src/core/urls.js';

// const allMetrics = {
//   status: 'success',
//   message: [
//     {
//       id: 1,
//       metric_category_id: 1,
//       metric_name: 'Kilogram',
//       symbol: 'kg',
//       size: '',
//       no_of_items: 0,
//       category_name: 'Products',
//     },
//     {
//       id: 2,
//       metric_category_id: 1,
//       metric_name: 'Bag',
//       symbol: '70kg-Bag',
//       size: '70 kg',
//       no_of_items: 0,
//       category_name: 'Products',
//     },
//     {
//       id: 3,
//       metric_category_id: 1,
//       metric_name: 'Bag',
//       symbol: '90kg-Bag',
//       size: '90 kg',
//       no_of_items: 0,
//       category_name: 'Products',
//     },
//     {
//       id: 4,
//       metric_category_id: 1,
//       metric_name: 'Litre',
//       symbol: 'l',
//       size: '',
//       no_of_items: 0,
//       category_name: 'Products',
//     },
//     {
//       id: 5,
//       metric_category_id: 1,
//       metric_name: 'Piece',
//       symbol: 'piece',
//       size: '',
//       no_of_items: 0,
//       category_name: 'Products',
//     },
//     {
//       id: 6,
//       metric_category_id: 1,
//       metric_name: 'Crate',
//       symbol: 'crate',
//       size: '',
//       no_of_items: 30,
//       category_name: 'Products',
//     },
//     {
//       id: 7,
//       metric_category_id: 1,
//       metric_name: 'Bunch',
//       symbol: 'bunch',
//       size: '',
//       no_of_items: 0,
//       category_name: 'Products',
//     },
//     {
//       id: 8,
//       metric_category_id: 2,
//       metric_name: 'Acre',
//       symbol: 'ac',
//       size: '',
//       no_of_items: 0,
//       category_name: 'Land',
//     },
//     {
//       id: 9,
//       metric_category_id: 2,
//       metric_name: 'Hectare',
//       symbol: 'ha',
//       size: '',
//       no_of_items: 0,
//       category_name: 'Land',
//     },
//     {
//       id: 10,
//       metric_category_id: 4,
//       metric_name: 'Small',
//       symbol: 'sm',
//       size: '5000',
//       no_of_items: 0,
//       category_name: 'Warehouse',
//     },
//     {
//       id: 11,
//       metric_category_id: 4,
//       metric_name: 'Medium',
//       symbol: 'md',
//       size: '10000',
//       no_of_items: 0,
//       category_name: 'Warehouse',
//     },
//     {
//       id: 12,
//       metric_category_id: 4,
//       metric_name: 'Large',
//       symbol: 'lg',
//       size: '50000',
//       no_of_items: 0,
//       category_name: 'Warehouse',
//     },
//   ],
// };

// const metricsByID = {
//   status: 'success',
//   message: [
//     {
//       id: 1,
//       metric_category_id: 1,
//       metric_name: 'Kilogram',
//       symbol: 'kg',
//       size: '',
//       no_of_items: 0,
//       category_name: 'Products',
//     },
//     {
//       id: 2,
//       metric_category_id: 1,
//       metric_name: 'Bag',
//       symbol: '70kg-Bag',
//       size: '70 kg',
//       no_of_items: 0,
//       category_name: 'Products',
//     },
//     {
//       id: 3,
//       metric_category_id: 1,
//       metric_name: 'Bag',
//       symbol: '90kg-Bag',
//       size: '90 kg',
//       no_of_items: 0,
//       category_name: 'Products',
//     },
//     {
//       id: 4,
//       metric_category_id: 1,
//       metric_name: 'Litre',
//       symbol: 'l',
//       size: '',
//       no_of_items: 0,
//       category_name: 'Products',
//     },
//     {
//       id: 5,
//       metric_category_id: 1,
//       metric_name: 'Piece',
//       symbol: 'piece',
//       size: '',
//       no_of_items: 0,
//       category_name: 'Products',
//     },
//     {
//       id: 6,
//       metric_category_id: 1,
//       metric_name: 'Crate',
//       symbol: 'crate',
//       size: '',
//       no_of_items: 30,
//       category_name: 'Products',
//     },
//     {
//       id: 7,
//       metric_category_id: 1,
//       metric_name: 'Bunch',
//       symbol: 'bunch',
//       size: '',
//       no_of_items: 0,
//       category_name: 'Products',
//     },
//   ],

// };
// export const getMetrics = async (type) => {
//   const response = await axios
//     .get(`${BASEURL}/ussd/get-metrics/`)
//     .catch((error) => error.response);
//   return response;
// };

// console.log(await getMetrics('Land'));

const arr = ['993,321,456'];
console.log(arr[0].split(','));