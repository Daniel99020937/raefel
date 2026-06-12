const router = require("express").Router();
const controller = require("../controllers/productController");

router.get("/", controller.listar);
router.get("/:id", controller.buscarPorId);
router.post("/", controller.criar);
router.put("/:id", controller.editar);
router.delete("/:id", controller.excluir);

router.patch("/:id/estoque", controller.ajustarEstoque);

module.exports = router;
