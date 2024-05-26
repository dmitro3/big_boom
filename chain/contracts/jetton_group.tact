import "./msg/group_creating.tact";
import "./msg/jetton_group_data.tact";
import "./msg/token_excesses.tact";
import "./msg/token_notification.tact";
import "./msg/token_transfer_internal.tact";

import "./jetton_wallet.tact";

message AddToGroup {
    query_id: Int as uint64;
    // Владелец главного кошелька Ton-ов
    from: Address;
    // Владелец приглашаемого кошелька Ton-ов
    member: Address;
}

contract JettonGroup {
    const minTonsForStorage: Int = ton("0.01");
    const gasConsumption: Int = ton("0.01");

    jetton: Address;
    owner: Address;

    member_last: Address;
    member_pointer: Address;

    seq_num: Int;
    members_count: Int;

    init(seq_num: Int, jetton: Address, owner: Address) {
        self.jetton = jetton;
        self.owner = owner;

        self.member_last = owner;
        self.member_pointer = owner;

        self.seq_num = seq_num;
        self.members_count = 0;
    }

    receive(msg: AddToGroup) {
        // 1. Может добавлять только валидный кошелек жетонов
        require(self.get_wallet_address(msg.from) == sender(), "Invalid sender");

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
                forward_payload: self.member_last
            }.toCell(),
            code: jetton_wallet.code,
            data: jetton_wallet.data
        });
        self.member_last = msg.from;
        self.members_count = self.members_count + 1;
    }

    receive(msg: GroupCreating) {
        let ctx: Context = context();

        // Cоздать группу может только мастер контракт
        require(self.jetton == ctx.sender, "Invalid sender!");

        // Get value for gas
        let msgValue: Int = self.msgValue(ctx.value) - ctx.readForwardFee();
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

    get fun get_group_data(): JettonGroupData {
        return JettonGroupData{
            owner: self.owner,
            jetton: self.jetton,
            jetton_wallet_code: self.get_jetton_group().code
        };
    }
}