import "@stdlib/deploy";

import "./msg/token_burn_notification.tact";
import "./msg/token_excesses.tact";
import "./msg/token_transfer_internal.tact";

import "./jetton_wallet.tact";

struct JettonData {
    total_supply: Int as coins;
    admin_address: Address;
    mintable: Bool;
    jetton_content: Cell;
    jetton_wallet_code: Cell;
}

message Mint {
    query_id: Int as uint64;
    amount: Int as coins;
}

message TokenUpdateContent {
    jetton_content: Cell;
}

@interface("org.ton.jetton.master")
contract JettonMaster with Deployable {
    total_supply: Int as coins;
    mintable: Bool;
    admin_address: Address;
    jetton_content: Cell;

    init(jetton_content: Cell) {
        self.total_supply = 0;
        self.mintable = true;
        self.admin_address = sender();
        self.jetton_content = jetton_content;
    }

    receive(msg: Mint) {
        let ctx: Context = context();
        require(ctx.sender == self.admin_address, "Not Admin");
        require(self.mintable, "Can't Mint Anymore");

        self.total_supply = self.total_supply + msg.amount;

        let jetton_wallet: StateInit = self.get_jetton_wallet(self.admin_address);

        send(SendParameters{
            to: contractAddress(jetton_wallet),
            value: 0,
            bounce: false,
            mode: SendRemainingValue,
            body: TokenTransferInternal{
                query_id: msg.query_id,
                amount: msg.amount,
                from: myAddress(),
                // Тот, кому нужно возвращать сдачу
                response_destination: self.admin_address,
                // Если мы хотим оповестить кошелек получателя о зачислении жетонов,
                // то нужно положительное значение
                forward_ton_amount: 0,
                forward_payload: emptySlice()
            }.toCell(),
            code: jetton_wallet.code,
            data: jetton_wallet.data
        });
    }

    receive(msg: TokenUpdateContent) {
        let ctx: Context = context();
        require(ctx.sender == self.admin_address, "Not Admin");

        self.jetton_content = msg.jetton_content;
    }

    receive(msg: TokenBurnNotification) {
        let ctx: Context = context();
        require(self.get_wallet_address(msg.owner) == ctx.sender, "Invalid sender");

        self.total_supply = self.total_supply - msg.amount;

        if (msg.response_destination != null) {
            send(SendParameters{
                to: msg.response_destination!!,
                value: 0,
                bounce: false,
                mode: SendRemainingValue + SendIgnoreErrors,
                body: TokenExcesses{
                    query_id: msg.query_id
                }.toCell()
            });
        }
    }

    fun get_jetton_wallet(owner: Address): StateInit {
        return initOf JettonWallet(myAddress(), owner);
    }

    get fun get_jetton_data(): JettonData {
        return JettonData {
            total_supply: self.total_supply,
            mintable: self.mintable,
            admin_address: self.admin_address,
            jetton_content: self.jetton_content,
            jetton_wallet_code: self.get_jetton_wallet(myAddress()).code
        };
    }

    fun get_wallet_address(owner: Address): Address {
        return contractAddress(self.get_jetton_wallet(owner));
    }
}
