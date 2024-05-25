import "@stdlib/deploy";

import "./msg/token_burn_notification.tact";
import "./msg/token_excesses.tact";
import "./msg/token_transfer_internal.tact";

import "./jetton_group.tact";
import "./jetton_wallet.tact";

const MaxSupply: Int = 1000000000000000000000000000;

struct JettonData {
    total_supply: Int as coins;
    admin_address: Address;
    mintable: Bool;
    jetton_content: Cell;
    jetton_wallet_code: Cell;
}

message Mint {
    query_id: Int as uint64;
}

message AddGroup {
    query_id: Int as uint64;
}

message TokenUpdateContent {
    jetton_content: Cell;
}

@interface("org.ton.jetton.master")
contract JettonMaster with Deployable {
    seq_num: Int;
    total_supply: Int as coins;
    mintable: Bool;
    admin_address: Address;
    jetton_content: Cell;
    handled_amount: Int;

    init(jetton_content: Cell) {
        self.handled_amount = 0;
        self.seq_num = 0;
        self.total_supply = 0;
        self.mintable = true;
        self.admin_address = sender();
        self.jetton_content = jetton_content;
    }

    receive(msg: AddGroup) {
        let ctx: Context = context();
        require(ctx.sender == self.admin_address, "Not Admin");

        self.seq_num = self.seq_num + 1;

        let group_wallet: StateInit = self.get_jetton_group(self.seq_num, sender());

        send(SendParameters{
            to: contractAddress(group_wallet),
            value: 0,
            bounce: false,
            mode: SendRemainingValue,
            body: TokenTransferInternal{
                query_id: msg.query_id,
                amount: 0,
                from: myAddress(),
                response_destination: self.admin_address,
                forward_ton_amount: 0,
                forward_payload: emptySlice()
            }.toCell(),
            code: group_wallet.code,
            data: group_wallet.data
        });
    }

    receive(msg: Mint) {
        let ctx: Context = context();
        require(ctx.sender == self.admin_address || ctx.sender == myAddress(), "Invalid sender");
        require(self.mintable, "Can't Mint Anymore");

        // нужно проверить деление на 0!!!
        if (self.seq_num == 0) {
            return;
        }

        self.total_supply = self.total_supply + 100000000000;
        let to_send: Int = self.total_supply / self.seq_num;

        repeat(min(100, self.seq_num - self.handled_amount)) {
            self.handled_amount = self.handled_amount + 1;

            send(SendParameters{
                to: self.get_jetton_group_address(self.handled_amount, ctx.sender),
                value: 0,
                bounce: true,
                mode: SendRemainingValue,
                body: TokenTransferInternal{
                    query_id: msg.query_id,
                    amount: to_send,
                    from: myAddress(),
                    // Тот, кому нужно возвращать сдачу
                    response_destination: self.admin_address,
                    // Если мы хотим оповестить кошелек получателя о зачислении жетонов,
                    // то нужно положительное значение
                    forward_ton_amount: 0,
                    forward_payload: emptySlice()
                }.toCell()
            });
        }

        if (self.seq_num == self.handled_amount) {
            self.handled_amount = 0;
            return;
        }

        send(SendParameters{
            to: myAddress(),
            value: 0,
            mode: SendRemainingValue + SendIgnoreErrors,
            body: Mint{
                query_id: msg.query_id
            }.toCell()
        });
    }

    receive(msg: TokenUpdateContent) {
        let ctx: Context = context();
        require(ctx.sender == self.admin_address, "Invalid sender");

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

    fun get_jetton_group(seq_num: Int, admin: Address): StateInit {
        return initOf JettonGroup(seq_num, myAddress(), admin);
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

    get fun get_wallet_address(owner: Address): Address {
        return contractAddress(self.get_jetton_wallet(owner));
    }

    get fun get_jetton_group_address(seq_num: Int, owner: Address): Address {
        return contractAddress(self.get_jetton_group(seq_num, owner));
    }

    get fun get_seq_num(): Int {
        return self.seq_num;
    }
}
