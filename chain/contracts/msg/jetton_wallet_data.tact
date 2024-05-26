struct JettonWalletData {
    jetton_wallet_code: Cell;
    jetton: Address;
    owner: Address;
    balance: Int;
    prev_member: Address?;
}