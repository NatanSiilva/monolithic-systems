import express, { Request, Response } from "express";
import AddClientUseCase from "../../../modules/client-adm/usecase/add-client/add-client.usecase";
import ClientRepository from "../../../modules/client-adm/repository/client.repository.";
import Address from "../../../@shared/domain/value-object/address";

export const clientsRoute = express.Router();

clientsRoute.post("/", async (req: Request, res: Response) => {
    const usecase = new AddClientUseCase(new ClientRepository());
    try {
        const req_body = req.body;

        const clientAddDto = {
            name: req_body.name,
            email: req_body.email,
            document: req_body.document,
            address: new Address({
                street: req_body.street,
                number: req_body.number,
                complement: req_body.complement,
                city: req_body.city,
                state: req_body.state,
                zipCode: req_body.zipCode,
            }),
        };

        const output = await usecase.execute(clientAddDto);

        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});
