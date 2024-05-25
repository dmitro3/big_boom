import "./msg/jetton_group_data.tact";
import "./msg/token_excesses.tact";
import "./msg/token_notification.tact";
import "./msg/token_transfer_internal.tact";

import "./jetton_wallet.tact";

message AddToGroup {
    // Владелец главного кошелька (не токенов, а тонов)
    query_id: Int as uint64;
    from: Address;
    member: Address;
}

contract JettonGroup {
    const minTonsForStorage: Int = ton("0.01");
    const gasConsumption: Int = ton("0.01");

    jetton: Address;
    owner: Address;
    balance: Int as coins;
    last_member: Address;

    seq_num: Int;
    mintable: Bool;

    init(seq_num: Int, jetton: Address, owner: Address) {
        self.balance = 0;
        self.seq_num = seq_num;
        self.mintable = true;
        self.jetton = jetton;
        self.owner = owner;
        self.last_member = owner;
    }

    receive(msg: AddToGroup) {
        // 1. Может добавлять только валидный кошелек жетонов
        let ctx: Context = context();
        require(self.get_wallet_address(msg.from) == ctx.sender, "Invalid sender");

        // 2. Меняем цепочку владельцев
        let jetton_wallet: StateInit = self.get_jetton_wallet(msg.from);
        send(SendParameters{
            to: contractAddress(jetton_wallet),
            value: 0,
            bounce: false,
            mode: SendRemainingValue,
            body: TokenTransferInternal{
                query_id: msg.query_id,
                amount: 0,
                from: myAddress(),
                response_destination: msg.from,
                forward_ton_amount: 0,
                forward_payload: self.last_member
            }.toCell(),
            code: jetton_wallet.code,
            data: jetton_wallet.data
        });
        self.last_member = msg.from;
    }

    receive(msg: TokenTransferInternal) { // 0x178d4519
        let ctx: Context = context();

        // Отправить жетоны может только мастер контракт
        require(self.jetton == ctx.sender, "Invalid sender!");

        // Update balance
        self.balance = self.balance + msg.amount;
        require(self.balance >= 0, "Invalid balance");

        // Get value for gas
        let msgValue: Int = self.msgValue(ctx.value);
        let fwdFee: Int = ctx.readForwardFee();
        msgValue = msgValue - msg.forward_ton_amount - fwdFee;

        // 0x7362d09c - notify the new owner of JettonToken that the transfer is complete
        if (msg.forward_ton_amount > 0) {
            send(SendParameters{
                to: self.owner,
                value: msg.forward_ton_amount,
                mode: SendPayGasSeparately + SendIgnoreErrors,
                bounce: false,
                body: TokenNotification {
                    query_id: msg.query_id,
                    amount: msg.amount,
                    from: msg.from,
                    forward_payload: msg.forward_payload
                }.toCell()
            });
        }

        // 0xd53276db -- Cashback to the original Sender
        if (msg.response_destination != null) {
            send(SendParameters {
                to: msg.response_destination,
                value: msgValue,
                bounce: false,
                body: TokenExcesses {
                    query_id: msg.query_id
                }.toCell(),
                mode: SendIgnoreErrors
            });
        }
    }

    get fun msgValue(value: Int): Int {
        let msgValue: Int = value;
        let tonBalanceBeforeMsg: Int = myBalance() - msgValue;
        let storageFee: Int = self.minTonsForStorage - min(tonBalanceBeforeMsg, self.minTonsForStorage);
        msgValue = msgValue - (storageFee + self.gasConsumption);
        return msgValue;
    }

    get fun get_owner(): Address {
        return self.owner;
    }

    fun get_jetton_group(): StateInit {
        return initOf JettonGroup(self.seq_num, self.jetton, self.owner);
    }

    fun get_jetton_wallet(owner: Address): StateInit {
        return initOf JettonWallet(self.jetton, owner);
    }

    fun get_wallet_address(owner: Address): Address {
        return contractAddress(self.get_jetton_wallet(owner));
    }

    get fun get_wallet_data(): JettonGroupData {
        return JettonGroupData{
            balance: self.balance,
            owner: self.owner,
            jetton: self.jetton,
            jetton_wallet_code: self.get_jetton_group().code
        };
    }
}