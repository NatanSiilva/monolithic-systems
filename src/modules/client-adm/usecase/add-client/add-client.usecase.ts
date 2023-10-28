
import Address from "../../../../@shared/domain/value-object/address";
import Id from "../../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import ClientGateway from "../../gateway/client.gateway";
import {
    AddClientInputDto,
    AddClientOutputDto,
} from "./add-client.usecase.dto";

export default class AddClientUseCase {
    private _clientRepository: ClientGateway;

    constructor(clientRepository: ClientGateway) {
        this._clientRepository = clientRepository;
    }

    async execute(input: AddClientInputDto): Promise<AddClientOutputDto> {
        const props = {
            id: new Id(input.id),
            name: input.name,
            email: input.email,
            document: input.document,
            address: new Address({
                street: input.address.street,
                number: input.address.number,
                complement: input.address.complement,
                city: input.address.city,
                state: input.address.state,
                zipCode: input.address.zipCode,
            }),
        };

        const client = new Client(props);
        await this._clientRepository.add(client);

        return {
            id: client.id.id,
            name: client.name,
            email: client.email,
            document: client.document,
            address: new Address({
                street: client.address.street,
                number: client.address.number,
                complement: client.address.complement,
                city: client.address.city,
                state: client.address.state,
                zipCode: client.address.zipCode,
            }),
            createdAt: client.createdAt,
            updatedAt: client.updatedAt,
        };
    }
}
