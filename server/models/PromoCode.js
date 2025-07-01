//code
//discount
//expiryDate
//createdAt
//updatedAt

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const promoCodeSchema = new Schema({
    code: {
        type: String,
        required: [true, 'Promo code is required'],
        unique: true,
        trim: true,
        uppercase: true,
        minlength: [4, 'Promo code must be at least 4 characters'],
        maxlength: [20, 'Promo code cannot be longer than 20 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        minlength: [10, 'Description must be at least 10 characters long']
    },
    discountType: {
        type: String,
        enum: {
            values: ['percentage', 'fixed'],
            message: 'Discount type must be either "percentage" or "fixed"'
        },
        required: [true, 'Discount type is required']
    },
    discountValue: {
        type: Number,
        required: [true, 'Discount value is required'],
        min: [0, 'Discount value cannot be negative'],
        validate: {
            validator: function(value) {
                if (this.discountType === 'percentage') {
                    return value <= 100;
                }
                return true;
            },
            message: 'Percentage discount cannot exceed 100%'
        }
    },
    minOrderAmount: {
        type: Number,
        required: [true, 'Minimum order amount is required'],
        min: [0, 'Minimum order amount cannot be negative']
    },
    maxDiscount: {
        type: Number,
        required: [
            function() { return this.discountType === 'percentage'; },
            'Maximum discount is required for percentage discounts'
        ],
        min: [0, 'Maximum discount cannot be negative'],
        validate: {
            validator: function(value) {
                if (this.discountType === 'percentage' && this.discountValue) {
                    return value <= (this.discountValue / 100) * 1000; // Assuming 1000 is a reasonable max order amount
                }
                return true;
            },
            message: 'Maximum discount is too high for the given percentage'
        }
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
        default: Date.now,
        validate: {
            validator: function(value) {
                return value <= this.endDate;
            },
            message: 'Start date must be before end date'
        }
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required'],
        validate: {
            validator: function(value) {
                return value > this.startDate;
            },
            message: 'End date must be after start date'
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    usageLimit: {
        type: Number,
        required: true,
        min: 1
    },
    usedCount: {
        type: Number,
        default: 0,
        min: 0
    },
    applicableCategories: [{
        type: String,
        enum: ['all', 'pizza', 'burger', 'sushi', 'pasta', 'salad', 'dessert', 'beverage'],
        default: ['all']
    }],
    applicableRestaurants: [{
        type: Schema.Types.ObjectId,
        ref: 'Restaurant'
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index for faster queries
promoCodeSchema.index({ code: 1, isActive: 1 });

// Virtual for checking if promo code is valid
promoCodeSchema.virtual('isValid').get(function() {
    const now = new Date();
    return (
        this.isActive &&
        this.usedCount < this.usageLimit &&
        this.startDate <= now &&
        this.endDate >= now
    );
});

// Method to apply promo code to an order
promoCodeSchema.methods.applyPromo = function(orderAmount) {
    if (!this.isValid) {
        throw new Error('Promo code is not valid');
    }
    
    if (orderAmount < this.minOrderAmount) {
        throw new Error(`Minimum order amount of $${this.minOrderAmount} required`);
    }
    
    let discount = 0;
    
    if (this.discountType === 'percentage') {
        discount = (this.discountValue / 100) * orderAmount;
        // Apply max discount if set
        if (this.maxDiscount && discount > this.maxDiscount) {
            discount = this.maxDiscount;
        }
    } else {
        discount = this.discountValue;
    }
    
    // Ensure discount doesn't exceed order amount
    discount = Math.min(discount, orderAmount);
    
    return {
        discount: parseFloat(discount.toFixed(2)),
        finalAmount: parseFloat((orderAmount - discount).toFixed(2))
    };
};

const PromoCode = mongoose.model('PromoCode', promoCodeSchema);

module.exports = PromoCode;