import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import Address from "../../../@shared/domain/value-object/address";
import ClientRepository from "../repository/client.repository.";
import ClientAdmFacade from "./client-adm.facade";
import FindClientUseCase from "../usecase/find-client/find-client.usecase";
import ClientAdmFacadeFactory from "../factory/client-adm.facade.factory";

describe("Client Adm Facade test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([ClientModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a client with facade", async () => {
        const repository = new ClientRepository();
        const addUsecase = new AddClientUseCase(repository);
        const facade = new ClientAdmFacade({
            addUsecase: addUsecase,
            findUsecase: undefined,
        });

        const input = {
            id: "1",
            name: "Lucian",
            email: "lucian@xpto.com",
            document: "1234-5678",
            address: new Address({
                street: "Rua 123",
                number: "99",
                complement: "Casa Verde",
                city: "Criciúma",
                state: "SC",
                zipCode: "88888-888",
            }),
        };

        await facade.add(input);

        const client = await ClientModel.findOne({ where: { id: "1" } });

        expect(client).toBeDefined();
        expect(client.id).toEqual(input.id);
        expect(client.name).toBe(input.name);
        expect(client.email).toBe(input.email);
        expect(client.document).toBe(input.document);
        expect(client.street).toBe(input.address.street);
    });

    it("should find a client", async () => {
        // const repository = new ClientRepository();
        // const addUsecase = new AddClientUseCase(repository);
        // const findUseCase = new FindClientUseCase(repository);

        // const facade = new ClientAdmFacade({
        //     addUsecase: addUsecase,
        //     findUsecase: findUseCase,
        // });

        const facade = ClientAdmFacadeFactory.create();

        const input = {
            id: "1",
            name: "Lucian",
            email: "lucian@xpto.com",
            document: "1234-5678",
            address: new Address({
                street: "Rua 123",
                number: "99",
                complement: "Casa Verde",
                city: "Criciúma",
                state: "SC",
                zipCode: "88888-888",
            }),
        };

        await facade.add(input);

        const client = await facade.find({ id: "1" });

        expect(client).toBeDefined();
        expect(client.id).toBe(input.id);
        expect(client.name).toBe(input.name);
        expect(client.email).toBe(input.email);
        expect(client.document).toBe(input.document);
        expect(client.address.street).toBe(input.address.street);
        expect(client.address.number).toBe(input.address.number);
        expect(client.address.complement).toBe(input.address.complement);
        expect(client.address.city).toBe(input.address.city);
        expect(client.address.state).toBe(input.address.state);
        expect(client.address.zipCode).toBe(input.address.zipCode);
    });
});
