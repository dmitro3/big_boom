import "@stdlib/deploy";

import "./msg/group_creating.tact";
import "./msg/token_burn_notification.tact";
import "./msg/token_excesses.tact";
import "./msg/token_transfer_internal.tact";

import "./jetton_group.tact";
import "./jetton_wallet.tact";

struct JettonData {
    total_supply: Int as coins;
    admin_address: Address;
    mintable: Bool;
    jetton_content: Cell;
    jetton_wallet_code: Cell;

    groups_count: Int;
    groups_handled: Int;
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
    total_supply: Int as coins;
    admin_address: Address;
    mintable: Bool;
    jetton_content: Cell;

    groups_count: Int;
    groups_handled: Int;

    init(jetton_content: Cell) {
        self.groups_handled = 0;
        self.groups_count = 0;
        self.total_supply = 0;
        self.mintable = true;
        self.admin_address = sender();
        self.jetton_content = jetton_content;
    }

    receive(msg: AddGroup) {
        let ctx: Context = context();
        require(ctx.sender == self.admin_address, "Not Admin");

        self.groups_count = self.groups_count + 1;

        let group_wallet: StateInit = self.get_jetton_group(self.groups_count, sender());

        send(SendParameters{
            to: contractAddress(group_wallet),
            value: 0,
            bounce: false,
            mode: SendRemainingValue,
            body: GroupCreating{
                query_id: msg.query_id
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
        if (self.groups_count == 0) {
            return;
        }

        self.total_supply = self.total_supply + 100000000000;
        let to_send: Int = self.total_supply / self.groups_count;

        repeat(min(100, self.groups_count - self.groups_handled)) {
            self.groups_handled = self.groups_handled + 1;

            send(SendParameters{
                to: self.get_jetton_group_address(self.groups_handled, ctx.sender),
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
                    forward_payload: null
                }.toCell()
            });
        }

        if (self.groups_count == self.groups_handled) {
            self.groups_handled = 0;
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

    fun get_jetton_group(groups_count: Int, admin: Address): StateInit {
        return initOf JettonGroup(groups_count, myAddress(), admin);
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
            jetton_wallet_code: self.get_jetton_wallet(myAddress()).code,
            groups_count: self.groups_count,
            groups_handled: self.groups_handled
        };
    }

    get fun get_wallet_address(owner: Address): Address {
        return contractAddress(self.get_jetton_wallet(owner));
    }

    get fun get_jetton_group_address(groups_count: Int, owner: Address): Address {
        return contractAddress(self.get_jetton_group(groups_count, owner));
    }
}
