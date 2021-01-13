export class Product{
    id: number;
  productName: string;
  specialOffer: number;
  normalPrice: number;
  imageName: string;
  description: string;

  constructor(
    id: number,
    productName: string,
    specialOffer: number,
    normalPrice: number,
    imageName: string,
    description: string
  ) {
    this.id = id;
    this.productName = productName;
    this.specialOffer = specialOffer;
    this.normalPrice = normalPrice;
    this.imageName = imageName;
    this.description = description;
  }
}

export class ShoppingCart{
    products: Product[]

    constructor() {
      this.products = new Array();
    }

    public getTotalPrice(): number {
      let price:number = 0.00;
  
      this.products.forEach(product => {
        if (product.specialOffer == 0 || product.specialOffer == undefined || product.specialOffer == null) {
          price += product.normalPrice
        } else {
          price += product.specialOffer
        }
      });
  
      return price;
    }
}