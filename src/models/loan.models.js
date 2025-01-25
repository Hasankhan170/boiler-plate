import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
  {
    loanType: { 
      type: String, 
      required: true, 
      enum: ["Wedding Loan", "Home Construction Loan", "Business Startup Loan", "Education Loan"] 
    },
    subcategory: { 
      type: String, 
      required: true, 
      enum: [
        // Wedding Loan Subcategories
        "Valima", "Furniture", "Valima Food", "Jahez", 
        // Home Construction Loan Subcategories
        "Structure", "Finishing", 
        // Business Startup Loan Subcategories
        "Buy Stall", "Advance Rent for Shop", "Shop Assets", "Shop Machinery",
        // Education Loan Subcategories
        "University Fees", "Child Fees Loan"
      ] 
    },
    amount: { type: Number, required: true },
    duration: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending", 
    },
  },
  { timestamps: true }
);

export default mongoose.model("Loan", loanSchema);
