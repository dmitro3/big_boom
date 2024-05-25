struct JettonWalletData {
    jetton_wallet_code: Cell;
    jetton: Address;
    owner: Address;
    balance: Int;
    next_member: Address?;
}