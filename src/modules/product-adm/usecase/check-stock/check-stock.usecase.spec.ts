import Id from "../../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import ProductAdmFacadeFactory from "../../factory/facade.factory";
import { ProductModel } from "../../repository/product.model";
import CheckStockUseCase from "./check-stock.usecase";
import { Sequelize } from "sequelize-typescript";


const product = new Product({
    id: new Id("1"),
    name: "Product",
    description: "Product description",
    purchasePrice: 100,
    stock: 10,
});

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
    };
};

describe("CheckStock usecase unit test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });
    it("should get stock of a product", async () => {
        const ProductRepository = MockRepository();
        const checkStockUseCase = new CheckStockUseCase(ProductRepository);
        const input = {
            productId: "1",
        };

        const result = await checkStockUseCase.execute(input);

        expect(ProductRepository.find).toHaveBeenCalled();
        expect(result.productId).toBe("1");
        expect(result.stock).toBe(10);
    });

    it("should check product stock", async () => {
        const productFacade = ProductAdmFacadeFactory.create();
        const input = {
            id: "1",
            name: "Product 1",
            description: "Product 1 description",
            purchasePrice: 10,
            stock: 10,
        };
        await productFacade.addProduct(input);

        const result = await productFacade.checkStock({ productId: "1" });

        expect(result.productId).toBe(input.id);
        expect(result.stock).toBe(input.stock);
    });
});
