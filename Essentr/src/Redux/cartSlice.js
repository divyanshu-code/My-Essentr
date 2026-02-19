const { createSlice } = require("@reduxjs/toolkit");

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cartItems: [],
        subTotal : 0 ,
        deliveryFee : 50,
        Total : 50
    },
    reducers: {
        addToCart: (state, action) => {
            const itemIndex = state.cartItems.findIndex(i => i._id === action.payload._id);
            if (itemIndex >= 0) {
                state.cartItems[itemIndex].quantity += 1;
            } else {
                state.cartItems.push({ ...action.payload, quantity: 1 });
                vendorId: action.payload.vendorId || action.payload.vendor
            }

            cartSlice.caseReducers.calculatePrice(state) ;
        },
        removeFromCart: (state, action) => {
            const itemIndex = state.cartItems.findIndex(i => i._id === action.payload._id);
            if (itemIndex >= 0) {
                if (state.cartItems[itemIndex].quantity > 1) {
                    state.cartItems[itemIndex].quantity -= 1;
                } else {
                    state.cartItems.splice(itemIndex, 1);
                }
            }

            cartSlice.caseReducers.calculatePrice(state) ;
        },

        calculatePrice: (state) => {
            state.subTotal = state.cartItems.reduce((total, item) => {
                return total + (item.price * item.quantity);
            }, 0);

            if (state.cartItems.length === 0) {
                state.deliveryFee = 0;
            } else {
                state.deliveryFee = state.subTotal > 150 ? 0 : 50;
            }
            
            state.Total = state.subTotal + state.deliveryFee;
        }
    }
})

export const { addToCart , removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;