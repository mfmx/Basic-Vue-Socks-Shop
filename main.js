
const eventBus = new Vue()

Vue.component('product-tabs', {
    props:{
        reviews:{
            type:Array,
            required:true
        }
    },
    template:`
    <div>
        <button class="tab " 
             :class="{activeTab: selectedTab === tab}"
              v-for="(tab, index) in tabs" 
              :key="index"
              @click="selectedTab = tab">
              {{tab}}
        </button>
        <div v-show="selectedTab === 'Reviews' ">
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul>
                <li v-for="review in reviews">
                    <p>{{review.name}}</p>
                    <p>{{review.review}}</p>
                    <p>{{review.rating}}</p>            
                </li>
            </ul>
        </div>
        <product-review v-show="selectedTab === 'Add a Review'"></product-review>
    </div>
    `,
    data(){
        return{
            tabs:["Reviews", "Add a Review"],
            selectedTab: 'Reviews'
        }
    }
})
Vue.component('product-details', {
    props:{
        details:{
            type:Array,
            required:true
        }
    },
    template:`
    <ul>
            <li v-for="detail in details">{{detail}}</li>
        </ul>
    `
})

Vue.component('product', {
props: {
    premium:{
        type: Boolean,
        required: true
    }
},
template: `
<div class="product">
    <div class="product-deets">
        <div class="product-image">
            <img :src="image" />
        </div>
        <div class="product-info">
            <h1>{{title}}</h1>
            <p v-if="inStock">In Stock</p>
            <p v-else :class="{ outOfStock: !inStock }">Out of Stock</p>
            <p>{{ sale }}</p>
            <p>Shipping : {{shipping}}</p>
            
            <product-details :details="details"></product-details>
            <div>
                <p>Colors:</p>
                <button class="btn-secondary" 
                    @click="updateProduct(index)" 
                    v-for="(variant, index) in variants" 
                    :key="variant.variantId">
                    {{variant.variantColor}}
                </button>
            </div>
            <button 
            :class="{disabledButton: !inStock }" 
            v-on:click="addToCart" 
            :disabled="!inStock" 
            class="btn"> Add to Cart</button>
            <p class="clear-cart" @click="clearCart">Remove Item</p>      
        </div>
    </div>
    <div class="product-review">
        <h2>Reviews</h2>
        <product-tabs :reviews="reviews"></product-tabs>
    </div>
</div>`,
data(){
    return{
    brand: "Xavier",
    product: 'Socks',
    selectedVariant: 0,
    details: ["90% cotton","10% polyester", "Gender-neutral"],
    variants:[{
        variantId: 2224,
        variantColor: "BLUE",
        variantImage: './assets/images/blueSocks.jpg',
        variantQuantity: 10,
        onSale: true

        },
        {
        variantId: 2225,
        variantColor: "BLACK",
        variantImage: './assets/images/blackSocks.jpg',
        variantQuantity: 0,
        onSale: false
        }
    ],
    reviews: [] 
    }
},
methods: {
    addToCart (){
        //this.cart +=1
        this.$emit('add-to-cart-event-name', this.variants[this.selectedVariant].variantId)
    },
    clearCart (){
        //this.cart = 0;
        this.$emit('clear-cart-event-name', this.variants[this.selectedVariant].variantId)

    }, 
    updateProduct (index){
        this.selectedVariant = index
    }
},
computed:{
    title (){
        return this.brand + ' ' + this.product;
    },
    image (){
        return this.variants[this.selectedVariant].variantImage;
    },
    inStock (){
        return this.variants[this.selectedVariant].variantQuantity;
    },
    sale (){
        if(this.variants[this.selectedVariant].onSale){
            return this.title +' are on Sale!'
        }
        return this.title + ' are not on sale'
    },
    shipping() {
       if(this.premium){
           return "Free"
       }
       return 2.99
    }    
},
mounted(){
    eventBus.$on('review-submitted', productReview => {
        this.reviews.push(productReview)
    })

}
})

Vue.component('product-review', {
    template:`
    <form class="review-form"   @submit.prevent="onSubmit">
        <p class="errors" v-if="errors.length"> 
            <b> Please correct the following error(s):</b>
            <ul>
                <li v-for="error in errors">
                {{error}}</li>
            </ul>
        </p>
        <p> 
            <label for="name">Name</label>
            <input id="name" v-model="name"/>
        </p>
        <p> 
            <label for="review">Review:</label>
            <textarea id="review" v-model="review"></textarea>
        </p>
        <p> 
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>

            </select>
        </p>
        <p><input class="btn" type="submit" value="submit"/></p>
    </form>
    `,
    data() {
        return{
            name: null,
            review: null,
            rating: null,
            errors:[]
        }
    },
    methods:{
        onSubmit() {
            if(this.name && this.review &&  this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
            }
            else{
                if(!this.name) {
                    this.errors.push("Name required.")
                }
                if(!this.review) {
                    this.errors.push("Review required")
                }
                if(!this.rating) {
                    this.errors.push("Rating required")
                }
            }
            
        }
    }
})

const app= new Vue ({
    el:'#app',
    data:{
        premium: true,
        cart: [],
    },
    methods:{
        updateCart(id) {
              this.cart.push(id)
        },
        removeItem(id) {
           
            for( let i = this.cart.length - 1; i >=0; i--) {
                if (this.cart[i] === id) {
                    this.cart.splice(i, 1);
                 }
            }
        }
    }
    
})