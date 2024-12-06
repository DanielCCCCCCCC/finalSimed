export let notificationList = [
    { id: 1, icon: `${import.meta.env.BASE_URL}images/faces/5.jpg`, isOnline: true, title: 'Congratulate Olivia James for New template start', time: 'Oct 15 12:32pm' },
    { id: 2, icon: `${import.meta.env.BASE_URL}images/faces/2.jpg`, isOnline: false, title: 'Joshua Gray New Message Received', time: 'Oct 13 02:56am' },
    { id: 3, icon: `${import.meta.env.BASE_URL}images/faces/3.jpg`, isOnline: true, title: 'Elizabeth Lewis added new schedule realease', time: 'Oct 12 10:40pm' },
    { id: 4, icon: `${import.meta.env.BASE_URL}images/faces/5.jpg`, isOnline: true, title: 'Delivered Successful to Micky', time: 'Yesterday at 01:58am' },
    { id: 5, icon: `${import.meta.env.BASE_URL}images/faces/1.jpg`, isOnline: true, title: 'You got 22 requests form Facebook', time: 'Today at 08:08pm' },
],
    cartList = [
        {
            id: 1, img: `${import.meta.env.BASE_URL}images/ecommerce/jpg/1.jpg`, title: 'Smart Watch', categoryList: [
                { qty: '1' },
                { status: 'In Stock', statusBgColor: 'text-success' },
            ], price: '1,299.00'
        },
        {
            id: 2, img: `${import.meta.env.BASE_URL}images/ecommerce/jpg/3.jpg`, title: 'Flowers', categoryList: [
                { qty: '2' },
                { value: 'Free shipping', valueBgColor: 'bg-pink-transparent' },
            ], price: '179.29'
        },
        {
            id: 3, img: `${import.meta.env.BASE_URL}images/ecommerce/jpg/5.jpg`, title: 'Running Shoes', categoryList: [
                { qty: '4' },
                { status: 'Out Stock', statusBgColor: 'text-danger' },
            ], price: '29.00'
        },
        {
            id: 4, img: `${import.meta.env.BASE_URL}images/ecommerce/jpg/4.jpg`, title: 'Furniture', categoryList: [
                { value: 'Gray', valueBgColor: '' },
                { value: '50LB', valueBgColor: '' },
            ], price: '4,999.00'
        },
        {
            id: 5, img: `${import.meta.env.BASE_URL}images/ecommerce/jpg/6.jpg`, title: 'Tourist Bag', categoryList: [
                { qty: '1' },
                { status: 'In Stock', statusBgColor: 'text-success' },
            ], price: '129.00'
        },
    ];