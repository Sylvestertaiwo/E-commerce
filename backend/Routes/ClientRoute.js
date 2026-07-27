const express = require("express")
const { categoriesInfo, productInfo, productID, relatedProduct, productSuggestion,  } = require("../Controllers/ClientController")
const { requireAuth } = require("../Controllers/AuthController")
const router = express.Router()

router.get("/categories", categoriesInfo)

router.get("/products", productInfo)

router.get("/products/suggestions", productSuggestion)

router.get("/products/:id", productID)

router.get("/products/:id/related", relatedProduct)


module.exports = router