export default interface clothing_item {
    id: number;
    outfit_id: number;
    type: string; // T-shirt, Jeans, Shoes, etc.
    color: string;
    rating: number;
    price: number;
    purchase_link: string;
    image_url: string;
}
