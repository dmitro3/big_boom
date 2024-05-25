import "./msg/token_excesses.tact";
import "./msg/token_notification.tact";
import "./msg/token_transfer_internal.tact";

contract JettonGroup {
    const minTonsForStorage: Int = ton("0.01");
    const gasConsumption: Int = ton("0.01");

    seq_num: Int;
    mintable: Bool;
    balance: Int;
    jetton: Address;
    owner: Address;

    init(seq_num: Int, jetton: Address, owner: Address) {
        self.balance = 0;
        self.seq_num = seq_num;
        self.mintable = true;
        self.jetton = jetton;
        self.owner = owner;
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
}